"use client";

import { useEffect, useState } from "react";
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
import type { Encounter } from "@/types";
import { EncounterCard } from "./encounter-card";
import { getBillingStatusColor, getAdmissionStatusColor } from "@/lib/utils";
import EmptyList from "@/components/empty-list";

interface EncounterNotesTabViewProps {
  encounters: Encounter[];
  isLoading: boolean;
  isConsultationView: boolean;
  consultationId: string | null;
  currentUserId?: string;
  onRefetch: () => void;
  onOpenPrescription?: () => void;
  onOpenInvestigation?: () => void;
  onOpenSurgical?: () => void;
}

export default function EncounterNotesTabView({
  encounters,
  isLoading,
  isConsultationView,
  consultationId,
  currentUserId,
  onRefetch,
  onOpenPrescription,
  onOpenInvestigation,
  onOpenSurgical,
}: EncounterNotesTabViewProps) {
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(
    null,
  );



  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If consultation view and only one encounter, show card directly
  if (isConsultationView && encounters.length === 1 && !selectedEncounter) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold">Encounter Notes</h2>
        <EncounterCard
          encounter={encounters[0]}
          consultationId={consultationId || ""}
          currentUserId={currentUserId}
          onRefetch={onRefetch}
          onOpenPrescription={onOpenPrescription}
          onOpenInvestigation={onOpenInvestigation}
          onOpenSurgical={onOpenSurgical}
        />
      </div>
    );
  }

  if (selectedEncounter) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Encounter Notes</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedEncounter(null)}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
        <EncounterCard
          encounter={selectedEncounter}
          consultationId={consultationId || ""}
          currentUserId={currentUserId}
          onRefetch={onRefetch}
          onOpenPrescription={onOpenPrescription}
          onOpenInvestigation={onOpenInvestigation}
          onOpenSurgical={onOpenSurgical}
        />
      </div>
    );
  }

  // Empty state
  if (encounters.length === 0) {
    return (
      <EmptyList
        title="No Encounter Notes"
        description="There are no encounter notes recorded for this patient."
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Encounter Notes</h2>
      <div className="bg-white rounded-xl overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-[#9C9C9D]">No</TableHead>
              <TableHead className="text-[#9C9C9D]">Date</TableHead>
              <TableHead className="text-[#9C9C9D]">Time</TableHead>
              <TableHead className="text-[#9C9C9D]">Doctor</TableHead>
              <TableHead className="text-[#9C9C9D]">Main Complaints</TableHead>
              <TableHead className="text-[#9C9C9D]">Status</TableHead>
              <TableHead className="text-right text-[#9C9C9D]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {encounters.map((encounter, index) => {
              const createdDate = new Date(encounter.created_at);
              const date = format(createdDate, "MMM dd, yyyy");
              const time = format(createdDate, "HH:mm");
              const complaints = encounter.main_complaints
                ?.split(",")
                .slice(0, 2)
                .join(", ");

              return (
                <TableRow key={encounter.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>
                    Dr. {encounter.consultation.doctor.first_name}{" "}
                    {encounter.consultation.doctor.last_name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {complaints}
                    {encounter.main_complaints?.split(",").length > 2 && "..."}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getBillingStatusColor(encounter.status)}
                    >
                      {encounter.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedEncounter(encounter)}
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
