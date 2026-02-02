"use client";

import type { ReceptionConsultationData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, XCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { ConfirmAction } from "@/components/reuse-confirm-modal";
import { useCustomUrlApiMutation } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { CheckInModal } from "./check-in-modal";
import Link from "next/link";

interface PatientsTableProps {
  patients: ReceptionConsultationData[];
  activeTab: string | null;
}

export function PatientsTable({ patients, activeTab }: PatientsTableProps) {
  const isInQueue = activeTab === "in_queue";
  const isFinishedOrCanceled =
    activeTab === "finished" || activeTab === "canceled";
  const isAllPatients = activeTab === "all";
  const [cancelOpen, setCancelOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [patientId, setPatientId] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");

  const queryClient = useQueryClient();

  const getBillingBadge = (billingStatus: string | null) => {
    if (!billingStatus)
      return <span className="text-muted-foreground">N/A</span>;
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      unpaid: "bg-red-100 text-red-800",
    };
    return (
      <Badge
        className={`${colors[billingStatus] || "bg-gray-100 text-gray-800"} border-0 capitalize`}
      >
        {billingStatus}
      </Badge>
    );
  };

  const cancelMutation = useCustomUrlApiMutation<any>("PATCH", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
    onError: (error: any) => {
      console.log("[v0] Invite error:", error);
    },
  });

  const getVitalsBadge = (vitalTaken: boolean) => {
    return (
      <Badge
        className={
          vitalTaken
            ? "bg-green-100 text-green-800 border-0"
            : "bg-yellow-100 text-yellow-800 border-0"
        }
      >
        {vitalTaken ? "Taken" : "Pending"}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      in_queue: "bg-blue-100 text-blue-800",
      finished: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
    };
    const statusVariantMap: Record<
      string,
      | "default"
      | "destructive"
      | "link"
      | "secondary"
      | "outline"
      | "ghost"
      | null
      | undefined
    > = {
      in_queue: "default",
      finished: "default",
      canceled: "destructive",
    };

    return (
      <Badge
        variant={statusVariantMap[status] || "default"}
        className={`${statusMap[status] || "bg-gray-100 text-gray-800"} border-0 capitalize`}
      >
        {status || "N/A"}
      </Badge>
    );
  };

  const cancelFunction = async () => {
    const res = cancelMutation.mutateAsync({
      url: `/receptionist/patient/consultation/${patientId}/status/`,
      data: { status: "canceled" },
    });
    return res;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            {isInQueue && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Queue No
              </th>
            )}
            {!isAllPatients && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Status
              </th>
            )}
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
              Name
            </th>
            {isAllPatients && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                MRN
              </th>
            )}
            {!isAllPatients && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Vitals
              </th>
            )}
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
              Gender
            </th>
            {!isAllPatients && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Billing Status
              </th>
            )}
            {isAllPatients && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Phone
              </th>
            )}
            {isAllPatients && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Email
              </th>
            )}
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr
              key={index}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              {isInQueue && (
                <td className="px-4 py-3 font-mono text-xs font-semibold">
                  {patient.queue_number || "N/A"}
                </td>
              )}
              {!isAllPatients && (
                <td className="px-4 py-3">
                  {patient.status && getStatusBadge(patient.status)}
                </td>
              )}
              <td className="px-4 py-3 font-medium">
                {patient.first_name} {patient.middle_name || ""}{" "}
                {patient.surname}
              </td>
              {isAllPatients && <td className="px-4 py-3">{patient.mrn}</td>}
              {!isAllPatients && (
                <td className="px-4 py-3">
                  {getVitalsBadge(patient.vital_taken)}
                </td>
              )}
              <td className="px-4 py-3 capitalize">
                {patient.gender || "N/A"}
              </td>
              {!isAllPatients && (
                <td className="px-4 py-3">
                  {getBillingBadge(patient.billing_status)}
                </td>
              )}
              {isAllPatients && (
                <td className="px-4 py-3 text-xs">{patient.phone || "N/A"}</td>
              )}
              {isAllPatients && (
                <td className="px-4 py-3 text-xs truncate">
                  {patient.email || "N/A"}
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {isAllPatients && patient.status === "in_queue" ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1"
                      disabled
                    >
                      In Queue
                    </Button>
                  ) : isAllPatients ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1"
                      onClick={() => {
                        setCheckInOpen(true);
                        setPatientId(patient.id);
                        setSelectedPatientName(
                          `${patient.first_name} ${patient.middle_name || ""} ${patient.surname}`,
                        );
                      }}
                    >
                      Check In
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 bg-transparent border-primary text-primary"
                  >
                    <Link href={`/patient/${patient.consultation_id}/receipt`}>
                    View
                    </Link>
                  </Button>
                  {isInQueue && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600 hover:text-red-700 bg-transparent border-red-700"
                      onClick={() => {
                        setCancelOpen(true);
                        setPatientId(patient.consultation_id);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmAction
        open={cancelOpen}
        setOpen={setCancelOpen}
        triggerText="Cancel Consultation"
        onConfirm={cancelFunction}
        actionText="Cancel"
        title="Cancel Consultation"
        description="Are you sure you want to cancel this consultation?"
        isPending={cancelMutation.isPending}
        variant="destructive"
      />

      <CheckInModal
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
        patientId={patientId}
        patientName={selectedPatientName}
      />
    </div>
  );
}
