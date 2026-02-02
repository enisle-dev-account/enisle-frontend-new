"use client";

import { UseFormReturn } from "react-hook-form";
import {
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
import { Textarea } from "@/components/ui/textarea";
import { SurgicalRequestFormValues } from "../../encounter-notes/schemas/encounters.schema";

interface SurgicalRequestFormProps {
  form: UseFormReturn<SurgicalRequestFormValues>;
  surgeries: { label: string; value: string }[];
}

export function SurgicalRequestForm({
  form,
  surgeries,
}: SurgicalRequestFormProps) {
  return (
    <div className="p-4 space-y-6">
      <FormField
        control={form.control}
        name="procedure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Requested Procedure <span className="text-destructive">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white border-[#E8ECF0]">
                  <SelectValue placeholder="Select procedure" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {surgeries.map((surgery) => (
                  <SelectItem key={surgery.value} value={surgery.value}>
                    {surgery.label}
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
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Reason for Referral <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter reason for referral"
                className="bg-white border-[#E8ECF0]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any additional notes..."
                className="bg-white border-[#E8ECF0] resize-none"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
