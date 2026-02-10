"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { request, useApiMutation } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { useConfirm } from "@/providers/confirm-box-provider";
import { Surgery } from "@/types";
import {
  SurgeryFormValues,
  surgerySchema,
} from "@/app/(Routes)/surgery/schemas/surgery.schema";

interface SurgeryFormProps {
  consultationId: string;
  surgery?: Surgery;
  onSuccess: () => void;
  onCancel: () => void;
  isConsultationView?: boolean;
}

interface AdditionalField {
  name: string;
  label: string;
  required: boolean;
}

export function SurgeryForm({
  consultationId,
  surgery,
  onSuccess,
  onCancel,
  isConsultationView = true,
}: SurgeryFormProps) {
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>([]);
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [showAllFields, setShowAllFields] = useState(!!surgery);

  const { showSuccess } = useSuccessModal();
  const { confirm } = useConfirm();
  const isCompleted = surgery?.status === "completed";

  // Fetch surgery procedures from pricing
  const { data: surgeryProcedures = [] } = useQuery({
    queryKey: ["surgery-procedures"],
    queryFn: async () => {
      const response = await request("/hospital/pricing?categories=surgery");
      return response.map((item: any) => ({
        label: `${item.item} - ${item.currency || ""}${item.price}`,
        value: String(item.id),
        name: item.item,
        price: item.price,
      }));
    },
  });

  const form = useForm<SurgeryFormValues>({
    resolver: zodResolver(surgerySchema),
    defaultValues: {
      procedure: "",
     cpt_code: "",
      anesthesia_type: "",
      operative_site: "",
      description: "",
      recovery_notes: "",
      reason: "",
      notes: "",
      concentration: "",
      route: "",
      site: "",
      quantity: "",
      additional_fields: {},
    },
  });

  const createMutation = useApiMutation(
    "POST",
    `/doctor/consultation/${consultationId}/surgery/create/`,
    {
      onSuccess: () => {
        showSuccess("Surgery details created successfully");
        onSuccess();
      },
    }
  );

  const updateMutation = useApiMutation(
    "PATCH",
    `/surgery/surgery-result/${surgery?.id}/update/`,
    {
      onSuccess: () => {
        showSuccess("Surgery details updated successfully");
        onSuccess();
      },
    }
  );

  const completeMutation = useApiMutation(
    "PATCH",
    `/surgery/surgery-result/${surgery?.id}/complete/`,
    {
      onSuccess: () => {
        showSuccess("Surgery completed and billing updated!");
        onSuccess();
      },
    }
  );

  useEffect(() => {
    if (surgery) {
      form.reset({
        procedure: surgery.procedure || "",
        selected_procedure_pricing: surgery.selected_procedure_pricing,
        cpt_code: surgery.cpt_code || "",
        anesthesia_type: surgery.anesthesia_type || "",
        operative_site: surgery.operative_site || "",
        description: surgery.description || "",
        recovery_notes: surgery.recovery_notes || "",
        reason: surgery.reason || "",
        notes: surgery.notes || "",
        concentration: surgery.concentration || "",
        route: surgery.route || "",
        site: surgery.site || "",
        quantity: surgery.quantity || "",
        surgery_date: surgery.surgery_date
          ? new Date(surgery.surgery_date)
          : undefined,
        additional_fields: surgery.additional_fields || {},
      });

      if (surgery.additional_fields) {
        const fields = Object.keys(surgery.additional_fields).map((key) => ({
          name: key,
          label: key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          required: false,
        }));
        setAdditionalFields(fields);
      }
    }
  }, [surgery, form]);

  const handleAddField = () => {
    if (!newFieldName.trim()) return;

    const fieldName = newFieldName.trim().toLowerCase().replace(/\s+/g, "_");
    const fieldLabel = newFieldName
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setAdditionalFields([
      ...additionalFields,
      { name: fieldName, label: fieldLabel, required: newFieldRequired },
    ]);

    setNewFieldName("");
    setNewFieldRequired(false);
    setShowAddFieldDialog(false);
  };

  const handleRemoveField = (fieldName: string) => {
    setAdditionalFields(additionalFields.filter((f) => f.name !== fieldName));
    const currentFields = form.getValues("additional_fields") || {};
    const { [fieldName]: removed, ...rest } = currentFields;
    form.setValue("additional_fields", rest);
  };

  const onSubmit = (data: SurgeryFormValues) => {
    const payload = {
      ...data,
      surgery_date: data.surgery_date ? data.surgery_date.toISOString() : undefined,
    };

    if (surgery) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleCompleteSurgery = async () => {
    if (surgery) {
      const selectedPricing = form.getValues("selected_procedure_pricing");
      
      if (!selectedPricing) {
        showSuccess("Please select an actual procedure before completing surgery");
        return;
      }

      const isConfirmed = await confirm({
        title: "Complete Surgery?",
        message:
          "Are you sure you want to mark this surgery as complete? This will create the final billing transaction. You will not be able to edit these details once completed.",
        confirmText: "Complete & Lock",
        cancelText: "Go Back",
        variant: "destructive",
      });

      if (!isConfirmed) return;

      const data = form.getValues();
      const payload = {
        ...data,
        surgery_date: data.surgery_date ? data.surgery_date.toISOString() : undefined,
      };

      updateMutation.mutate(payload, {
        onSuccess: () => {
          completeMutation.mutate({});
        },
      });
    }
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    completeMutation.isPending;

  const procedureValue = form.watch("procedure");
  const shouldShowProceed =
    procedureValue && procedureValue.trim().length > 0 && !showAllFields;

  // Show different content for read-only vs editable
  if (!isConsultationView && surgery?.status === "pending") {
    return (
      <Card className="border-b-2 border-b-[#04DA00]">
        <CardHeader>
          <h3 className="font-bold">Surgery Details</h3>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-9">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Awaiting Surgical Evaluation
            </p>
            <p className="text-sm text-muted-foreground">
              Doctor's Suggestion: <strong>{surgery.procedure}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-b-2 border-b-[#04DA00]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Surgery Details</h3>
            <div className="flex items-center gap-3">
              {showAllFields && !isCompleted && isConsultationView && (
                <Button
                  type="button"
                  size="sm"
                  className="bg-background hover:bg-background text-primary border border-primary rounded-full hover:text-black"
                  onClick={() => setShowAddFieldDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              )}

              {shouldShowProceed && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAllFields(true)}
                  className="rounded-full"
                >
                  Proceed
                </Button>
              )}

              {showAllFields && !isCompleted && isConsultationView && (
                <>
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary/5"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleCompleteSurgery}
                    disabled={isSubmitting}
                    className="rounded-full bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Processing..." : "Complete Surgery"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Doctor's Original Suggestion (Read-only) */}
              {surgery && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Doctor's Suggested Procedure:
                  </p>
                  <p className="font-medium text-lg">{surgery.procedure}</p>
                  {surgery.reason && (
                    <>
                      <p className="text-sm font-semibold text-muted-foreground mt-3">
                        Reason for Referral:
                      </p>
                      <p className="text-sm">{surgery.reason}</p>
                    </>
                  )}
                </div>
              )}

              {/* Surgeon Selects Actual Procedure */}
              {showAllFields && (
                <>
                  <FormField
                    control={form.control}
                    name="selected_procedure_pricing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Actual Procedure (Select from approved list){" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(val)=>field.onChange(Number(val))}
                          value={String(field.value)}
                          disabled={isCompleted}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select actual procedure to be performed" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {surgeryProcedures.map((proc: any) => (
                              <SelectItem key={proc.value} value={proc.value}>
                                {proc.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          This will be used for final billing
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Surgery Date/Time */}
                  <FormField
                    control={form.control}
                    name="surgery_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Scheduled Surgery Date & Time{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                disabled={isCompleted}
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
                              disabled={(date) => date < new Date() || isCompleted}
                              initialFocus
                            />
                            <div className="p-3 border-t">
                              <Input
                                type="time"
                                disabled={isCompleted}
                                value={field.value ? format(field.value, "HH:mm") : ""}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(":");
                                  const newDate = field.value
                                    ? new Date(field.value)
                                    : new Date();
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

                  {/* Rest of the fields... (keeping your existing implementation) */}
                  {/* Basic Surgery Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cpt_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPT/ICD-10 codes</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter codes"
                              {...field}
                              disabled={isCompleted}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operative_site"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operative site</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter operative site"
                              {...field}
                              disabled={isCompleted}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="anesthesia_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anesthesia type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter anesthesia type"
                              {...field}
                              disabled={isCompleted}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Procedure Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Procedure description{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter detailed procedure description"
                            className="min-h-20 resize-none"
                            {...field}
                            disabled={isCompleted}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Post-Operative Section */}
                  <div>
                    <h4 className="font-semibold text-sm mb-4">
                      Post-Operative Section
                    </h4>
                    <FormField
                      control={form.control}
                      name="recovery_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recovery notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter recovery notes"
                              className="min-h-20 resize-none"
                              {...field}
                              disabled={isCompleted}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Additional Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter additional notes"
                            className="min-h-20 resize-none"
                            {...field}
                            disabled={isCompleted}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Fields */}
                  {additionalFields.map((field) => (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={`additional_fields.${field.name}` as any}
                      render={({ field: formField }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>
                              {field.label}
                              {field.required && (
                                <span className="text-destructive">*</span>
                              )}
                            </FormLabel>
                            {!isCompleted && isConsultationView && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveField(field.name)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className="min-h-20 resize-none"
                              {...formField}
                              disabled={isCompleted}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  {isConsultationView && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Add Field Dialog */}
      <Dialog open={showAddFieldDialog} onOpenChange={setShowAddFieldDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Field Title</label>
              <Input
                placeholder="Enter field title"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Is Required</span>
              <button
                type="button"
                onClick={() => setNewFieldRequired(!newFieldRequired)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  newFieldRequired ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    newFieldRequired ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddFieldDialog(false);
                setNewFieldName("");
                setNewFieldRequired(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddField}
              disabled={!newFieldName.trim()}
              className="rounded-full"
            >
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}