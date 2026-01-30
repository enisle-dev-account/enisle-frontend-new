"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  PrescribeMedicationFormValues,
  frequencyOptions,
  medicineTypeOptions,
} from "../schemas/encounters.schema";

interface PrescribeMedicationFormProps {
  form: UseFormReturn<PrescribeMedicationFormValues>;
  medicines: { label: string; value: string }[];
}

export function PrescribeMedicationForm({
  form,
  medicines,
}: PrescribeMedicationFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  const addMedication = () => {
    append({
      medicine: "",
      quantity: "",
      medicine_type: "",
      dosage: "",
      start_date: new Date(),
      end_date: new Date(),
      frequency: "",
      custom_frequency: "",
      notes: "",
    });
  };

  return (
    <div className="space-y-6 p-4 max-h-[calc(100vh-250px)] overflow-y-auto">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative border border-[#E8ECF0] rounded-lg p-4 space-y-4 bg-white"
        >
          {/* Remove Button */}
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {/* Medication Number Header */}
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {index + 1}
              </span>
            </div>
            <h4 className="font-semibold text-sm">Medication {index + 1}</h4>
          </div>

          {/* Medicine Name & Quantity Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`medications.${index}.medicine`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Medicine Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-[#E8ECF0]">
                        <SelectValue placeholder="Select medicine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {medicines.map((medicine) => (
                        <SelectItem key={medicine.value} value={medicine.value}>
                          {medicine.label}
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
              name={`medications.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantity <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter quantity"
                      className="bg-white border-[#E8ECF0]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Medicine Type & Dosage Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`medications.${index}.medicine_type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-[#E8ECF0]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {medicineTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name={`medications.${index}.dosage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dosage <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 500mg, 5ml, 1 tablet"
                      className="bg-white border-[#E8ECF0]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date Range & Frequency Row */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`medications.${index}.start_date`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    From <span className="text-destructive">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "bg-white border-[#E8ECF0] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
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
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`medications.${index}.end_date`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    To <span className="text-destructive">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "bg-white border-[#E8ECF0] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
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
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`medications.${index}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Frequency <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-[#E8ECF0]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencyOptions.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Custom Frequency (conditional) */}
          {form.watch(`medications.${index}.frequency`) === "custom" && (
            <FormField
              control={form.control}
              name={`medications.${index}.custom_frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Custom Frequency <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Every other day, Once a week"
                      className="bg-white border-[#E8ECF0]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Notes */}
          <FormField
            control={form.control}
            name={`medications.${index}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes or instructions..."
                    className="bg-white border-[#E8ECF0] resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      {/* Add Another Medication Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-primary text-primary hover:bg-primary/10"
        onClick={addMedication}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Medication
      </Button>
    </div>
  );
}