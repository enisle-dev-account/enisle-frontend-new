"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoveLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import type { DetailedConsultationResponsePatientVital } from "@/types";
import { VitalDetailPage } from "./vital-details";
import { Badge } from "@/components/ui/badge";
import { getAdmissionStatusColor, getBillingStatusColor } from "@/lib/utils";
import EmptyList from "@/components/empty-list";

interface VitalsListViewProps {
  consultationId: string;
}

export function VitalsListView({ consultationId }: VitalsListViewProps) {
  const router = useRouter();
  const [selectedVital, setSelectedVital] =
    useState<DetailedConsultationResponsePatientVital | null>(null);

  const { data: vitalsData, isLoading } = useApiQuery<
    DetailedConsultationResponsePatientVital[]
  >(
    ["vitals", consultationId],
    `/patient/${consultationId}/vitals/from-consultation/`,
  );

  if (isLoading) {
    return (
      <div className="space-y-4 px-10">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const vitals = vitalsData || [];

  return (
    <div className="space-y-6 px-10">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Vitals</h2>
        {selectedVital &&(<Button onClick={() => setSelectedVital(null)}>
            <MoveLeft />
        </Button>)}
      </div>

      { !selectedVital && (<>
      {vitals.length === 0 ? (
        <EmptyList title="No Vitals Yet" description="There are no recorded vitals for this consultation." />
      ) : (
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-[#9C9C9D]">No</TableHead>
                <TableHead className="text-[#9C9C9D]">Date</TableHead>
                <TableHead className="text-[#9C9C9D]">Time</TableHead>
                <TableHead className="text-[#9C9C9D]">Billing Status</TableHead>
                <TableHead className="text-[#9C9C9D]">
                  Admission Status
                </TableHead>
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
                  <TableRow key={vital.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{time}</TableCell>
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
      )}
      </>)}
      {selectedVital && (
        <VitalDetailPage
          vital={selectedVital}
          onClose={() => setSelectedVital(null)}
        />
      )}
    </div>
  );
}
