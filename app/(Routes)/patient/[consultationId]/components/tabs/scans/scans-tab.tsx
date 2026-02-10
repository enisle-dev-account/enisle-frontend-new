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
import type { RadiologyStudy } from "@/types";
import { RadiologyCard } from "./scans-card";
import { getBillingStatusColor, getStatusColor } from "@/lib/utils";
import EmptyList from "@/components/empty-list";

interface ScansTabViewProps {
  scans: RadiologyStudy[];
  isLoading: boolean;
  isConsultationView: boolean;
}

export default function ScansTabView({
  scans,
  isLoading,
  isConsultationView,
}: ScansTabViewProps) {
  const [selectedScan, setSelectedScan] = useState<RadiologyStudy | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If consultation view and only one scan, show card directly
  if (isConsultationView && scans.length === 1 && !selectedScan) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold">Radiology Studies</h2>
        <RadiologyCard radiology={scans[0]} />
      </div>
    );
  }

  // If viewing a selected scan
  if (selectedScan) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Radiology Studies</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedScan(null)}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
        <RadiologyCard radiology={selectedScan} />
      </div>
    );
  }

  // Empty state
  if (scans.length === 0) {
    return (
      <EmptyList
        title="No Scans"
        description="There are no radiology studies recorded for this patient."
      />
    );
  }

  // Table view for multiple scans
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Radiology Studies</h2>
      <div className="bg-white rounded-xl overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-[#9C9C9D]">No</TableHead>
              <TableHead className="text-[#9C9C9D]">Date</TableHead>
              <TableHead className="text-[#9C9C9D]">Time</TableHead>
              <TableHead className="text-[#9C9C9D]">Doctor</TableHead>
              <TableHead className="text-[#9C9C9D]">Study Type</TableHead>
              <TableHead className="text-[#9C9C9D]">Billing Status</TableHead>
              <TableHead className="text-[#9C9C9D]">Status</TableHead>
              <TableHead className="text-right text-[#9C9C9D]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scans.map((scan, index) => {
              const createdDate = new Date(scan.created_at);
              const date = format(createdDate, "MMM dd, yyyy");
              const time = format(createdDate, "HH:mm");
              const isPending = scan.status === "pending";
              const hasResults = scan.results && scan.results.length > 0;

              return (
                <TableRow key={scan.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>
                    Dr. {scan.doctor.first_name} {scan.doctor.last_name}
                  </TableCell>
                  <TableCell>{scan.study_type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getBillingStatusColor(scan.billing_status)}
                    >
                      {scan.billing_status || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(scan.status)}
                    >
                      {scan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedScan(scan)}
                      disabled={isPending || !hasResults}
                      className="gap-2 px-8 border-primary bg-transparent text-primary font-semibold disabled:opacity-50"
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
