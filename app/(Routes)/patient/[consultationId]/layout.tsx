"use client";

import { useAuth } from "@/providers/auth-provider";
import { useParams, useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/api";
import { PatientProfileHeader } from "./components/patient-profile-header";
import { PatientProfileTabs } from "./components/patient-profile-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { DetailedConsultationResponsePatient } from "@/types";
import { use } from "react";


export default function PatientProfileLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  const { consultationId } = useParams();

  const { data: patientData, isLoading } = useApiQuery<DetailedConsultationResponsePatient>(
    ["patient", String(consultationId)],
    `/patient/consultation/${consultationId}`
  );

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

  if (!patientData || !consultationId) {
    return (
      <main className="rounded-t-2xl bg-background overflow-hidden h-full p-6">
        <div className="text-center text-muted-foreground">
          Patient data not found
        </div>
      </main>
    );
  }

  return (
    <main className="rounded-t-2xl space-y-4  overflow-hidden h-full flex flex-col">
      <PatientProfileHeader patientData={patientData} userRole={user.role} />
      <div className=" overflow-y-auto">
        <PatientProfileTabs
          userRole={user.role}
          consultationId={consultationId as string}
        />
      </div>

      {children}
    </main>
  );
}
