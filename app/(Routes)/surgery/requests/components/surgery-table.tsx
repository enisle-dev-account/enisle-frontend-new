"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
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
import type { SurgeryPatientsListData } from "@/types";

interface SurgeryTableProps {
  surgeries: SurgeryPatientsListData[];
  activeTab: string | null;
}

export function SurgeryTable({ surgeries, activeTab }: SurgeryTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const { showSuccess } = useSuccessModal();
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const isInPatient = activeTab === "In - Patients";
  const isOutPatient = activeTab === "Out - Patients";

  const checkInMutation = useMutation({
    mutationFn: (surgeryId: string) =>
      request(`/surgery/surgery-result/${surgeryId}/consultation/update/`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      showSuccess("Patient has been checked in successfully!");
      setCheckingInId(null);
      queryClient.invalidateQueries({ queryKey: ["surgery-patients"] });
    },
    onError: (error: any) => {
      console.error("Check-in failed:", error);
      setCheckingInId(null);
    },
  });

  const handleCheckIn = async (surgeryId:string ) => {
    const confirmed = await confirm({
      title: "Check In Patient?",
      message: "Are you sure you want to check in this patient?",
    });

    if (confirmed) {
      setCheckingInId(surgeryId);
      checkInMutation.mutate(surgeryId);
    }
  };

  const handleView = (surgeryId: string) => {
    router.push(`/patient/${surgeryId}`);
  };

  const getBillingBadge = (billingStatus: string | null) => {
    if (!billingStatus)
      return <span className="text-muted-foreground text-sm">N/A</span>;

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
            <TableHead className="font-semibold">Patient ID</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Admission Date</TableHead>
            <TableHead className="font-semibold">Doctor</TableHead>
            <TableHead className="font-semibold">Gender</TableHead>
            <TableHead className="font-semibold">Billing Status</TableHead>
            <TableHead className="font-semibold">Procedure</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surgeries.map((surgery) => (
            <tr
              key={surgery.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => handleView(surgery.consultation)}
            >
              <TableCell>
                <span className="font-medium text-sm">
                  {String(surgery.id).padStart(3, "0")}
                </span>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">
                  {surgery.patient.first_name}{" "}
                  {surgery.patient.middle_name || ""} {surgery.patient.surname}
                </p>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {surgery.patient.admission_date
                    ? new Date(
                        surgery.patient.admission_date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {surgery.patient.doctor.first_name}{" "}
                  {surgery.patient.doctor.last_name}
                </p>
              </TableCell>
              <TableCell>
                <span className="text-sm capitalize">
                  {surgery.patient.gender}
                </span>
              </TableCell>
              <TableCell>{getBillingBadge(surgery.billing_status)}</TableCell>
              <TableCell>
                <span className="text-sm">{surgery.procedure}</span>
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!surgery.patient.is_admitted && isInPatient && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-primary text-primary hover:bg-primary hover:text-white rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckIn(surgery.consultation);
                      }}
                      disabled={checkingInId === surgery.consultation}
                    >
                      {checkingInId === surgery.consultation
                        ? "Checking in..."
                        : "Check-in"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-primary text-primary hover:bg-primary hover:text-white rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(surgery.consultation);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                </div>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
