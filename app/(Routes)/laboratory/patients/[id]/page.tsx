"use client";

import { useParams } from "next/navigation";
import { useApiQuery } from "@/hooks/api";

import { Skeleton } from "@/components/ui/skeleton";
import EmptyList from "@/components/empty-list";
import { useQueries } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import type { PatientLaboratoryInfoResponse } from "@/types/laboratory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MapPin, Mail } from "lucide-react";
import type { DetailedConsultationResponsePatient } from "@/types";
import LabTestCard from "@/app/(Routes)/patient/[consultationId]/components/tabs/lab/lab-card";

interface PatientProfileHeaderProps {
  patient:
    | DetailedConsultationResponsePatient
    | {
        id: number | string;
        first_name: string;
        middle_name?: string;
        surname: string;
        gender: string;
        email?: string;
        phone?: string;
        address?: string;
        profile_picture_location?: string | null;
        age?: number;
      };
}

function PatientProfileHeader({ patient }: PatientProfileHeaderProps) {
  const fullName =
    `${patient.first_name} ${patient.middle_name || ""} ${patient.surname}`.trim();
  const initials =
    `${patient.first_name.charAt(0)}${patient.surname.charAt(0)}`.toUpperCase();

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={patient.profile_picture_location || undefined}
            alt={fullName}
          />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Patient Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {fullName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="capitalize">{patient.gender}</span>
                {patient.age && <span>{patient.age} years old</span>}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            {patient.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{patient.address}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default function PatientLabDetailPage() {
  const params = useParams();
  const patientId = params.id as string;

  // Fetch patient data with all labs
  const { data, isLoading } = useApiQuery<PatientLaboratoryInfoResponse>(
    ["patient-lab-info", patientId],
    `/patient/${patientId}/laboratory/list/`,
  );

  // Get unique test config IDs
  const testConfigIds = data?.labs
    ? [
        ...new Set(
          data.labs
            .map((lab) => lab.investigation_request?.request_id)
            .filter((id): id is number => id !== undefined),
        ),
      ]
    : [];

  // Fetch all test configs
  const configQueries = useQueries({
    queries: testConfigIds.map((id) => ({
      queryKey: ["lab-test-config", id],
      queryFn: () => request(`/hospital/lab-tests/${id}/`),
      enabled: !!data,
    })),
  });

  const isConfigsLoading = configQueries.some((q) => q.isLoading);

  // Build test configs map
  const testConfigs: Record<number, any> = {};
  configQueries.forEach((query, index) => {
    if (query.data) {
      testConfigs[testConfigIds[index]] = query.data;
    }
  });

  if (isLoading || isConfigsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <EmptyList
          title="Patient not found"
          description="The patient you're looking for doesn't exist"
        />
      </div>
    );
  }

  // Group labs by test type for history
  const labsByType: Record<string, typeof data.labs> = {};
  data.labs.forEach((lab) => {
    if (!labsByType[lab.test]) {
      labsByType[lab.test] = [];
    }
    labsByType[lab.test].push(lab);
  });

  // Get unique test types
  const testTypes = [...new Set(data.labs.map((lab) => lab.test))];

  return (
    <div className="p-6 space-y-6">
      {/* Patient Header */}
      <PatientProfileHeader patient={data.patient} />

      {/* Lab Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-md">
                <FlaskConical className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Laboratory Results ({data.labs.length})</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data.labs.length === 0 ? (
            <EmptyList
              title="No Lab Results"
              description="No laboratory test results available for this patient"
            />
          ) : (
            <Tabs defaultValue={testTypes[0]} className="w-full">
              {testTypes.length > 1 && (
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="all">
                    All Tests ({data.labs.length})
                  </TabsTrigger>
                  {testTypes.map((testType) => (
                    <TabsTrigger key={testType} value={testType}>
                      {testType} ({labsByType[testType].length})
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}

              {/* All Tests View */}
              <TabsContent value="all" className="space-y-4">
                {data.labs.map((lab) => {
                  const config = lab.investigation_request?.request_id
                    ? testConfigs[lab.investigation_request.request_id]
                    : undefined;
                  const history = labsByType[lab.test] || [];

                  return (
                    <LabTestCard
                      key={lab.id}
                      labTest={lab}
                    />
                  );
                })}
              </TabsContent>

              {testTypes.map((testType) => (
                <TabsContent
                  key={testType}
                  value={testType}
                  className="space-y-4"
                >
                  {labsByType[testType]
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime(),
                    )
                    .map((lab) => {
                      const config = lab.investigation_request?.request_id
                        ? testConfigs[lab.investigation_request.request_id]
                        : undefined;
                      const history = labsByType[testType] || [];

                      return (
                        <LabTestCard
                          key={lab.id}
                          labTest={lab}
                          patientHistory={history}
                          showInsights={true}
                        />
                      );
                    })}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
