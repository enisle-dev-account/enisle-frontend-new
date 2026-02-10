"use client";

import type { LaboratoryRequestPatient } from "@/types/laboratory";
import { Button } from "@/components/ui/button";

interface PatientsTableProps {
  data: LaboratoryRequestPatient[];
  onPatientClick: (patientId: number) => void;
}

export function PatientsTable({ data, onPatientClick }: PatientsTableProps) {
  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="text-sm font-medium text-muted-foreground border-b">
            <th className="px-6 py-4 text-left">No</th>
            <th className="px-6 py-4 text-left">Hospital Number</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Gender</th>
            <th className="px-6 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((patient, index) => (
            <tr
              key={patient.id}
              className="border-b transition-colors hover:bg-muted/50"
            >
              <td className="px-6 py-4">
                <p className="font-medium">{String(index + 1).padStart(3, "0")}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium">{patient.id}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium">
                  {patient.first_name} {patient.surname}
                </p>
              </td>
              <td className="px-6 py-4">
                <p className="capitalize">{patient.gender}</p>
              </td>
              <td className="px-6 py-4">
                <Button
                  onClick={() => onPatientClick(patient.id)}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 h-9"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}