"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveLeft } from "lucide-react";
import type { DetailedConsultationResponsePatientVital } from "@/types";
import { getAdmissionStatusColor, getBillingStatusColor } from "@/lib/utils";
import EmptyList from "@/components/empty-list";
import { VitalDetailPage } from "./vital-details";

interface VitalsTabViewProps {
  vitals: DetailedConsultationResponsePatientVital[];
  isLoading: boolean;
  isConsultationView: boolean;
}

export default function VitalsTabView({
  vitals,
  isLoading,
  isConsultationView,
}: VitalsTabViewProps) {
  const [selectedVital, setSelectedVital] =
    useState<DetailedConsultationResponsePatientVital | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isConsultationView && vitals.length === 1 && !selectedVital) {
    return (
      <div className="space-y-6 ">
        <h2 className="text-lg font-bold">Vitals</h2>
        <VitalDetailPage vital={vitals[0]} onClose={() => {}} />
      </div>
    );
  }

  // If viewing a selected vital
  if (selectedVital) {
    return (
      <div className="space-y-6 ">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Vitals</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedVital(null)}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
        <VitalDetailPage
          vital={selectedVital}
          onClose={() => setSelectedVital(null)}
        />
      </div>
    );
  }

  // Empty state
  if (vitals.length === 0) {
    return (
      <EmptyList
        title="No Vitals Yet"
        description="There are no recorded vitals for this patient."
      />
    );
  }

  // Table view for multiple vitals
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Vitals</h2>
      <div className="bg-white rounded-xl overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-[#9C9C9D]">No</TableHead>
              <TableHead className="text-[#9C9C9D]">Date</TableHead>
              <TableHead className="text-[#9C9C9D]">Time</TableHead>
              <TableHead className="text-[#9C9C9D]">Taken By</TableHead>
              <TableHead className="text-[#9C9C9D]">Billing Status</TableHead>
              <TableHead className="text-[#9C9C9D]">Admission Status</TableHead>
              <TableHead className="text-right text-[#9C9C9D]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vitals.map((vital, index) => {
              const createdDate = new Date(vital.created_at);
              const date = format(createdDate, "MMM dd, yyyy");
              const time = format(createdDate, "HH:mm");

              return (
                <TableRow key={vital.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>
                    {vital.taken_by?.first_name} {vital.taken_by?.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getBillingStatusColor(vital.billing_status)}
                    >
                      {vital.billing_status
                        ? vital.billing_status.charAt(0).toUpperCase() +
                          vital.billing_status.slice(1)
                        : "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getAdmissionStatusColor(vital.is_admitted)}
                    >
                      {vital.is_admitted ? "Admitted" : "Not Admitted"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedVital(vital)}
                      className="gap-2 px-8 border-primary bg-transparent text-primary font-semibold"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
