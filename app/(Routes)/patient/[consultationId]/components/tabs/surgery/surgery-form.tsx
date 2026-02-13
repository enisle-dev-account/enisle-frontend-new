"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
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
  patientName?: string;
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
  patientName,
}: SurgeryFormProps) {
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    [],
  );
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [showAllFields, setShowAllFields] = useState(!!surgery);

  const { showSuccess } = useSuccessModal();
  const { confirm } = useConfirm();
  const isCompleted = surgery?.status === "completed";

  const { data: surgeryProcedures = [], isLoading: proceduresLoading } =
    useQuery({
      queryKey: ["surgery-procedures"],
      queryFn: async () => {
        const response = await request("/hospital/pricing?categories=surgery");
        return response
          .filter((item: any) => item.is_active !== false)
          .map((item: any) => ({
            label: item.item,
            value: String(item.id),
            price: item.price,
            currency: item.currency || "NGN",
          }));
      },
    });

  const form = useForm<SurgeryFormValues>({
    resolver: zodResolver(surgerySchema),
    defaultValues: {
      procedure: "",
      selected_procedure_pricing: undefined,
      cpt_code: "",
      anesthesia_type: "",
      operative_site: "",
      description: "",
      recovery_notes: "",
      reason: "",
      notes: "",
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
    },
  );

  const updateMutation = useApiMutation(
    "PATCH",
    `/surgery/surgery-result/${surgery?.id}/update/`,
    {
      onSuccess: () => {
        showSuccess("Surgery details updated successfully");
        onSuccess();
      },
    },
  );

  const completeMutation = useApiMutation(
    "PATCH",
    `/surgery/surgery-result/${surgery?.id}/complete/`,
    {
      onSuccess: (data) => {
        showSuccess(`Surgery completed successfully.`);
        onSuccess();
      },
    },
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
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
    const { [fieldName]: _, ...rest } = currentFields;
    form.setValue("additional_fields", rest);
  };

  const handleCompleteSurgery = async () => {
    const selectedPricingId = form.getValues("selected_procedure_pricing");
    if (!selectedPricingId) {
      showSuccess("Please select the specific procedure for billing.");
      return;
    }

    const isConfirmed = await confirm({
      title: "Complete Surgery?",
      message:
        "This will finalize documentation and create a billing transaction. You cannot edit this after completion.",
      confirmText: "Complete & Lock",
      variant: "destructive",
    });

    if (!isConfirmed) return;

    const data = form.getValues();
    const payload = {
      ...data,
      procedure_id: selectedPricingId,
      surgery_date: data.surgery_date
        ? data.surgery_date.toISOString()
        : undefined,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        completeMutation.mutate({ procedure_id: selectedPricingId });
      },
    });
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    completeMutation.isPending;
  const selectedProcId = form.watch("selected_procedure_pricing");
  const selectedProcedureData = surgeryProcedures.find(
    (p: any) => p.value === String(selectedProcId),
  );

  if (!isConsultationView && surgery?.status === "pending") {
    return (
      <Card className="border-b-2 border-b-[#04DA00]">
        <CardHeader>
          <h3 className="font-bold">Surgery Details</h3>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-9 text-center">
          <p className="text-muted-foreground mb-2">
            Awaiting Surgical Evaluation
          </p>
          <p className="text-sm text-muted-foreground">
            Doctor's Suggestion: <strong>{surgery.procedure}</strong>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-b-2 border-b-[#04DA00]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Surgery Details
            </h3>
            <div className="flex items-center gap-3">
              {showAllFields && !isCompleted && isConsultationView && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full border-primary text-primary"
                    onClick={() => setShowAddFieldDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Field
                  </Button>
                  <Button
                    type="button"
                    onClick={form.handleSubmit((d) =>
                      surgery
                        ? updateMutation.mutate({
                            ...d,
                            surgery_date: d.surgery_date?.toISOString(),
                          })
                        : createMutation.mutate({
                            ...d,
                            surgery_date: d.surgery_date?.toISOString(),
                          }),
                    )}
                    disabled={isSubmitting}
                    variant="outline"
                    className="rounded-full"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCompleteSurgery}
                    disabled={isSubmitting}
                    className="rounded-full bg-primary hover:bg-primary/90"
                  >
                    {completeMutation.isPending
                      ? "Completing..."
                      : "Complete Surgery"}
                  </Button>
                </>
              )}
              {!showAllFields && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAllFields(true)}
                  className="rounded-full"
                >
                  Proceed
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <Form {...form}>
            <form className="space-y-4">
              {patientName && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Patient
                  </p>
                  <p className="font-bold">{patientName}</p>
                </div>
              )}

              {surgery && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-bold text-muted-foreground uppercase">
                    Doctor's Original Suggestion:
                  </p>
                  <p className="font-medium text-lg">{surgery.procedure}</p>
                  {surgery.reason && (
                    <p className="text-sm mt-2 opacity-80">{surgery.reason}</p>
                  )}
                </div>
              )}

              {showAllFields && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="selected_procedure_pricing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Actual Procedure Performed{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value ? String(field.value) : ""}
                          disabled={isCompleted}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select procedure for billing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {surgeryProcedures.map((proc: any) => (
                              <SelectItem key={proc.value} value={proc.value}>
                                <div className="flex justify-between w-full gap-4">
                                  <span>{proc.label}</span>
                                  <span className="text-xs opacity-60">
                                    {proc.currency}{" "}
                                    {proc.price.toLocaleString()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedProcedureData && (
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex justify-between items-center">
                      <div className="text-xs font-bold text-primary uppercase">
                        Transaction Amount
                      </div>
                      <div className="text-2xl font-black text-primary">
                        {selectedProcedureData.currency}{" "}
                        {selectedProcedureData.price.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="surgery_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Surgery Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  disabled={isCompleted}
                                  className={cn(
                                    "w-full pl-3 text-left bg-white",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP p")
                                  ) : (
                                    <span>Pick date/time</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || isCompleted
                                }
                              />
                              <div className="p-3 border-t">
                                <Input
                                  type="time"
                                  value={
                                    field.value
                                      ? format(field.value, "HH:mm")
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const [h, m] = e.target.value.split(":");
                                    const d = field.value
                                      ? new Date(field.value)
                                      : new Date();
                                    d.setHours(parseInt(h), parseInt(m));
                                    field.onChange(d);
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpt_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPT/ICD-10 codes</FormLabel>
                          <Input {...field} disabled={isCompleted} />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="operative_site"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operative site</FormLabel>
                          <Input {...field} disabled={isCompleted} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="anesthesia_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anesthesia type</FormLabel>
                          <Input {...field} disabled={isCompleted} />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Procedure Description{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Textarea
                          className="min-h-25"
                          {...field}
                          disabled={isCompleted}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recovery_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recovery Notes</FormLabel>
                        <Textarea {...field} disabled={isCompleted} />
                      </FormItem>
                    )}
                  />

                  {additionalFields.map((f) => (
                    <FormField
                      key={f.name}
                      control={form.control}
                      name={`additional_fields.${f.name}` as any}
                      render={({ field: ff }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>
                              {f.label}
                              {f.required && "*"}
                            </FormLabel>
                            {!isCompleted && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveField(f.name)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <Textarea {...ff} disabled={isCompleted} />
                        </FormItem>
                      )}
                    />
                  ))}

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-800">
                    <strong>Note:</strong> Completion creates an automatic
                    transaction in the billing system.
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

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
                className={`relative h-6 w-11 rounded-full ${newFieldRequired ? "bg-primary" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${newFieldRequired ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddFieldDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
