"use client";

import React from "react";
import { format } from "date-fns";
import { MoreVertical, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/providers/confirm-box-provider";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { useApiMutation } from "@/hooks/api";
import type { Encounter } from "@/types";
import { EncounterForm } from "./encounter-form";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import EcounterEmptyStateImage from "@/lib/assets/images/steth.png";
interface EncounterCardProps {
  encounter?: Encounter;
  currentUserId?: string;
  consultationId: string;
  onRefetch?: () => void;
  onOpenPrescription?: () => void;
  onOpenInvestigation?: () => void;
  onOpenSurgical?: () => void;
}

export function EncounterCard({
  encounter,
  currentUserId,
  consultationId,
  onRefetch,
  onOpenPrescription,
  onOpenInvestigation,
  onOpenSurgical,
}: EncounterCardProps) {
  const { confirm } = useConfirm();
  const { showSuccess } = useSuccessModal();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const deleteMutation = useApiMutation(
    "DELETE",
    `/doctor/encounter/${encounter?.id}/delete/`,
    {
      onSuccess: () => {
        showSuccess("Encounter deleted successfully");
        onRefetch?.();
      },
    },
  );

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Encounter?",
      message: "This action cannot be undone.",
      variant: "destructive",
    });
    if (confirmed) {
      deleteMutation.mutate({});
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    setShowForm(false);
    onRefetch?.();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowForm(false);
  };

  // Check if encounter has actual data (not just an empty object from backend)
  const hasEncounterData =
    encounter &&
    encounter.main_complaints &&
    encounter.main_complaints.trim().length > 0;

  const isOwnEncounter =
    encounter && currentUserId === encounter.consultation.doctor.id;

  // Show empty state if no encounter data and not in form mode
  if (!hasEncounterData && !showForm) {
    return <EmptyEncounterState onAdd={() => setShowForm(true)} />;
  }

  // Show form if editing or creating new
  if (showForm) {
    return (
      <EncounterForm
        consultationId={consultationId}
        encounter={isEditing && hasEncounterData ? encounter : undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleCancel}
      />
    );
  }

  // At this point, we know we have encounter data
  const complaints = encounter!.main_complaints.split(",").map((c) => c.trim());

  return (
    <Card className="border-b-2 border-b-[#E58116]">
      {encounter?.consultation.doctor.id && encounter.created_at && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={encounter.consultation.doctor.profile_picture || ""}
                  alt={`${encounter.consultation.doctor.first_name} ${encounter.consultation.doctor.last_name}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(
                    encounter.consultation.doctor.first_name,
                    encounter.consultation.doctor.last_name,
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-md">
                    Dr. {encounter.consultation.doctor.first_name}{" "}
                    {encounter.consultation.doctor.last_name}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    submitted
                  </span>
                  <span className="text-sm text-[#E58116]">
                    Encounter Notes
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="border-r pr-3">
                {format(new Date(encounter.created_at), "MMM dd, yyyy")}
              </span>
              <span>{format(new Date(encounter.created_at), "hh:mm a")}</span>
              {isOwnEncounter && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuItem onClick={handleEdit}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onOpenInvestigation}>
                      Request Investigation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onOpenPrescription}>
                      Prescribe Medication
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onOpenSurgical}>
                      Request Surgical Consultation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4 pb-6">
        <div>
          <h3 className="font-bold">Encounter Note</h3>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">
              Main Complaints
            </p>
            <div className="flex flex-wrap gap-2">
              {complaints.map((complaint, index) => (
                <span key={index} className="text-sm">
                  {complaint}
                  {index < complaints.length - 1 && (
                    <span className="mx-2 text-muted-foreground">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {encounter?.present_illness_history && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                History of Present Illness
              </p>
              <p className="text-sm">{encounter.present_illness_history}</p>
            </div>
          )}

          {encounter?.past_medical_history && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Past Medical History
              </p>
              <p className="text-sm">{encounter.past_medical_history}</p>
            </div>
          )}

          {encounter?.previous_operations && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Previous Operations
              </p>
              <p className="text-sm">{encounter.previous_operations}</p>
            </div>
          )}

          {encounter?.received_medication && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Received Medicines
              </p>
              <p className="text-sm">{encounter.received_medication}</p>
            </div>
          )}

          {encounter?.impressions && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Impressions
              </p>
              <p className="text-sm">{encounter.impressions}</p>
            </div>
          )}

          {encounter?.recommendation && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Recommendations
              </p>
              <p className="text-sm">{encounter.recommendation}</p>
            </div>
          )}

          {encounter?.additional_notes &&
            Object.keys(encounter.additional_notes).length > 0 && (
              <>
                {Object.entries(encounter.additional_notes).map(
                  ([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-semibold text-muted-foreground mb-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm">{String(value)}</p>
                    </div>
                  ),
                )}
              </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
export function EmptyEncounterState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="border-b-2 border-b-[#E58116]">
      <CardHeader>
        <div className="flex items-center justify-between  border-b  pb-5  mb-6">
          <h3 className="font-bold   ">Encounter Notes</h3>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-9">
        <div className="w-64 h-48 mb-6 flex items-center justify-center">
          <Image
            src={EcounterEmptyStateImage}
            width={300}
            alt="empty"
            height={300}
            className="object-cover w-48 h-48"
          />
        </div>
        <p className="text-muted-foreground mb-4 text-center">
          Please proceed to a normal conversation with the patients.
        </p>
        <p className="font-medium mb-6">This is a normal text encounter!</p>
        <Button
          onClick={onAdd}
          className="border bg-background text-primary hover:bg-background hover:text-black border-primary  rounded-full px-8"
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
}

export function EncounterCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Separator />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
