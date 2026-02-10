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
import type { CreatorInfo, Surgery } from "@/types";
import { SurgeryCard } from "./surgery-card";
import { getBillingStatusColor, getStatusColor } from "@/lib/utils";
import EmptyList from "@/components/empty-list";

interface SurgeriesTabViewProps {
  surgeries: Surgery[];
  isLoading: boolean;
  isConsultationView: boolean;
  consultationId: string | null;
  currentUserId?: string;
  onRefetch?: () => void;
}

export default function SurgeriesTabView({
  surgeries,
  isLoading,
  isConsultationView,
  consultationId,
  currentUserId,
  onRefetch,
}: SurgeriesTabViewProps) {
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If consultation view and only one surgery, show card directly
  if (isConsultationView && surgeries.length === 1 && !selectedSurgery) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold">Surgery Details</h2>
        <SurgeryCard
          surgery={surgeries[0]}
          consultationId={consultationId || ""}
          currentUserId={currentUserId}
          onRefetch={onRefetch}
        />
      </div>
    );
  }

  // If viewing a selected surgery
  if (selectedSurgery) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Surgery Details</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedSurgery(null)}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
        <SurgeryCard
          surgery={selectedSurgery}
          consultationId={consultationId || ""}
          currentUserId={currentUserId}
          onRefetch={onRefetch}
        />
      </div>
    );
  }

  // Empty state
  if (surgeries.length === 0) {
    return (
      <EmptyList
        title="No Surgeries"
        description="There are no surgeries recorded for this patient."
      />
    );
  }

  // Table view for multiple surgeries
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Surgery Details</h2>
      <div className="bg-white rounded-xl overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-[#9C9C9D]">No</TableHead>
              <TableHead className="text-[#9C9C9D]">Date</TableHead>
              <TableHead className="text-[#9C9C9D]">Time</TableHead>
              <TableHead className="text-[#9C9C9D]">Doctor</TableHead>
              <TableHead className="text-[#9C9C9D]">Procedure</TableHead>
              <TableHead className="text-[#9C9C9D]">Billing Status</TableHead>
              <TableHead className="text-[#9C9C9D]">Status</TableHead>
              <TableHead className="text-right text-[#9C9C9D]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surgeries.map((surgery, index) => {
              const createdDate = new Date(surgery.created_at);
              const date = format(createdDate, "MMM dd, yyyy");
              const time = format(createdDate, "HH:mm");
              const hasProcedure = surgery.procedure && surgery.procedure.trim().length > 0;

              return (
                <TableRow key={surgery.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{time}</TableCell>
                  <TableCell>
                    Dr. {(surgery.doctor as CreatorInfo)?.first_name} {(surgery.doctor as CreatorInfo)?.last_name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {surgery.procedure || "Not specified"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getBillingStatusColor(surgery.billing_status)}
                    >
                      {surgery.billing_status || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        hasProcedure
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }
                    >
                      {hasProcedure ? "Added" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSurgery(surgery)}
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