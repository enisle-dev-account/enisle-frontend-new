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
import { getBillingStatusColor, getStatusColor } from "@/lib/utils";
import EmptyList from "@/components/empty-list";
import { DetailedConsultationResponsePatientEncounterLabs } from "@/types/laboratory";
import LabTestCard from "./lab-card";

interface LabsTabViewProps {
  labs: DetailedConsultationResponsePatientEncounterLabs[];
  isLoading: boolean;
  isConsultationView: boolean;
  currentUserId?: string;
}

export default function LabsTabView({
  labs,
  isLoading,
  isConsultationView,
  currentUserId,
}: LabsTabViewProps) {
  const [selectedLab, setSelectedLab] = useState<DetailedConsultationResponsePatientEncounterLabs | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Single lab in consultation view - show directly
  if (isConsultationView && labs.length === 1 && !selectedLab) {
    // Get history (other labs of same test type)
    const history = labs.filter(
      (lab) => lab.test === labs[0].test && lab.id !== labs[0].id
    );
    
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold">Lab Results</h2>
        <LabTestCard labTest={labs[0]} patientHistory={history} />
      </div>
    );
  }

  // Selected lab view
  if (selectedLab) {
    // Get patient history for this test type
    const history = labs.filter(
      (lab) => lab.test === selectedLab.test && lab.id !== selectedLab.id
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Lab Results</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedLab(null)}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
        <LabTestCard labTest={selectedLab} patientHistory={history} />
      </div>
    );
  }

  // Empty state
  if (labs.length === 0) {
    return (
      <EmptyList
        title="No Lab Results"
        description="There are no lab results recorded for this patient."
      />
    );
  }

  // Table view for multiple labs
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Lab Results</h2>
      <div className="bg-white rounded-xl overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-[#9C9C9D]">No</TableHead>
              <TableHead className="text-[#9C9C9D]">Date</TableHead>
              <TableHead className="text-[#9C9C9D]">Time</TableHead>
              <TableHead className="text-[#9C9C9D]">Doctor</TableHead>
              <TableHead className="text-[#9C9C9D]">Request Type</TableHead>
              <TableHead className="text-[#9C9C9D]">Billing Status</TableHead>
              <TableHead className="text-[#9C9C9D]">Status</TableHead>
              <TableHead className="text-right text-[#9C9C9D]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labs.map((lab, index) => {
              const createdDate = new Date(lab.created_at);
              const date = format(createdDate, "MMM dd, yyyy");
              const time = format(createdDate, "HH:mm");
              const isPending = lab.status?.toLowerCase() === "pending";

              return (
                <TableRow key={lab.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>
                    Dr. {lab.doctor.first_name} {lab.doctor.last_name}
                  </TableCell>
                  <TableCell>
                    {lab.test || lab.investigation_request?.request_type}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getBillingStatusColor(lab.billing_status)}
                    >
                      {lab.billing_status || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(lab.status)}
                    >
                      {lab.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedLab(lab)}
                      disabled={isPending}
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