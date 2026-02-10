"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SurgicalRequestFormValues } from "../tabs/encounter-notes/schemas/encounters.schema";


interface SurgicalConsultationFormProps {
  form: UseFormReturn<SurgicalRequestFormValues>;
}

export function SurgicalConsultationForm({
  form,
}: SurgicalConsultationFormProps) {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This is a surgical consultation request. Enter your
          suspected procedure or condition. The assigned surgeon will select the
          actual procedure after evaluation.
        </p>
      </div>

      <FormField
        control={form.control}
        name="procedure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Suspected Procedure/Condition{" "}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Possible appendectomy, Hernia repair evaluation"
                className="bg-white border-[#E8ECF0]"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Enter your clinical suspicion or suggested procedure
            </p>
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
                placeholder="Enter reason for surgical consultation"
                className="bg-white border-[#E8ECF0]"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Brief clinical indication for surgical review
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any additional clinical information, relevant history, or special considerations..."
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