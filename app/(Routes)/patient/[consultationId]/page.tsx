"use client";

import { use, useCallback, useState } from "react";
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
import { useAuth } from "@/providers/auth-provider";
import { request, useApiMutation } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";

import AllPatientInformation from "./components/all-patient-info";
// import {
//   VitalList,
//   EncounterList,
//   LabList,
//   MedicationList,
//   SurgeryList,
//   ScanList,
// } from "./components/ind";

import {
  prescribeMedicationSchema,
  surgicalRequestSchema,
  investigationRequestSchema,
  assignPatientSchema,
  PrescribeMedicationFormValues,
  SurgicalRequestFormValues,
  InvestigationRequestFormValues,
  AssignPatientFormValues,
} from "./encounter-notes/schemas/encounters.schema";
import { EncounterForm } from "./encounter-notes/components/encounter-form";
import { InvestigationRequestForm } from "./components/forms/investigation-request";
import { PrescribeMedicationForm } from "./components/forms/prescibe-medication";
import { SurgicalRequestForm } from "./components/forms/surgical-request";
import { AssignPatientForm } from "./components/forms/assign-patient";

enum ModalFlow {
  REQUEST_INVESTIGATION = "request_investigation",
  PRESCRIBE_MEDICATION = "prescribe_medication",
  SURGICAL_CONSULTATION = "request_surgical",
}

enum ModalStep {
  FORM = "form",
  ASSIGN = "assign",
}

interface ConsultationDetailPageProps {
  params: Promise<{ consultationId: string }>;
}

export default function ConsultationDetailPage({
  params,
}: ConsultationDetailPageProps) {
  let currentTab = "All";
  const { user } = useAuth();
  const { consultationId } = use(params);
  const currentUserId = user?.pk || "";

  const [showEncounterForm, setShowEncounterForm] = useState(false);
  const [encounterToEdit, setEncounterToEdit] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<ModalFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<ModalStep>(ModalStep.FORM);
  const [formData, setFormData] = useState<any>(null);

  const { showSuccess } = useSuccessModal();

  // Fetch consultation data
  const {
    data: consultation,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => request(`/patient/consultation/${consultationId}/info`),
  });

  console.log(consultation, "na im");

  // Fetch medicines, labs, surgeries for modals
  const { data: medicines = [] } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const response = await request("/doctor/medicines/list/");
      return response.map((med: any) => ({
        label: med.title,
        value: med.id,
      }));
    },
  });

  const { data: labTests = [] } = useQuery({
    queryKey: ["lab-tests"],
    queryFn: async () => {
      const response = await request("/hospital/lab-test-configurations/list/");
      return response.map((test: any) => ({
        label: test.test_name,
        value: String(test.id),
      }));
    },
  });

  const { data: surgeries = [] } = useQuery({
    queryKey: ["surgeries"],
    queryFn: async () => {
      const response = await request(
        "/hospital/item-pricings/list/?item_type=surgery",
      );
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

  // Assign mutation
  const assignMutation = useApiMutation(
    "POST",
    `/doctor/consultations/${consultationId}/assign/`,
    {
      onSuccess: () => {
        showSuccess("Patient assigned successfully");
        setModalOpen(false);
        resetAllForms();
        refetch();
      },
    },
  );

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
    } else if (currentFlow === ModalFlow.SURGICAL_CONSULTATION) {
      payload.surgical_request = formData;
    }

    assignMutation.mutate(payload);
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

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEditEncounter = () => {
    setEncounterToEdit(consultation?.encounter);
    setShowEncounterForm(true);
  };

  const handleEncounterSuccess = () => {
    refetch();
    setShowEncounterForm(false);
    setEncounterToEdit(undefined);
  };

  return (
    <>
      {currentTab === "All" && (
        <AllPatientInformation
          vital={consultation?.vital}
          encounter={consultation?.encounter}
          labs={consultation?.labs || []}
          medications={consultation?.medications || []}
          surgeries={consultation?.surgeries || []}
          scans={consultation?.scans || []}
          isLoading={isLoading}
          consultationId={consultationId}
          currentUserId={currentUserId}
          onRefetch={handleRefetch}
          onEditEncounter={handleEditEncounter}
          onOpenPrescription={() => openModal(ModalFlow.PRESCRIBE_MEDICATION)}
          onOpenInvestigation={() => openModal(ModalFlow.REQUEST_INVESTIGATION)}
          onOpenSurgical={() => openModal(ModalFlow.SURGICAL_CONSULTATION)}
        />
      )}
      {/* 
      {currentTab === "Vitals" && (
        <VitalList
          vitals={consultation?.vital ? [consultation.vital] : []}
          isLoading={isLoading}
        />
      )}

      {currentTab === "Encounter Note" && (
        <EncounterList
          encounters={consultation?.encounter ? [consultation.encounter] : []}
          isLoading={isLoading}
          currentUserId={currentUserId}
          onRefetch={handleRefetch}
          onEditEncounter={handleEditEncounter}
          onOpenPrescription={() => openModal(ModalFlow.PRESCRIBE_MEDICATION)}
          onOpenInvestigation={() => openModal(ModalFlow.REQUEST_INVESTIGATION)}
          onOpenSurgical={() => openModal(ModalFlow.SURGICAL_CONSULTATION)}
          onAddEncounter={() => setShowEncounterForm(true)}
        />
      )}

      {currentTab === "Labs" && (
        <LabList
          labs={consultation?.labs || []}
          isLoading={isLoading}
          currentUserId={currentUserId}
        />
      )}

      {currentTab === "Scan" && (
        <ScanList scans={consultation?.scans || []} isLoading={isLoading} />
      )}

      {currentTab === "Surgery" && (
        <SurgeryList
          surgeries={consultation?.surgeries || []}
          isLoading={isLoading}
        />
      )}

      {currentTab === "Medication" && (
        <MedicationList
          medications={consultation?.medications || []}
          isLoading={isLoading}
        />
      )} */}

      {/* Encounter Form Modal */}

      {/* Action Modals */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl min-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{getModalTitle()}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {currentStep === ModalStep.FORM ? (
              <>
                {currentFlow === ModalFlow.REQUEST_INVESTIGATION && (
                  <Form {...investigationForm}>
                    <form
                      onSubmit={investigationForm.handleSubmit(
                        handleFormSubmit,
                      )}
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
                  <AssignPatientForm
                    allowedDepartments={
                      currentFlow === ModalFlow.PRESCRIBE_MEDICATION
                        ? ["pharmacy"]
                        : currentFlow === ModalFlow.REQUEST_INVESTIGATION
                          ? ["laboratory"]
                          : currentFlow === ModalFlow.SURGICAL_CONSULTATION
                            ? ["surgery"]
                            : []
                    }
                    form={assignForm}
                  />
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
