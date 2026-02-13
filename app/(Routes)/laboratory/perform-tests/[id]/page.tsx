"use client";

import { useParams, useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyList from "@/components/empty-list";
import type { SingleLaboratoryRequestData } from "@/types/laboratory";
import { AddBatchTestForm } from "./components/add-test";

export default function ConsultationTestPage() {
  const router = useRouter();
  const params = useParams();
  const consultationId = params.id as string;

  const { data: tests, isLoading, refetch } = useApiQuery<SingleLaboratoryRequestData[]>(
    ["consultation-lab-tests", consultationId],
    `/laboratory/consultation/${consultationId}/tests/`,
  );

  const handleSuccess = () => {
    router.push("/laboratory/patients");
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <EmptyList
            title="No Pending Tests"
            description="All tests for this consultation have been completed"
          />
        </div>
      </div>
    );
  }

  const firstTest = tests[0];

  return (
    <div className="space-y-6">
  

      {/* Patient Info Card */}
      <div className="bg-background rounded-xl  p-6">
        <div className="flex items-center gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {firstTest.patient.profile_picture_location ? (
              <img
                src={firstTest.patient.profile_picture_location}
                alt={`${firstTest.patient.first_name} ${firstTest.patient.surname}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-white">
                {firstTest.patient.first_name.charAt(0)}
                {firstTest.patient.surname.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-1">
                {firstTest.patient.first_name} {firstTest.patient.surname}
              </h1>
              <p className="text-muted-foreground mb-4">
                #{firstTest.patient.id}
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Consulting Doctor
                </p>
                <p className="font-medium">
                  Dr. {firstTest.doctor.first_name}{" "}
                  {firstTest.doctor.last_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Hospital</p>
                <p className="font-medium">{firstTest.hospital.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="font-medium capitalize">
                  {firstTest.patient.gender}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Total Tests
                </p>
                <p className="font-medium text-primary text-lg">
                  {tests.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Test Form */}
      <div className=" rounded-xl ">
        <AddBatchTestForm
        data={tests}
          consultationId={consultationId}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}