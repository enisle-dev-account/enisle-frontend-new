"use client";

import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
              Procedure Name <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter procedure name.."
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
        name="surgery_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              Scheduled Surgery Date <span className="text-destructive">*</span>
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-white border-[#E8ECF0]",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP 'at' p")
                    ) : (
                      <span>Pick a date and time</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Input
                    type="time"
                    value={field.value ? format(field.value, "HH:mm") : ""}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const newDate = field.value ? new Date(field.value) : new Date();
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      field.onChange(newDate);
                    }}
                    className="bg-white"
                  />
                </div>
              </PopoverContent>
            </Popover>
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