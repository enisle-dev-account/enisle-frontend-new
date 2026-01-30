"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { useConfirm } from "@/providers/confirm-box-provider";
import { request } from "@/hooks/api";

import type { Encounter } from "@/types";
import {
  prescribeMedicationSchema,
  surgicalRequestSchema,
  investigationRequestSchema,
  assignPatientSchema,
  PrescribeMedicationFormValues,
  SurgicalRequestFormValues,
  InvestigationRequestFormValues,
  AssignPatientFormValues,
} from "../schemas/encounters.schema";
import { InvestigationRequestForm } from "./investigation-request";
import { SurgicalRequestForm } from "./surgical-request";
import { AssignPatientForm } from "./assign-patient";
import { PrescribeMedicationForm } from "./prescibe-medication";


interface EncounterDetailProps {
  encounter: Encounter;
  consultationId: string;
  currentUserId?: string;
  onBack: () => void;
  onEdit: () => void;
  onRefetch: () => void;
}

enum ModalFlow {
  REQUEST_INVESTIGATION = "request_investigation",
  PRESCRIBE_MEDICATION = "prescribe_medication",
  SURGICAL_CONSULTATION = "request_surgical",
}

enum ModalStep {
  FORM = "form",
  ASSIGN = "assign",
}

export function EncounterDetail({
  encounter,
  consultationId,
  currentUserId,
  onBack,
  onEdit,
  onRefetch,
}: EncounterDetailProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<ModalFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<ModalStep>(ModalStep.FORM);
  const [formData, setFormData] = useState<any>(null);

  const { showSuccess } = useSuccessModal();
  const { confirm } = useConfirm();

  // Fetch medicines
  const { data: medicines = [] } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const response = await request("/doctor/medicines/list/", {
        method: "GET",
      });
      return response.map((med: any) => ({
        label: med.title,
        value: med.id,
      }));
    },
  });

  // Fetch lab tests
  const { data: labTests = [] } = useQuery({
    queryKey: ["lab-tests"],
    queryFn: async () => {
      const response = await request("/hospital/lab-test-configurations/list/", {
        method: "GET",
      });
      return response.map((test: any) => ({
        label: test.test_name,
        value: String(test.id),
      }));
    },
  });

  // Fetch surgeries
  const { data: surgeries = [] } = useQuery({
    queryKey: ["surgeries", "surgery"],
    queryFn: async () => {
      const response = await request("/hospital/item-pricings/list/?item_type=surgery", {
        method: "GET",
      });
      return response.map((surgery: any) => ({
        label: surgery.item,
        value: surgery.item,
      }));
    },
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

  // Assign patient mutation
  const assignMutation = useMutation({
    mutationFn: async (data: any) => {
      return request(`/doctor/consultations/${consultationId}/assign/`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      showSuccess("Patient assigned successfully");
      setModalOpen(false);
      resetAllForms();
      onRefetch();
    },
    onError: (error: any) => {

        console.log(error);
        
    //   toast.error(error?.message || "Failed to assign patient");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return request(`/doctor/encounter/${encounter.id}/delete/`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      showSuccess("Encounter deleted successfully");
      onBack();
      onRefetch();
    },
    onError: (error: any) => {
          console.log(error);
    //   toast.error(error?.message || "Failed to delete encounter");
    },
  });

  const resetAllForms = () => {
    medicationForm.reset();
    surgicalForm.reset();
    investigationForm.reset();
    assignForm.reset();
    setCurrentStep(ModalStep.FORM);
    setFormData(null);
    setCurrentFlow(null);
  };

  const openModal = (flow: ModalFlow) => {
    setCurrentFlow(flow);
    setCurrentStep(ModalStep.FORM);
    setModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    setCurrentStep(ModalStep.ASSIGN);
  };

  const handleAssignSubmit = async (assignData: AssignPatientFormValues) => {
    if (!currentFlow) return;

    let payload: any = {
      flow_type: currentFlow,
      department: assignData.department,
      doctor: assignData.doctor,
    };

    if (currentFlow === ModalFlow.REQUEST_INVESTIGATION) {
      payload.investigation_type = formData.investigation_type;
    } else if (currentFlow === ModalFlow.PRESCRIBE_MEDICATION) {
      // Transform medications to backend format
      payload.medications = formData.medications.map((med: any) => ({
        medicine: med.medicine,
        dosage: med.dosage,
        medicine_type: med.medicine_type || "",
        start_date: med.start_date.toISOString(),
        end_date: med.end_date.toISOString(),
        frequency: med.frequency === "custom" ? med.custom_frequency : med.frequency,
        quantity: med.quantity,
        notes: med.notes || "",
      }));
    } else if (currentFlow === ModalFlow.SURGICAL_CONSULTATION) {
      payload.surgical_request = formData;
    }

    assignMutation.mutate(payload);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Encounter?",
      message: "This action cannot be undone.",
      variant: "destructive",
    });
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getModalTitle = () => {
    if (currentStep === ModalStep.ASSIGN) return "Assign Patient";

    switch (currentFlow) {
      case ModalFlow.REQUEST_INVESTIGATION:
        return "Request Investigation";
      case ModalFlow.PRESCRIBE_MEDICATION:
        return "Prescribe Medication";
      case ModalFlow.SURGICAL_CONSULTATION:
        return "Request Surgical Consultation";
      default:
        return "";
    }
  };

  const isOwnEncounter = currentUserId === encounter.consultation.doctor.id;
  const complaints = encounter.main_complaints.split(",").map((c) => c.trim());

  return (
    <>
      <Card className="border-b-2 border-b-[#E58116]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={encounter.consultation.doctor.profile_picture || ""}
                  alt={`${encounter.consultation.doctor.first_name} ${encounter.consultation.doctor.last_name}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(
                    encounter.consultation.doctor.first_name,
                    encounter.consultation.doctor.last_name
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-md">
                    Dr. {encounter.consultation.doctor.first_name}{" "}
                    {encounter.consultation.doctor.last_name}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    submitted
                  </span>
                  <span className="text-sm text-[#E58116]">
                    Encounter Notes
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="border-r pr-3">
                {format(new Date(encounter.created_at), "MMM dd, yyyy")}
              </span>
              <span>{format(new Date(encounter.created_at), "hh:mm a")}</span>
              {isOwnEncounter && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuItem onClick={onEdit}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => openModal(ModalFlow.REQUEST_INVESTIGATION)}
                    >
                      Request Investigation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openModal(ModalFlow.PRESCRIBE_MEDICATION)}
                    >
                      Prescribe Medication
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openModal(ModalFlow.SURGICAL_CONSULTATION)}
                    >
                      Request Surgical Consultation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-6 w-6">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-bold">Encounter Note</h3>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Main Complaints
              </p>
              <div className="flex flex-wrap gap-2">
                {complaints.map((complaint, index) => (
                  <span
                    key={index}
                    className="text-sm"
                  >
                    {complaint}
                    {index < complaints.length - 1 && (
                      <span className="mx-2 text-muted-foreground">|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                History of Present Illness
              </p>
              <p className="text-sm">{encounter.present_illness_history}</p>
            </div>

            {encounter.past_medical_history && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Past Medical History
                </p>
                <p className="text-sm">{encounter.past_medical_history}</p>
              </div>
            )}

            {encounter.previous_operations && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Previous Operations
                </p>
                <p className="text-sm">{encounter.previous_operations}</p>
              </div>
            )}

            {encounter.received_medication && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Received Medicines
                </p>
                <p className="text-sm">{encounter.received_medication}</p>
              </div>
            )}

            {encounter.recommendation && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Recommendations
                </p>
                <p className="text-sm">{encounter.recommendation}</p>
              </div>
            )}

            {encounter.additional_notes &&
              Object.keys(encounter.additional_notes).length > 0 && (
                <>
                  {Object.entries(encounter.additional_notes).map(
                    ([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-semibold text-muted-foreground mb-1 capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm">{String(value)}</p>
                      </div>
                    )
                  )}
                </>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{getModalTitle()}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {currentStep === ModalStep.FORM ? (
              <>
                {currentFlow === ModalFlow.REQUEST_INVESTIGATION && (
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
                          type="submit"
                          className="w-42.5 rounded-full bg-primary hover:bg-primary/90"
                        >
                          Proceed
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                )}

                {currentFlow === ModalFlow.PRESCRIBE_MEDICATION && (
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
                          type="submit"
                          className="w-42.5 rounded-full bg-primary hover:bg-primary/90"
                        >
                          Proceed
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                )}

                {currentFlow === ModalFlow.SURGICAL_CONSULTATION && (
                  <Form {...surgicalForm}>
                    <form
                      onSubmit={surgicalForm.handleSubmit(handleFormSubmit)}
                      className="space-y-4"
                    >
                      <SurgicalRequestForm
                        form={surgicalForm}
                        surgeries={surgeries}
                      />
                      <DialogFooter className="px-6 pb-4">
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
                  <AssignPatientForm form={assignForm} />
                  <DialogFooter className="px-6 pb-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(ModalStep.FORM)}
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
    </>
  );
}