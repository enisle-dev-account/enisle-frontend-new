"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Edit2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useApiMutation } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";
import {
  encounterNoteSchema,
  type EncounterNoteFormValues,
} from "./schemas/encounters.schema";
import type { Encounter } from "@/types";

interface EncounterFormProps {
  consultationId: string;
  encounter?: Encounter;
  onSuccess: () => void;
  onCancel: () => void;
}

interface AdditionalField {
  name: string;
  label: string;
  required: boolean;
}

const medicationTypes = ["Quick Medication"];

export function EncounterForm({
  consultationId,
  encounter,
  onSuccess,
  onCancel,
}: EncounterFormProps) {
  const [isAIMode, setIsAIMode] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    [],
  );
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [showAllFields, setShowAllFields] = useState(!!encounter);

  const { showSuccess } = useSuccessModal();

  const form = useForm<EncounterNoteFormValues>({
    resolver: zodResolver(encounterNoteSchema),
    defaultValues: {
      main_complaints: "",
      present_illness_history: "",
      past_medical_history: "",
      previous_operations: "",
      received_medication: "",
      impressions: "",
      recommendation: "",
      additional_notes: {},
    },
  });

  const createMutation = useApiMutation(
    "POST",
    `/doctor/consultation/${consultationId}/encounter/create/`,
    {
      onSuccess: () => {
        showSuccess("Encounter created successfully");
        onSuccess();
      },
    },
  );

  const updateMutation = useApiMutation(
    "PATCH",
    `/doctor/encounter/${encounter?.id}/update/`,
    {
      onSuccess: () => {
        showSuccess("Encounter updated successfully");
        onSuccess();
      },
    },
  );

  useEffect(() => {
    if (encounter) {
      form.reset({
        main_complaints: encounter.main_complaints || "",
        present_illness_history: encounter.present_illness_history || "",
        past_medical_history: encounter.past_medical_history || "",
        previous_operations: encounter.previous_operations || "",
        received_medication: encounter.received_medication || "",
        impressions: encounter.impressions || "",
        recommendation: encounter.recommendation || "",
        additional_notes: encounter.additional_notes || {},
      });

      if (encounter.additional_notes) {
        const fields = Object.keys(encounter.additional_notes).map((key) => ({
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
  }, [encounter, form]);

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
    const currentNotes = form.getValues("additional_notes") || {};
    const { [fieldName]: removed, ...rest } = currentNotes;
    form.setValue("additional_notes", rest);
  };

  const onSubmit = (data: EncounterNoteFormValues) => {
    const payload = {
      ...data,
      start_timestamp: new Date().toISOString(),
      end_timestamp: new Date().toISOString(),
    };

    if (encounter) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const mainComplaintsValue = form.watch("main_complaints");
  const shouldShowProceed =
    mainComplaintsValue &&
    mainComplaintsValue.trim().length > 0 &&
    !showAllFields;

  return (
    <>
      <Card className="border-b-2 border-b-[#E58116]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold ">Encounter Notes</h3>
            <div className="flex items-center gap-3">
              {/* Custom AI/Manual Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">AI Mode</span>
                <button
                  type="button"
                  onClick={() => setIsAIMode(!isAIMode)}
                  disabled
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    isAIMode ? "bg-primary" : "bg-gray-200"
                  } opacity-50 cursor-not-allowed`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAIMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                {isAIMode && (
                  <span className="text-xs text-muted-foreground">
                    (Coming soon)
                  </span>
                )}
              </div>

              <Select defaultValue={medicationTypes[0]}>
                <SelectTrigger className="w-45">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {medicationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {showAllFields && !isAIMode && (
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

              {showAllFields && (
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Saving..." : "Compile & Save"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Main Complaints - Always visible */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">Main Complaints</h4>
                  {showAllFields && mainComplaintsValue && (
                    <button
                      type="button"
                      onClick={() => setShowAllFields(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {!showAllFields ? (
                  <FormField
                    control={form.control}
                    name="main_complaints"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Enter patient's main complaints. E.g, Fever, headache, stress, etc. You can separate symptoms with commas."
                            className="min-h-32 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 py-2">
                    {mainComplaintsValue.split(",").map((complaint, index) => (
                      <span key={index} className="text-sm">
                        {complaint.trim()}
                        {index < mainComplaintsValue.split(",").length - 1 && (
                          <span className="mx-2 text-muted-foreground">|</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {!showAllFields && (
                  <div className="flex gap-2 mt-4">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (mainComplaintsValue && mainComplaintsValue.trim()) {
                          setShowAllFields(true);
                        }
                      }}
                      disabled={
                        !mainComplaintsValue || !mainComplaintsValue.trim()
                      }
                      className="rounded-full bg-primary hover:bg-primary/90"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {/* Rest of the fields - Show only after proceeding */}
              {showAllFields && (
                <>
                  {/* History of Present Illness */}
                  <FormField
                    control={form.control}
                    name="present_illness_history"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          History of Present Illness{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the history of present illness"
                            className="min-h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Past Medical History */}
                  <FormField
                    control={form.control}
                    name="past_medical_history"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Past Medical History</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter past medical history"
                            className="min-h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Previous Operations */}
                  <FormField
                    control={form.control}
                    name="previous_operations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Operations</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter previous operations"
                            className="min-h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Received Medications */}
                  <FormField
                    control={form.control}
                    name="received_medication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Received Medications</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter received medications"
                            className="min-h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Impressions */}
                  <FormField
                    control={form.control}
                    name="impressions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impressions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter impressions"
                            className="min-h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Recommendations */}
                  <FormField
                    control={form.control}
                    name="recommendation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommendations</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter recommendation"
                            className="min-h-20 resize-none"
                            {...field}
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
                      name={`additional_notes.${field.name}` as any}
                      render={({ field: formField }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>
                              {field.label}
                              {field.required && (
                                <span className="text-destructive">*</span>
                              )}
                            </FormLabel>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveField(field.name)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className="min-h-20 resize-none"
                              {...formField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

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
