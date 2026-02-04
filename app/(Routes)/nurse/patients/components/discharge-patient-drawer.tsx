"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useApiQuery, useCustomUrlApiMutation } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Bed, User, FileText, Pill } from "lucide-react";
import type { DoctorPatientsData, WardBedOccupancyData } from "@/types";
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import { useSuccessModal } from "@/providers/success-modal-provider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AdmitPatientDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: DoctorPatientsData | null;
}

interface BedStatus {
  available: number;
  occupied: number;
  maintenance: number;
}

export function DischargePatientDrawer({
  open,
  onOpenChange,
  patient,
}: AdmitPatientDrawerProps) {
  const { showSuccess } = useSuccessModal();

  const queryClient = useQueryClient();
  const form = useForm(); // Declare the form variable


  // Discharge patient mutation
  const dischargeMutation = useCustomUrlApiMutation("POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onOpenChange(false);
      showSuccess("Patient Discharged Successfully");
    },
  });



  const handleDischarge = async () => {
    if (!patient?.consultation_id) {
      return;
    }

    await dischargeMutation.mutateAsync({
      url: "/nurse/discharge-patient/",
      method: "POST",
      data: {
        consultation: patient.consultation_id,
      },
    });
  };

  if (!patient) return null;

  const patientName =
    `${patient.first_name} ${patient.middle_name || ""} ${patient.surname}`.trim();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="min-w-[calc(30vw)] overflow-y-auto p-6"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            Discharge Patient
          </SheetTitle>
        </SheetHeader>

        <div className=" gap-8">
          {/* Left Column - Patient Details */}
          <div className="space-y-6">
            <div className=" space-y-6  p-6 border rounded-lg">
              {/* Patient Card */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="relative shrink-0">
                  {patient.profile_picture_location ? (
                    <img
                      src={
                        patient.profile_picture_location || "/placeholder.svg"
                      }
                      alt={`${patient.first_name} ${patient.surname}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-border overflow-hidden"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-white">
                      {patient.first_name.charAt(0)}
                      {patient.surname.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{patientName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {patient.gender} • {patient.age} years old
                  </p>
                </div>
                {patient.priority === "high" && (
                  <div className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                    {patient.priority}
                  </div>
                )}
              </div>
              {/* Admission Date */}
              <div className="flex gap-3">
                <div className="space-y-2">
                  <div className="flex gap-x-1.5">
                    <div className="text-primary">
                      <FileText className="w-5 h-5" />
                    </div>

                    <p className="font-semibold text-sm">Admission Date</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {patient.created_at
                      ? new Date(patient.created_at).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "-"}{" "}
                    •{" "}
                    {new Date(patient.created_at || "").toLocaleTimeString(
                      "en-US",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                </div>
              </div>

              {/* Issue */}
              {patient.encounter?.main_complaints && (
                <div className="flex gap-3">
                  <div className="space-y-2">
                    <div className="flex gap-x-1.5">
                      <div className="text-primary">
                        <AlertCircle className="w-5 h-5" />
                      </div>

                      <p className="font-semibold text-sm">Issue</p>
                    </div>
                    <p className="text-sm text-foreground">
                      {patient.encounter.main_complaints}
                    </p>
                  </div>
                </div>
              )}

              {/* Symptoms */}
              {patient.encounter?.present_illness_history && (
                <div className="flex gap-3">
                  <div className="space-y-2">
                    <div className="flex gap-x-1.5">
                      <div className="text-primary">
                        <Pill className="w-5 h-5" />
                      </div>

                      <p className="font-semibold text-sm">Symptoms</p>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">
                      {patient.encounter.present_illness_history}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Request Description */}
            {patient.fees && (
              <div className="flex gap-3 pl-6">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-x-1.5">
                    <div className="text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-sm">Fees</p>
                  </div>
                  <div className="flex flex-wrap gap-3.75">
                    {patient.fees.map((fee, index) => (
                      <Badge className="text-sm items-center" key={index} variant={"outline"}>
                        <span>{fee.name}</span>
                        {" - "}
                        <span
                          className={cn("text-green-700", {
                            "text-amber-500": fee.billing_status === "pending",
                          })}
                        >
                          {fee.billing_status}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Care team */}
            {(patient.doctor || patient.doctor) && (
              <div className="flex gap-3 pl-6">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-x-1.5">
                    <div className="text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-sm">Care Team</p>
                  </div>
                  <div className="flex gap-x-10">
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {patient.doctor.profile_picture ? (
                          <img
                            src={
                              patient.doctor.profile_picture ||
                              "/placeholder.svg"
                            }
                            alt={`${patient.doctor.first_name} ${patient.doctor.last_name}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm font-medium">
                        Dr. {patient.doctor.first_name}{" "}
                        {patient.doctor.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {patient.nurse.profile_picture ? (
                          <img
                            src={
                              patient.nurse.profile_picture ||
                              "/placeholder.svg"
                            }
                            alt={`${patient.nurse.first_name} ${patient.nurse.last_name}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm font-medium">
                        {patient.nurse.first_name}{" "}
                        {patient.nurse.last_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={dischargeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDischarge}
            disabled={dischargeMutation.isPending}
          >
            {dischargeMutation.isPending ? "Discharging..." : "Discharge Patient"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DischargePatientDrawer;
