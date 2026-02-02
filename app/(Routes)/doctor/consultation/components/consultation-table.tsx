"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, X, Eye } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/providers/confirm-box-provider";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { request } from "@/hooks/api";
import type { DoctorConsultationData } from "@/types";

interface ConsultationsTableProps {
  consultations: DoctorConsultationData[];
  activeTab: string | null;
}

export function ConsultationsTable({
  consultations,
  activeTab,
}: ConsultationsTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const { showSuccess } = useSuccessModal();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const isInQueue = activeTab === "in_queue";
  const isCheckout = activeTab === "checkout";
  const isFinished = activeTab === "finished";
  const isCanceled = activeTab === "canceled";

  const cancelMutation = useMutation({
    mutationFn: (consultationId: string) =>
      request(`/doctor/consultation/${consultationId}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ status: "canceled" }),
      }),
    onSuccess: () => {
      showSuccess("Consultation canceled successfully");
      setCancellingId(null);
      queryClient.invalidateQueries({ queryKey: ["doctor-consultations"] });
    },
    onError: (error: any) => {
      console.error("Cancel failed:", error);
      setCancellingId(null);
    },
  });

  const handleCancel = async (consultationId: string) => {
    const confirmed = await confirm({
      title: "Cancel Consultation?",
      message: "Are you sure you want to cancel this consultation?",
      variant: "destructive",
    });

    if (confirmed) {
      setCancellingId(consultationId);
      cancelMutation.mutate(consultationId);
    }
  };

  const handleCheckIn = (consultationId: string) => {
    router.push(`/patient/${consultationId}`);
  };

  const handleRowClick = (consultationId: string) => {
    router.push(`/patient/${consultationId}`);
  };

  const handleVitalsClick = (consultationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/patient/${consultationId}/vitals`);
  };

  const getQueueNumberBadge = (
    queueNumber: number | null,
    status: string
  ) => {
    if (!queueNumber) return null;

    const getBgColor = () => {
      if (status === "checked_in") return "bg-green-500";
      if (status === "not_present") return "bg-orange-500";
      return "bg-green-500";
    };

    return (
      <div
        className={`h-10 w-10 rounded-full ${getBgColor()} flex items-center justify-center text-white font-bold text-sm`}
      >
        {queueNumber}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; className: string }
    > = {
      checked_in: {
        label: "Checked In",
        className: "bg-green-50 text-green-600 border-green-200",
      },
      not_present: {
        label: "Not Present",
        className: "bg-orange-50 text-orange-600 border-orange-200",
      },
      in_queue: {
        label: "In Queue",
        className: "bg-blue-50 text-blue-600 border-blue-200",
      },
      finished: {
        label: "Finished",
        className: "bg-gray-50 text-gray-600 border-gray-200",
      },
      canceled: {
        label: "Canceled",
        className: "bg-red-50 text-red-600 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.in_queue;

    return (
      <Badge variant="outline" className={`${config.className} capitalize`}>
        {config.label}
      </Badge>
    );
  };

  const getVitalsBadge = (isTaken: boolean, consultationId: string, e: any) => {
    if (isTaken) {
      return (
        <button
          onClick={(event) => handleVitalsClick(consultationId, event)}
          className="text-primary hover:underline text-sm font-medium"
        >
          Taken
        </button>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
        Pending
      </Badge>
    );
  };

  const getBillingBadge = (billingStatus: string | null) => {
    if (!billingStatus) return <span className="text-muted-foreground text-sm">N/A</span>;

    const statusConfig: Record<string, { className: string }> = {
      paid: { className: "bg-green-50 text-green-600 border-green-200" },
      pending: { className: "bg-yellow-50 text-yellow-600 border-yellow-200" },
      unpaid: { className: "bg-red-50 text-red-600 border-red-200" },
    };

    const config = statusConfig[billingStatus] || statusConfig.pending;

    return (
      <Badge variant="outline" className={`${config.className} capitalize`}>
        {billingStatus}
      </Badge>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="hover:bg-transparent">
            {isInQueue && (
              <TableHead className="font-semibold">Queue no / Status</TableHead>
            )}
            {!isInQueue && <TableHead className="font-semibold">Status</TableHead>}
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Vitals</TableHead>
            <TableHead className="font-semibold">Gender</TableHead>
            <TableHead className="font-semibold">Billing Status</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <motion.tr
              key={consultation.id}
              variants={rowVariants}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => handleRowClick(consultation.id)}
            >
              {isInQueue ? (
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getQueueNumberBadge(
                      consultation.queue_number,
                      consultation.status
                    )}
                    {getStatusBadge(consultation.status)}
                  </div>
                </TableCell>
              ) : (
                <TableCell>{getStatusBadge(consultation.status)}</TableCell>
              )}
              <TableCell>
                <p className="font-medium text-sm">
                  {consultation.patient.first_name}{" "}
                  {consultation.patient.middle_name || ""}{" "}
                  {consultation.patient.surname}
                </p>
                {consultation.patient.mrn && (
                  <p className="text-xs text-muted-foreground">
                    MRN: {consultation.patient.mrn}
                  </p>
                )}
              </TableCell>
              <TableCell>
                {getVitalsBadge(
                  consultation.is_vitals_taken,
                  consultation.id,
                  null
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm capitalize">
                  {consultation.patient.gender}
                </span>
              </TableCell>
              <TableCell>
                {getBillingBadge(consultation.billing_status)}
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(isInQueue || isCheckout) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckIn(consultation.id);
                      }}
                    >
                      Check In
                    </Button>
                  )}
                  {(isFinished || isCanceled) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckIn(consultation.id);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  )}
                  {isInQueue && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement notification feature
                        }}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(consultation.id);
                        }}
                        disabled={cancellingId === consultation.id}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}