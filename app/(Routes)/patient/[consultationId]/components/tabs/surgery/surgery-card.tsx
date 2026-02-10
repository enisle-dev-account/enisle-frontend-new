"use client";

import React from "react";
import { format } from "date-fns";
import { MoreVertical, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreatorInfo, Surgery, User } from "@/types";
import { SurgeryForm } from "./surgery-form";
import { getInitials, getStatusColor } from "@/lib/utils";
import Image from "next/image";
import SurgeryEmptyStateImage from "@/lib/assets/images/steth.png";
import { Badge } from "@/components/ui/badge";

interface SurgeryCardProps {
  surgery?: Surgery;
  currentUserId?: string;
  consultationId: string;
  isConsultationView?: boolean;

  onRefetch?: () => void;
}

export function SurgeryCard({
  surgery,
  consultationId,
  currentUserId,
  onRefetch,
}: SurgeryCardProps) {
  const [showForm, setShowForm] = React.useState(false);

  const handleFormSuccess = () => {
    setShowForm(false);
    onRefetch?.();
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const hasSurgeryData =
    surgery && surgery.procedure && surgery.procedure.trim().length > 0;

  if (!hasSurgeryData && !showForm) {
    return <EmptySurgeryState onAdd={() => setShowForm(true)} />;
  }

  if (showForm) {
    return (
      <SurgeryForm
        consultationId={consultationId}
        surgery={surgery}
        onSuccess={handleFormSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <Card className="border-b-2 border-b-[#04DA00] mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={surgery?.doctor ? "" : ""} alt="Doctor" />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {surgery?.doctor
                  ? getInitials(
                      (surgery?.doctor as CreatorInfo).first_name,
                      (surgery?.doctor as CreatorInfo).last_name,
                    )
                  : "DR"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-md">
                  {surgery?.doctor
                    ? `${(surgery?.doctor as CreatorInfo).first_name} ${(surgery?.doctor as CreatorInfo).last_name}`
                    : "Doctor"}
                </p>
                <span className="text-sm text-muted-foreground">
                  {surgery?.status === "completed"
                    ? "submitted"
                    : "si submitting"}
                </span>
                <span className="text-sm text-[#04DA00]">Surgery Details</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge
              className={`${getStatusColor(surgery?.status || "pending")} capitalize`}
            >
              {surgery?.status || "pending"}
            </Badge>
            {surgery?.created_at && (
              <div className="flex gap-8">
                <div className="text-sm">
                  <p>
                    <span className="pr-2 mr-2 border-r">
                      {format(new Date(surgery.created_at), "MMM dd, yyyy")}
                    </span>
                    <span>
                      {format(new Date(surgery.created_at), "hh:mm a")}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {currentUserId === (surgery?.doctor as CreatorInfo).id &&
              surgery?.status !== "completed" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuItem onClick={() => setShowForm(true)}>
                      Edit Surgery Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        <h3 className="font-bold">Sugery Results</h3>

        <Separator />

        <div className="space-y-4">
          {surgery?.surgery_date && (
            <div className="flex gap-8">
              <div className="text-sm">
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Date and Time For Surgery
                </p>
                <p>
                  <span className="pr-2 mr-2 border-r">
                    {format(new Date(surgery.surgery_date), "MMM dd, yyyy")}
                  </span>
                  <span>
                    {format(new Date(surgery.surgery_date), "hh:mm a")}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            {surgery?.procedure && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Procedure name
                </p>
                <p className="text-sm">{surgery.procedure}</p>
              </div>
            )}

            {surgery?.cpt_code && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  CPT/ICD-10 codes
                </p>
                <p className="text-sm">{surgery.cpt_code}</p>
              </div>
            )}

            {surgery?.operative_site && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Operative site
                </p>
                <p className="text-sm">{surgery.operative_site}</p>
              </div>
            )}

            {surgery?.anesthesia_type && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Anesthesia type
                </p>
                <p className="text-sm">{surgery.anesthesia_type}</p>
              </div>
            )}
          </div>

          {surgery?.description && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Procedure description
              </p>
              <p className="text-sm">{surgery.description}</p>
            </div>
          )}

          {surgery?.recovery_notes && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Recovery note
              </p>
              <p className="text-sm">{surgery.recovery_notes}</p>
            </div>
          )}

          {surgery?.additional_fields &&
            Object.entries(surgery.additional_fields).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm font-semibold text-muted-foreground mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-sm">{String(value)}</p>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptySurgeryState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="border-b-2 border-b-[#E58116]">
      <CardHeader>
        <div className="flex items-center justify-between border-b pb-5 mb-6">
          <h3 className="font-bold">Surgery Details</h3>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-9">
        <div className="w-64 h-48 mb-6 flex items-center justify-center">
          <Image
            src={SurgeryEmptyStateImage}
            width={300}
            alt="empty"
            height={300}
            className="object-cover w-48 h-48"
          />
        </div>
        <p className="text-muted-foreground mb-4 text-center">
          No surgery details have been recorded yet.
        </p>
        <p className="font-medium mb-6">
          Add surgery details for this patient!
        </p>
        <Button
          onClick={onAdd}
          className="border bg-background text-primary hover:bg-background hover:text-black border-primary rounded-full px-8"
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
}

export function SurgeryCardSkeleton() {
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
