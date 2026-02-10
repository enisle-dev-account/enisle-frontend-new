"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TEST_TYPES } from "../constants";
import { useApiMutation } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { Trash2 } from "lucide-react";

const testResultSchema = z.object({
  test: z.string().min(1, "Please select a test type"),
  test_date: z.string().min(1, "Test date is required"),
  result: z.array(
    z.object({
      parameter_name: z.string(),
      value: z.string().min(1, "Value is required"),
    })
  ),
});

type TestFormData = z.infer<typeof testResultSchema>;

interface AddTestFormProps {
  requestId: number;
  onSuccess?: () => void;
}

export function AddTestForm({ requestId, onSuccess }: AddTestFormProps) {
  const { showSuccess } = useSuccessModal();

  const form = useForm<TestFormData>({
    resolver: zodResolver(testResultSchema),
    defaultValues: {
      test: "",
      test_date: new Date().toISOString().split("T")[0],
      result: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "result",
  });

  const mutation = useApiMutation("POST", `/laboratory/result/create/`, {
    onSuccess: () => {
      showSuccess("Test result added successfully");
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      showSuccess("Failed to add test result");
    },
  });

  const selectedTestId = form.watch("test");
  const selectedTest = TEST_TYPES.find((t) => t.id.toString() === selectedTestId);

  const onSubmit = (data: TestFormData) => {
    mutation.mutate({
      test: parseInt(data.test),
      test_date: data.test_date,
      result: data.result,
    });
  };

  const handleTestChange = (testId: string) => {
    form.setValue("test", testId);
    const test = TEST_TYPES.find((t) => t.id.toString() === testId);
    if (test) {
      form.setValue(
        "result",
        test.parameters.map((p) => ({
          parameter_name: p.name,
          value: "",
        }))
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Name and Test Selection Row */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <Select value={field.value} onValueChange={handleTestChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TEST_TYPES.map((test) => (
                      <SelectItem key={test.id} value={test.id.toString()}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Test</FormLabel>
                <Select value={field.value} onValueChange={handleTestChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Test" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TEST_TYPES.map((test) => (
                      <SelectItem key={test.id} value={test.id.toString()}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="test_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Add Test Result Section */}
        {selectedTest && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Add Test Result</h3>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Select a test type to add parameters
              </p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    <FormField
                      control={form.control}
                      name={`result.${index}.parameter_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            {form.getValues(`result.${index}.parameter_name`)}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled className="bg-muted" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`result.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Result (%)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter test result"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={mutation.isPending || !selectedTest}
          className="w-full rounded-full bg-primary hover:bg-primary/90"
        >
          {mutation.isPending ? "Saving..." : "Finish"}
        </Button>
      </form>
    </Form>
  );
}