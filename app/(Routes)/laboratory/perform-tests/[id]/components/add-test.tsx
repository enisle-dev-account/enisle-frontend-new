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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { request } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";
import {
  CalendarIcon,
  Loader2,
  Info,
  Beaker,
  LucideClipboardList,
  CheckCircle2,
  Droplet,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { SingleLaboratoryRequestData } from "@/types/laboratory";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import { HospitalLabTest, Parameter } from "@/types/hospital-configuations.type";

const parameterResultSchema = z.object({
  parameter_name: z.string(),
  value: z.string().min(1, "Required"),
  type: z.string().optional(),
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

const ICON_MAP: Record<string, any> = {
  beaker: Beaker,
  droplet: Droplet,
  heart: Heart,
  activity: Activity,
};

const COLOR_MAP: Record<string, string> = {
  blue: "#3B82F6",
  purple: "#A855F7",
  green: "#10B981",
  orange: "#F59E0B",
  pink: "#EC4899",
  cyan: "#06B6D4",
  red: "#EF4444",
};

function getParameterStatus(
  value: string,
  paramConfig?: Parameter,
): "normal" | "high" | "low" | "abnormal" | "unknown" {
  if (!value || !paramConfig) return "unknown";

  if (paramConfig.type === "numeric") {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "unknown";
    if (paramConfig.min === undefined || paramConfig.max === undefined) return "unknown";

    if (numValue < paramConfig.min) return "low";
    if (numValue > paramConfig.max) return "high";
    return "normal";
  }

  if (paramConfig.type === "categorical") {
    if (paramConfig.normal_values && paramConfig.normal_values.includes(value)) {
      return "normal";
    }
    return "abnormal";
  }

  return "unknown";
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
  const [testConfigs, setTestConfigs] = useState<Record<number, HospitalLabTest>>({});

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
        request(`/hospital/lab-tests/${test.investigation_request.request_id}/`),
      enabled: !!testsData,
    })),
  });

  const isConfigsLoading = configQueries.some((q) => q.isLoading);

  useEffect(() => {
    if (testsData && !isConfigsLoading && testFields.length === 0) {
      const configs: Record<number, HospitalLabTest> = {};
      const initialData = testsData.map((test, index) => {
        const config = configQueries[index]?.data as HospitalLabTest;
        if (config) {
          configs[test.id] = config;
        }
        return {
          test_id: test.id,
          request_type: test.investigation_request.request_type,
          test_date: new Date(),
          result:
            config?.parameters?.map((p: Parameter) => ({
              parameter_name: p.name,
              value: "",
              type: p.type,
            })) || [],
        };
      });
      setTestConfigs(configs);
      replace(initialData);
      if (testsData.length > 0) setActiveTab(testsData[0].id.toString());
    }
  }, [testsData, isConfigsLoading, replace, configQueries]);

  const saveMutation = useMutation({
    mutationFn: async ({ testId, payload }: { testId: number; payload: any }) => {
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

  const getParameterConfig = (testId: number, paramName: string): Parameter | undefined => {
    const config = testConfigs[testId];
    return config?.parameters.find((p) => p.name === paramName);
  };

  const renderParameterInput = (
    testId: number,
    paramName: string,
    index: number,
    pIndex: number,
  ) => {
    const paramConfig = getParameterConfig(testId, paramName);
    if (!paramConfig) return null;

    const fieldName = `tests.${index}.result.${pIndex}.value` as const;
    const currentValue = form.watch(fieldName);
    const status = getParameterStatus(currentValue, paramConfig);

    switch (paramConfig.type) {
      case "categorical":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center mb-1">
                  <FormLabel className="text-xs font-bold text-slate-600">
                    {paramName}
                  </FormLabel>
                  {field.value && status !== "unknown" && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        status === "normal"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {status === "normal" ? "Normal" : "Abnormal"}
                    </Badge>
                  )}
                </div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "h-11 rounded-xl w-full bg-transparent",
                        status === "normal" && field.value
                          ? "border-green-500"
                          : status === "abnormal" && field.value
                            ? "border-red-500"
                            : "",
                      )}
                    >
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(paramConfig.options || []).map((option) => {
                      const isNormal = (paramConfig.normal_values || []).includes(option);
                      return (
                        <SelectItem key={option} value={option}>
                          <div className="flex items-center gap-2">
                            {option}
                            {isNormal && (
                              <Badge variant="outline" className="text-xs bg-green-50">
                                Normal
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "text":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="md:col-span-2 lg:col-span-3">
                <div className="flex justify-between items-center mb-1">
                  <FormLabel className="text-xs font-bold text-slate-600">
                    {paramName}
                  </FormLabel>
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter observation"
                    className="rounded-xl resize-none min-h-9 p-2.5 h-11!"
                    rows={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "numeric":
      case "ratio":
      default:
        const rangeText =
          paramConfig.min !== undefined && paramConfig.max !== undefined
            ? `${paramConfig.min}-${paramConfig.max}${paramConfig.unit ? ` ${paramConfig.unit}` : ""}`
            : "";

        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center mb-1">
                  <FormLabel className="text-xs font-bold text-slate-600 truncate">
                    {paramName}
                  </FormLabel>
                  <div className="flex items-center gap-1">
                    {rangeText && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">
                        <Info className="h-3 w-3" /> {rangeText}
                      </span>
                    )}
                    {field.value && status !== "unknown" && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          status === "normal"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : status === "high"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : status === "low"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : ""
                        }`}
                      >
                        {status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={paramConfig.type === "numeric" ? "number" : "text"}
                      placeholder={
                        paramConfig.type === "ratio" ? "e.g., 1:140" : "Result"
                      }
                      step={
                        paramConfig.type === "numeric"
                          ? `0.${"0".repeat((paramConfig.display_decimals || 1) - 1)}1`
                          : undefined
                      }
                      className={cn(
                        "h-11 rounded-xl pr-12 no-spinner",
                        status === "normal" && field.value
                          ? "border-green-500 focus-visible:ring-green-500"
                          : status === "high" || status === "low"
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "",
                      )}
                    />
                    {paramConfig.unit && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {paramConfig.unit}
                      </span>
                    )}
                    {field.value && status !== "unknown" && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        {status === "normal" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                {/* {field.value && status !== "unknown" && status !== "normal" && (
                  <p className="text-xs text-red-600 mt-1">
                    Value is {status === "high" ? "above" : "below"} normal range
                  </p>
                )} */}
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between bg-background rounded-xl py-1 mb-4 px-6">
            <TabsList className="bg-white flex gap-4 py-3">
              {testFields.map((field) => {
                const config = testConfigs[field.test_id];
                const IconComponent = config?.icon
                  ? ICON_MAP[config.icon] || Beaker
                  : Beaker;
                const color = config?.color_theme
                  ? COLOR_MAP[config.color_theme]
                  : COLOR_MAP.blue;

                return (
                  <TabsTrigger
                    className="data-[state=active]:border-b-2 font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-5 flex gap-x-3 items-center"
                    key={field.id}
                    value={field.test_id.toString()}
                    style={{
                      color: activeTab === field.test_id.toString() ? color : undefined,
                    }}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="flex items-center gap-2">
                      {field.request_type}
                      {completedTests.has(field.test_id) && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <div className="text-sm text-muted-foreground">
              {completedTests.size} of {testFields.length} completed
            </div>
          </div>

          {testFields.map((field, index) => {
            const config = testConfigs[field.test_id];
            const IconComponent = config?.icon
              ? ICON_MAP[config.icon] || Beaker
              : Beaker;
            const color = config?.color_theme ? COLOR_MAP[config.color_theme] : COLOR_MAP.blue;

            return (
              <TabsContent
                key={field.id}
                value={field.test_id.toString()}
                className="space-y-6 bg-background p-6 rounded-xl focus-visible:outline-none"
              >
                <div className="space-y-8">
                  {/* Header */}
                  <div
                    className="flex items-start justify-between p-4 rounded-xl border"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <IconComponent className="h-5 w-5" style={{ color }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          {config?.test_category || "Test"} {index + 1}
                        </p>
                        <h2 className="text-lg font-bold">{field.request_type}</h2>
                      </div>
                    </div>
                    {completedTests.has(field.test_id) && (
                      <Badge className="bg-green-100 text-green-700">Saved</Badge>
                    )}
                  </div>

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
                      <h3 className="font-bold text-slate-700">Test Parameters</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {field.result.map((resultParam, pIndex) => (
                        <div key={`${field.id}-param-${pIndex}`}>
                          {renderParameterInput(
                            field.test_id,
                            resultParam.parameter_name,
                            index,
                            pIndex,
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleSaveSingle(index)}
                    disabled={
                      saveMutation.isPending || completedTests.has(field.test_id)
                    }
                    className="w-fit px-8 h-9 rounded-2xl border-primary text-primary bg-white hover:bg-gray-50"
                    variant={"outline"}
                  >
                    {saveMutation.isPending && <Loader2 className="animate-spin mr-2" />}
                    Save This Test
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="pb-4">
          <Button
            onClick={() => {
              if (completedTests.size === testFields.length) {
                router.push("/laboratory/patients");
              } else {
                toast.error("Please save each test individually before finalizing.");
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