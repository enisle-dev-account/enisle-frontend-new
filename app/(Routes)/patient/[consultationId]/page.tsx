"use client";

import { use, useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { request, useApiQuery } from "@/hooks/api";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientProfileHeader } from "./components/patient-profile-header";
import { PatientProfileTabs } from "./components/patient-profile-tabs";
import { DetailedPatientConsultationInfoResponse } from "@/types";
import AllPatientInformation from "./components/tabs/all-patient-info";
import VitalsTabView from "./components/tabs/vitals/vitals-tab";
import EncounterNotesTabView from "./components/tabs/encounter-notes/encounter-tab";
import MedicationsTabView from "./components/tabs/medication/medication-tab";
import LabsTabView from "./components/tabs/lab/lab-tab";
import ScansTabView from "./components/tabs/scans/scans-tab";
import SurgeriesTabView from "./components/tabs/surgery/surgery-tab";
import { useQuery } from "@tanstack/react-query";
import { UnifiedAssignModal } from "./components/assing-modal";

interface PatientViewPageProps {
  params: Promise<{ consultationId: string }>;
}

type ModalFlow =
  | "request_investigation"
  | "prescribe_medication"
  | "request_surgical";

export default function PatientViewPage({ params }: PatientViewPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { consultationId: id } = use(params);

  const isConsultationView = isNaN(Number(id));
  const consultationId = isConsultationView ? id : null;
  const patientId = !isConsultationView ? id : null;

  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("tab") || "all",
  );

  const [modalFlow, setModalFlow] = useState<ModalFlow | null>(null);

  const endpoint = isConsultationView
    ? `/patient/consultation/${consultationId}/info`
    : `/patient/${patientId}/consultation-data`;

  const {
    data: patientData,
    isLoading,
    refetch,
  } = useApiQuery<DetailedPatientConsultationInfoResponse>(
    ["patient-data", id],
    endpoint,
  );


   const { data: labTests = [] } = useQuery({
    queryKey: ["lab-tests"],
    queryFn: async () => {
      const response = await request("/hospital/lab-tests/");
      return response
    },
  });

  const { data: surgeries = [] } = useQuery({
    queryKey: ["surgeries"],
    queryFn: async () => {
      const response = await request(
        "/hospital/pricing?categories=surgery,lab,scan",
      );
      return response
    },
  });


  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      router.push(`${url.pathname}${url.search}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const openModal = (flow: ModalFlow) => {
    setModalFlow(flow);
  };

  const closeModal = () => {
    setModalFlow(null);
  };

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);


  
  if (!user) {
    router.push("/auth/login");
    return null;
  }




  if (isLoading) {
    return (
      <main className="rounded-t-2xl bg-background overflow-hidden h-full p-6">
        <Skeleton className="h-40 w-full mb-6" />
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  if (!patientData) {
    return (
      <main className="rounded-t-2xl bg-background overflow-hidden h-full p-6">
        <div className="text-center text-muted-foreground">
          Patient data not found
        </div>
      </main>
    );
  }

  const currentUserId = user?.pk || "";

  return (
    <main className="rounded-t-2xl space-y-4 overflow-hidden h-full flex flex-col">
      <PatientProfileHeader
        patientData={patientData.patient}
        userRole={user.role}
        isConsultationView={isConsultationView}
      />

      <div className="overflow-y-auto">
        <PatientProfileTabs
          userRole={user.role}
          id={id}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className="py-4">
          {activeTab === "all" && (
            <AllPatientInformation
              data={patientData}
              isLoading={isLoading}
              consultaionId={consultationId}
              isConsultationView={isConsultationView}
              currentUserId={currentUserId}
              onRefetch={handleRefetch}
              onOpenPrescription={() => openModal("prescribe_medication")}
              onOpenInvestigation={() => openModal("request_investigation")}
              onOpenSurgical={() => openModal("request_surgical")}
            />
          )}

          {activeTab === "vitals" && (
            <VitalsTabView
              vitals={patientData.vitals || []}
              isLoading={isLoading}
              isConsultationView={isConsultationView}
            />
          )}

          {activeTab === "encounter_notes" && (
            <EncounterNotesTabView
              encounters={patientData.encounters.length===0 && isConsultationView ? [{} as any]:patientData.encounters}
              isLoading={isLoading}
              isConsultationView={isConsultationView}
              consultationId={consultationId}
              currentUserId={currentUserId}
              onRefetch={handleRefetch}
              onOpenPrescription={() => openModal("prescribe_medication")}
              onOpenInvestigation={() => openModal("request_investigation")}
              onOpenSurgical={() => openModal("request_surgical")}
            />
          )}

          {activeTab === "medication" && (
            <MedicationsTabView
              medications={patientData.medications || []}
              isLoading={isLoading}
              isConsultationView={isConsultationView}
              onRefetch={handleRefetch}
            />
          )}

          {activeTab === "labs" && (
            <LabsTabView
              labs={patientData.labs || []}
              isLoading={isLoading}
              isConsultationView={isConsultationView}
              currentUserId={currentUserId}
            />
          )}

          {activeTab === "scan" && (
            <ScansTabView
              scans={patientData.scans || []}
              isLoading={isLoading}
              isConsultationView={isConsultationView}
            />
          )}

          {activeTab === "surgery" && (
            <SurgeriesTabView
              surgeries={patientData.surgeries || []}
              isLoading={isLoading}
              isConsultationView={isConsultationView}
              consultationId={consultationId}
              currentUserId={currentUserId}
              onRefetch={handleRefetch}
            />
          )}
        </div>
      </div>

       <UnifiedAssignModal
        flow={modalFlow}
        consultationId={consultationId || ""}
        isOpen={!!modalFlow}
        onClose={closeModal}
        onSuccess={handleRefetch}
      />
    </main>
  );
}
