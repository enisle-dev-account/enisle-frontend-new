"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { request, useApiMutation } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";

import {
  prescribeMedicationSchema,
  surgicalRequestSchema,
  investigationRequestSchema,
  assignPatientSchema,
  PrescribeMedicationFormValues,
  SurgicalRequestFormValues,
  InvestigationRequestFormValues,
  AssignPatientFormValues,
} from "../../[consultationId]/components/tabs/encounter-notes/schemas/encounters.schema";
import { InvestigationRequestForm } from "./forms/investigation-request";
import { PrescribeMedicationForm } from "./forms/prescibe-medication";
import { SurgicalConsultationForm } from "./forms/surgical-request";
import { AssignPatientForm } from "./forms/assign-patient";



type ModalFlow = "request_investigation" | "prescribe_medication" | "request_surgical";
type ModalStep = "form" | "assign";

interface UnifiedAssignModalProps {
  flow: ModalFlow | null;
  consultationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UnifiedAssignModal({
  flow,
  consultationId,
  isOpen,
  onClose,
  onSuccess,
}: UnifiedAssignModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>("form");
  const [formData, setFormData] = useState<any>(null);
  const { showSuccess } = useSuccessModal();

  // Fetch data for dropdowns
  const { data: medicines = [] } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const response = await request("/doctor/medicines/list/");
      return response.map((med: any) => ({
        label: med.title,
        value: med.id,
      }));
    },
    enabled: flow === "prescribe_medication",
  });

  const { data: labTests = [] } = useQuery({
    queryKey: ["lab-tests"],
    queryFn: async () => {
      const response = await request("/hospital/lab-tests/");
      return response.map((test: any) => ({
        label: test.test_name,
        value: String(test.id),
      }));
    },
    enabled: flow === "request_investigation",
  });

  // Forms
  const medicationForm = useForm<PrescribeMedicationFormValues>({
    resolver: zodResolver(prescribeMedicationSchema),
    defaultValues: {
      medications: [
        {
          medicine: "",
          quantity: "",
          medicine_type: "",
          dosage: "",
          start_date: new Date(),
          end_date: new Date(),
          frequency: "",
          custom_frequency: "",
          notes: "",
        },
      ],
    },
  });

  const surgicalForm = useForm<SurgicalRequestFormValues>({
    resolver: zodResolver(surgicalRequestSchema),
    defaultValues: {
      procedure: "",
      reason: "",
      notes: "",
    },
  });

  const investigationForm = useForm<InvestigationRequestFormValues>({
    resolver: zodResolver(investigationRequestSchema),
    defaultValues: {
      investigation_type: "",
    },
  });

  const assignForm = useForm<AssignPatientFormValues>({
    resolver: zodResolver(assignPatientSchema),
    defaultValues: {
      department: "",
      doctor: "",
    },
  });

  // Assign mutation
  const assignMutation = useApiMutation(
    "POST",
    `/doctor/consultations/${consultationId}/assign/`,
    {
      onSuccess: () => {
        showSuccess("Patient assigned successfully");
        handleClose();
        onSuccess();
      },
    },
  );

  const handleClose = () => {
    resetAllForms();
    onClose();
  };

  const resetAllForms = () => {
    medicationForm.reset();
    surgicalForm.reset();
    investigationForm.reset();
    assignForm.reset();
    setCurrentStep("form");
    setFormData(null);
  };

  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    setCurrentStep("assign");
  };

  const handleAssignSubmit = async (assignData: AssignPatientFormValues) => {
    if (!flow) return;

    let payload: any = {
      flow_type: flow,
      department: assignData.department,
      doctor: assignData.doctor,
    };

    if (flow === "request_investigation") {
      payload.investigation_type = formData.investigation_type;
    } else if (flow === "prescribe_medication") {
      payload.medications = formData.medications.map((med: any) => ({
        medicine: med.medicine,
        dosage: med.dosage,
        medicine_type: med.medicine_type || "",
        start_date: med.start_date.toISOString(),
        end_date: med.end_date.toISOString(),
        frequency:
          med.frequency === "custom" ? med.custom_frequency : med.frequency,
        quantity: med.quantity,
        notes: med.notes || "",
      }));
    } else if (flow === "request_surgical") {
      payload.surgical_request = formData;
    }

    assignMutation.mutate(payload);
  };

  const getModalTitle = () => {
    if (currentStep === "assign") return "Assign Patient";
    switch (flow) {
      case "request_investigation":
        return "Request Investigation";
      case "prescribe_medication":
        return "Prescribe Medication";
      case "request_surgical":
        return "Request Surgical Consultation";
      default:
        return "";
    }
  };

  const getAllowedDepartments = () => {
    switch (flow) {
      case "prescribe_medication":
        return ["pharmacy"];
      case "request_investigation":
        return ["laboratory", "radiology"];
      case "request_surgical":
        return ["surgery"];
      default:
        return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl min-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {currentStep === "form" ? (
            <>
              {flow === "request_investigation" && (
                <Form {...investigationForm}>
                  <form
                    onSubmit={investigationForm.handleSubmit(handleFormSubmit)}
                    className="space-y-4"
                  >
                    <InvestigationRequestForm
                      form={investigationForm}
                      labTests={labTests}
                    />
                    <DialogFooter className="px-6 pb-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="w-42.5 rounded-full bg-primary hover:bg-primary/90"
                      >
                        Proceed
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              )}

              {flow === "prescribe_medication" && (
                <Form {...medicationForm}>
                  <form
                    onSubmit={medicationForm.handleSubmit(handleFormSubmit)}
                    className="space-y-4"
                  >
                    <PrescribeMedicationForm
                      form={medicationForm}
                      medicines={medicines}
                    />
                    <DialogFooter className="px-6 pb-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="w-42.5 rounded-full bg-primary hover:bg-primary/90"
                      >
                        Proceed
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              )}

              {flow === "request_surgical" && (
                <Form {...surgicalForm}>
                  <form
                    onSubmit={surgicalForm.handleSubmit(handleFormSubmit)}
                    className="space-y-4"
                  >
                    <SurgicalConsultationForm form={surgicalForm} />
                    <DialogFooter className="px-6 pb-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="w-42.5 rounded-full bg-primary hover:bg-primary/90"
                      >
                        Proceed
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              )}
            </>
          ) : (
            <Form {...assignForm}>
              <form
                onSubmit={assignForm.handleSubmit(handleAssignSubmit)}
                className="space-y-4"
              >
                <AssignPatientForm
                  allowedDepartments={getAllowedDepartments()}
                  form={assignForm}
                />
                <DialogFooter className="px-6 pb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep("form")}
                    className="w-42.5 rounded-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={assignMutation.isPending}
                    className="w-42.5 rounded-full bg-primary hover:bg-primary/90"
                  >
                    {assignMutation.isPending ? "Assigning..." : "Assign"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}