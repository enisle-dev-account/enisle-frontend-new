"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { request, useApiQuery } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";
import {
  CalendarIcon,
  Loader2,
  Info,
  Beaker,
  LucideClipboardList,
  CheckCircle2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { SingleLaboratoryRequestData } from "@/types/laboratory";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";

const parameterResultSchema = z.object({
  parameter_name: z.string(),
  value: z.string().min(1, "Required"),
  range: z.string().optional(),
});

const singleTestSchema = z.object({
  test_id: z.number(),
  request_type: z.string(),
  test_date: z.date({ required_error: "Date is required" }),
  result: z.array(parameterResultSchema),
});

const batchTestSchema = z.object({
  tests: z.array(singleTestSchema),
});

type BatchFormData = z.infer<typeof batchTestSchema>;

interface AddBatchTestFormProps {
  data: SingleLaboratoryRequestData[];
  consultationId: string;
  onSuccess?: () => void;
}

export function AddBatchTestForm({
  data: testsData,
  consultationId,
  onSuccess,
}: AddBatchTestFormProps) {
  const router = useRouter();
  const { showSuccess } = useSuccessModal();
  const [activeTab, setActiveTab] = useState<string>("");
  const [completedTests, setCompletedTests] = useState<Set<number>>(new Set());

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchTestSchema),
    defaultValues: { tests: [] },
  });

  const { fields: testFields, replace } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  const configQueries = useQueries({
    queries: (testsData ?? []).map((test) => ({
      queryKey: ["lab-test-config", test.investigation_request.request_id],
      queryFn: () =>
        request(
          `/hospital/lab-tests/${test.investigation_request.request_id}/`,
        ),
      enabled: !!testsData,
    })),
  });

  const isConfigsLoading = configQueries.some((q) => q.isLoading);

  useEffect(() => {
    if (testsData && !isConfigsLoading && testFields.length === 0) {
      const initialData = testsData.map((test, index) => {
        const config = configQueries[index]?.data;
        return {
          test_id: test.id,
          request_type: test.investigation_request.request_type,
          test_date: new Date(),
          result:
            config?.parameters?.map((p: any) => ({
              parameter_name: p.name,
              range: p.range || "",
              value: "",
            })) || [],
        };
      });
      replace(initialData);
      if (testsData.length > 0) setActiveTab(testsData[0].id.toString());
    }
  }, [testsData, isConfigsLoading, replace]);

  const saveMutation = useMutation({
    mutationFn: async ({
      testId,
      payload,
    }: {
      testId: number;
      payload: any;
    }) => {
      return request(`/laboratory/result/update/${testId}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: (_, variables) => {
      setCompletedTests((prev) => new Set([...prev, variables.testId]));
      showSuccess("Result saved successfully");
    },
  });

  const handleSaveSingle = async (index: number) => {
    const testData = form.getValues(`tests.${index}`);
    const isValid = await form.trigger(`tests.${index}`);

    if (isValid) {
      const payload = {
        test: testData.test_id,
        test_date: format(testData.test_date, "yyyy-MM-dd"),
        result: testData.result.map((r) => ({
          parameter_name: r.parameter_name,
          value: r.value,
        })),
      };
      saveMutation.mutate({ testId: testData.test_id, payload });
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full "
        >
     
          <div className="flex items-center justify-between bg-background rounded-xl py-1 mb-4 px-6">
            <TabsList className=" bg-white flex gap-4 py-3 ">
              {testFields.map((field) => (
                <TabsTrigger
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-5 py-6r flex gap-x-3 items-center"
                  key={field.id}
                  value={field.test_id.toString()}
                >
                  <span className="flex items-center gap-2">
                    {field.request_type}
                    {completedTests.has(field.test_id) && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="text-sm text-muted-foreground">
              {completedTests.size} of {testFields.length} completed
            </div>
          </div>

          {testFields.map((field, index) => (
            <TabsContent
              key={field.id}
              value={field.test_id.toString()}
              className="space-y-6 bg-background p-6 rounded-xl focus-visible:outline-none"
            >
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Beaker className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Test {index + 1}
                      </p>
                      <h2 className="text-lg font-bold">
                        {field.request_type}
                      </h2>
                    </div>
                  </div>
                  {completedTests.has(field.test_id) && (
                    <Badge className="bg-green-100 text-green-700">Saved</Badge>
                  )}
                </div>

                {/* Date Selection */}
                <FormField
                  control={form.control}
                  name={`tests.${index}.test_date`}
                  render={({ field: dateField }) => (
                    <FormItem className="flex flex-col max-w-xs">
                      <FormLabel>Result Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-11 rounded-xl justify-start font-normal",
                                !dateField.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateField.value
                                ? format(dateField.value, "PPP")
                                : "Pick date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateField.value}
                            onSelect={dateField.onChange}
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Parameters Grid */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <LucideClipboardList className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-bold text-slate-700">
                      Test Parameters
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {field.result.map((_, pIndex) => (
                      <FormField
                        key={`${field.id}-param-${pIndex}`}
                        control={form.control}
                        name={`tests.${index}.result.${pIndex}.value`}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <div className="flex justify-between items-center mb-1">
                              <FormLabel className="text-xs font-bold text-slate-600 truncate">
                                {field.result[pIndex].parameter_name}
                              </FormLabel>
                              {field.result[pIndex].range && (
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Info className="h-3 w-3" />{" "}
                                  {field.result[pIndex].range}
                                </span>
                              )}
                            </div>
                            <FormControl>
                              <Input
                                {...inputField}
                                placeholder="Result"
                                className="h-11 rounded-xl "
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => handleSaveSingle(index)}
                  disabled={
                    saveMutation.isPending || completedTests.has(field.test_id)
                  }
                  className="w-fit px-8  h-9 rounded-2xl border-primary text-primary bg-white hover:bg-gray-50"
                  variant={"outline"}
                >
                  {saveMutation.isPending && (
                    <Loader2 className="animate-spin" />
                  )}{" "}
                  Save This Test
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="pb-4">
          <Button
            onClick={() => {
              if (completedTests.size === testFields.length) {
                router.push("/laboratory/patients");
              } else {
                toast.error(
                  "Please save each test individually before finalizing.",
                );
              }
            }}
            className="w-fit h-12 px-8 rounded-full text-lg font-bold shadow-lg duration-300 bg-primary hover:bg-primary/70"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Finish & Return to List
          </Button>
        </div>
      </div>
    </Form>
  );
}
