"use client";

import { User } from "lucide-react";
import type { WardBedData } from "@/types";

interface PatientDetailsPanelProps {
  bed: WardBedData;
}

export function PatientDetailsPanel({ bed }: PatientDetailsPanelProps) {
  const consultation = bed.patient_consultation;
  if (!consultation) return null;

  const patient = consultation.patient;
  const doctor = consultation.doctor;
  const nurse = consultation.nurse;

  return (
    <div className="space-y-6 overflow-y-auto h-full">
      <div>
        <h3 className="font-semibold text-lg mb-4">Patient</h3>

        {/* Patient Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">
              {patient.first_name} {patient.surname}
            </p>
            <p className="text-sm text-muted-foreground">
              {patient.age} years | {patient.gender}
            </p>
          </div>
        </div>

        {/* Patient ID */}
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Patient ID</p>
            <p className="font-medium">{patient.id}</p>
          </div>

          {/* Admission Date */}
          <div>
            <p className="text-muted-foreground">Admission Date</p>
            <p className="font-medium">
              {consultation.admission_date
                ? new Date(consultation.admission_date).toLocaleDateString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Assignment */}
      {doctor && (
        <div className="pt-4 border-t">
          <p className="text-muted-foreground text-sm mb-2">Assigned Dr.</p>
          <p className="font-medium">
            Dr. {doctor.first_name} {doctor.last_name}
          </p>
        </div>
      )}

      {/* Nurse Assignment */}
      {nurse && (
        <div className="pt-4 border-t">
          <p className="text-muted-foreground text-sm mb-2">Assigned Nurse</p>
          <p className="font-medium">
            {nurse.first_name} {nurse.last_name}
          </p>
        </div>
      )}
    </div>
  );
}
