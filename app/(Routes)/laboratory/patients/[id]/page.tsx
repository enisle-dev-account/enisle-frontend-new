"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiQuery, useApiMutation } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, Share2, Trash2, Edit2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuccessModal } from "@/providers/success-modal-provider";
import EmptyList from "@/components/empty-list";
import { PatientLaboratoryInfoResponse } from "@/types/laboratory";



export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const { showSuccess } = useSuccessModal();
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  const { data, isLoading, refetch } = useApiQuery<PatientLaboratoryInfoResponse>(
    ["patient", patientId],
    `/patient/${patientId}/laboratory/list/`,
  );

  const deleteMutation = useApiMutation("DELETE", "", {
    onSuccess: () => {
      showSuccess("Test result deleted successfully");
      refetch();
    },
    onError: () => {
      showSuccess("Failed to delete test result");
    },
  });

  const handleDeleteResult = (resultId: number | string) => {
    if (confirm("Are you sure you want to delete this test result?")) {
      deleteMutation.mutate({
        url: `/laboratory/result/delete/${resultId}/`,
        data: {},
      });
    }
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

  const patient = data.patient;
  const testResults = data.labs || [];

  return (
    <div className="p-6 space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Patient Info Card */}
      <div className="bg-background rounded-xl border p-6">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {patient.profile_picture_location ? (
              <img
                src={patient.profile_picture_location}
                alt={`${patient.first_name} ${patient.middle_name} ${patient.surname}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-white">
                {patient.first_name.charAt(0)}
                {patient.surname.charAt(0)}
              </div>
            )}
          </div>

          {/* Patient Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {patient.first_name} {patient.middle_name || ""} {patient.surname}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              #{patient.id}
            </p>

            <div className="grid grid-cols-4 gap-6">
              {/* <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Lab Scientist
                </p>
                <p className="font-medium">{patient}</p>
              </div> */}
              {/* <div>
                <p className="text-sm text-muted-foreground mb-1">Hospital</p>
                <p className="font-medium">{patient.hospital_name}</p>
              </div> */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="font-medium capitalize">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next date</p>
                <p className="font-medium">-</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="bg-primary hover:bg-primary/90 rounded-full">
                Import Data
              </Button>
              <Button variant="outline" className="rounded-full">
                Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results Section */}
      <div className="bg-background rounded-xl border overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-md">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">
              Total Test Results {testResults.length}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Bulk Action</span>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {testResults.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No test results available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr className="text-sm font-medium text-muted-foreground border-b">
                  <th className="px-6 py-4 text-left">No</th>
                  <th className="px-6 py-4 text-left">Hospital Number</th>
                  <th className="px-6 py-4 text-left">Test Type</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result, index) => (
                  <tr
                    key={result.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium">{index + 1}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{patient.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{result.investigation_request.request_type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>
                        {new Date(result.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            setExpandedResult(
                              expandedResult === result.id ? null : result.id,
                            )
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expanded Result Details */}
      {expandedResult !== null && (
        <div className="bg-background rounded-xl border p-6">
          {testResults
            .filter((r) => r.id === expandedResult)
            .map((result) => (
              <div key={result.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{result.investigation_request.request_type}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedResult(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {result.result.map((param:any, idx:number) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {param.name}
                      </p>
                      <p className="text-lg font-semibold">{param.value}</p>
                      {param.reference_range && (
                        <p className="text-xs text-muted-foreground">
                          Reference: {param.reference_range}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
