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
import type { MedicationPrescription } from "@/types";
import { MedicationCard } from "./medication-card";
import { getBillingStatusColor } from "@/lib/utils";
import EmptyList from "@/components/empty-list";

interface MedicationsTabViewProps {
  medications: MedicationPrescription[];
  isLoading: boolean;
  isConsultationView: boolean;
  onRefetch?: () => void;
}

export default function MedicationsTabView({
  medications,
  isLoading,
  isConsultationView,
  onRefetch,
}: MedicationsTabViewProps) {
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationPrescription | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If consultation view and only one medication, show card directly
  if (isConsultationView && medications.length === 1 && !selectedMedication) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold">Medications</h2>
        <MedicationCard medication={medications[0]} onRefetch={onRefetch} />
      </div>
    );
  }

  // If viewing a selected medication
  if (selectedMedication) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Medications</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedMedication(null)}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
        <MedicationCard
          medication={selectedMedication}
          onRefetch={onRefetch}
        />
      </div>
    );
  }

  // Empty state
  if (medications.length === 0) {
    return (
      <EmptyList
        title="No Medications"
        description="There are no medications prescribed for this patient."
      />
    );
  }

  // Table view for multiple medications
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Medications</h2>
      <div className="bg-white rounded-xl overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-[#9C9C9D]">No</TableHead>
              <TableHead className="text-[#9C9C9D]">Date</TableHead>
              <TableHead className="text-[#9C9C9D]">Time</TableHead>
              <TableHead className="text-[#9C9C9D]">Doctor</TableHead>
              <TableHead className="text-[#9C9C9D]">Medications</TableHead>
              <TableHead className="text-[#9C9C9D]">Billing Status</TableHead>
              <TableHead className="text-[#9C9C9D]">Status</TableHead>
              <TableHead className="text-right text-[#9C9C9D]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication, index) => {
              const createdDate = new Date(medication.created_at);
              const date = format(createdDate, "MMM dd, yyyy");
              const time = format(createdDate, "HH:mm");
              
              // Check if all medicines are completed
              const allCompleted = medication.prescribed_medicines.every(
                (med) => med.status?.toLowerCase() === "completed"
              );

              const medicineNames = medication.prescribed_medicines
                .slice(0, 2)
                .map((med) => med.medicine.title)
                .join(", ");

              return (
                <TableRow key={medication.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>
                    Dr. {medication.doctor.first_name}{" "}
                    {medication.doctor.last_name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {medicineNames}
                    {medication.prescribed_medicines.length > 2 && "..."}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getBillingStatusColor(
                        medication.billing_status
                      )}
                    >
                      {medication.billing_status || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        allCompleted
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }
                    >
                      {allCompleted ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMedication(medication)}
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