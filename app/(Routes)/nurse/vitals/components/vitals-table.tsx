"use client";

import type { NurseConsultationData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import Link from "next/link";
import { getBillingStatusColor, getConsultationStatusColor } from "@/lib/utils";

interface VitalsTableProps {
  consultations: NurseConsultationData[];
  isLoading: boolean;
}

function formatConsultationStatus(status: string) {
  return status.replace(/_/g, " ").charAt(0).toUpperCase() + status.slice(1);
}

export function VitalsTable({ consultations, isLoading }: VitalsTableProps) {
  const handleStartVitals = (consultationId: string, vitalId: string) => {
    console.log("[v0] Start Vitals clicked for consultation:", consultationId, "vital:", vitalId);
    // TODO: Navigate to vitals form page with consultation and vital IDs
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading consultations...</p>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No consultations available</p>
      </div>
    );
  }

  return (
    <div className=" overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Patient ID</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Doctor</TableHead>
            <TableHead className="font-semibold">Gender</TableHead>
            <TableHead className="font-semibold">Billing Status</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => {
            const patientName = `${consultation.patient.first_name} ${
              consultation.patient.middle_name ? consultation.patient.middle_name + " " : ""
            }${consultation.patient.surname}`;

            const consultationDate = format(
              new Date(consultation.consultation_date_time),
              "dd MMM yyyy"
            );

            return (
              <TableRow key={consultation.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-sm">
                  {consultation.patient.mrn}
                </TableCell>
                <TableCell className="text-sm">{patientName}</TableCell>
                <TableCell className="text-sm">{consultationDate}</TableCell>
                <TableCell className="text-sm">
                  Dr. {consultation.doctor.first_name} {consultation.doctor.last_name}
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {consultation.patient.gender}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getBillingStatusColor(consultation.billing_status)}
                  >
                    {consultation.billing_status ? (
                      consultation.billing_status.charAt(0).toUpperCase() +
                      consultation.billing_status.slice(1)
                    ) : (
                      "N/A"
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getConsultationStatusColor(consultation.status)}
                  >
                    {formatConsultationStatus(consultation.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStartVitals(consultation.id, consultation.vital_id)
                    }
                    className="border-primary text-primary bg-transparent hover:bg-primary/10"
                  >
                    <Link href={`/patient/${consultation.id}?tab=vitals`}>
                      Start Vitals
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
