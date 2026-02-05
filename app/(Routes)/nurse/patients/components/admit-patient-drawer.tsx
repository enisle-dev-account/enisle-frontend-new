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

export function AdmitPatientDrawer({
  open,
  onOpenChange,
  patient,
}: AdmitPatientDrawerProps) {
  const [selectedWardId, setSelectedWardId] = useState<string>("");
  const [selectedBedId, setSelectedBedId] = useState<number | null>(null);
  const [bedStatuses, setBedStatuses] = useState<BedStatus>({
    available: 0,
    occupied: 0,
    maintenance: 0,
  });
    const { showSuccess } = useSuccessModal();
  

  const queryClient = useQueryClient();
  const form = useForm(); // Declare the form variable

  // Fetch wards
  const { data: wards = [] } = useApiQuery<WardBedOccupancyData[]>(
    ["hospital", "wards"],
    "/hospital/wards/list/",
  );

  // Admit patient mutation
  const admitMutation = useCustomUrlApiMutation("POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onOpenChange(false);
      showSuccess("Patient Admitted Successfully")
      setSelectedWardId("");
      setSelectedBedId(null);
    },
  });

  // Get selected ward
  const selectedWard = useMemo(
    () => wards.find((w) => w.id === selectedWardId),
    [wards, selectedWardId],
  );

  // Get all beds from selected ward
  const availableBeds = useMemo(() => {
    if (!selectedWard) return [];
    return selectedWard.rooms.flatMap((room) =>
      room.beds.map((bed) => ({
        id: bed.id,
        name: bed.name,
        roomName: room.name,
        state: bed.state,
      })),
    );
  }, [selectedWard]);

  // Update bed statuses
  useEffect(() => {
    if (availableBeds.length > 0) {
      const statuses = availableBeds.reduce(
        (acc, bed) => {
          const bedState = bed.state.toLowerCase();
          if (bedState === "open") acc.available++;
          else if (bedState === "admitted") acc.occupied++;
          else if (bedState === "broken") acc.maintenance++;
          return acc;
        },
        { available: 0, occupied: 0, maintenance: 0 },
      );
      setBedStatuses(statuses);
    }
  }, [availableBeds]);

  const handleAdmit = async () => {
    if (!patient?.consultation_id || !selectedBedId) {
      return;
    }

    await admitMutation.mutateAsync({
      url: "/nurse/assign-bed/",
      method: "POST",
      data: {
        consultation: patient.consultation_id,
        bed: selectedBedId,
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
        className="min-w-[calc(50vw)] overflow-y-auto p-6"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Admit Patient</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-8">
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
                {(patient.priority === "high") && (
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
            {patient.encounter && (
              <div className="flex gap-3 pl-6">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-x-1.5">
                    <div className="text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-sm">Request Description</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Treatment and Medication
                  </p>
                  <p className="text-sm text-foreground mt-2">
                    {patient.encounter.recommendation ||
                      patient.encounter.impressions ||
                      "-"}
                  </p>
                </div>
              </div>
            )}

            {/* Doctor */}
            {patient.doctor && (
              <div className="flex gap-3 pl-6">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-x-1.5">
                    <div className="text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-sm">Doctor</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {patient.doctor.profile_picture ? (
                        <img
                          src={
                            patient.doctor.profile_picture || "/placeholder.svg"
                          }
                          alt={`${patient.doctor.first_name} ${patient.doctor.last_name}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      Dr. {patient.doctor.first_name} {patient.doctor.last_name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Ward and Bed Selection */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-6">
            {/* Ward Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Wards</h4>
                </div>
                <Select
                  value={selectedWardId}
                  onValueChange={setSelectedWardId}
                >
                  <SelectTrigger className="w-48 h-9">
                    <SelectValue placeholder="Select Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total Beds */}
              {selectedWard && (
                <div className="mb-4">
                  <p className="text-sm font-semibold">Total Beds</p>
                  <p className="text-lg font-bold">{availableBeds.length}</p>
                </div>
              )}
            </div>

            {/* Bed Grid */}
            {selectedWard && availableBeds.length > 0 && (
              <div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {availableBeds.map((bed) => {
                    const isOccupied = bed.state.toLowerCase() === "admitted";
                    const isMaintenance = bed.state.toLowerCase() === "broken";
                    const isSelected = selectedBedId === bed.id;

                    let bgColor = "bg-blue-100 hover:bg-blue-200";
                    if (isMaintenance)
                      bgColor = "bg-green-100 hover:bg-green-200";
                    if (isOccupied)
                      bgColor = "bg-gray-900 text-white hover:bg-gray-800";

                    return (
                      <button
                        key={bed.id}
                        onClick={() =>
                          !isOccupied &&
                          !isMaintenance &&
                          setSelectedBedId(bed.id)
                        }
                        disabled={isOccupied || isMaintenance}
                        className={`
                          w-full aspect-square rounded-lg flex flex-col items-center justify-center font-semibold text-sm
                          transition-colors cursor-pointer
                          ${isOccupied || isMaintenance ? "cursor-not-allowed opacity-50" : ""}
                          ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
                          ${bgColor}
                        `}
                      >
                        <span className="font-semibold text-sm">{`RM-${bed.roomName.split(" ")[1]}`}</span>
                        <span>{String(bed.name).padStart(2, "0")}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex gap-4 text-xs pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-100"></div>
                    <span>Free ({bedStatuses.available})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-100"></div>
                    <span>Broken ({bedStatuses.maintenance})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-900"></div>
                    <span>Not Ready ({bedStatuses.occupied})</span>
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
            disabled={admitMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdmit}
            disabled={!selectedBedId || admitMutation.isPending}
          >
            {admitMutation.isPending ? "Admitting..." : "Admit Patient"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AdmitPatientDrawer;
