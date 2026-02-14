"use client";

import type { LaboratoryRequestPatient } from "@/types/laboratory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { FlaskConical } from "lucide-react";

interface EnhancedLaboratoryRequestPatient extends LaboratoryRequestPatient {
  pending_tests_count?: number;
  total_tests_count?: number;
  last_test_date?: string;
  has_pending_tests?: boolean;
}

interface PatientsTableProps {
  data: EnhancedLaboratoryRequestPatient[];
  onPatientClick: (patientId: number) => void;
}

export function PatientsTable({ data, onPatientClick }: PatientsTableProps) {
  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="text-sm font-medium text-muted-foreground border-b">
            <th className="px-6 py-4 text-left">No</th>
            <th className="px-6 py-4 text-left">Patient</th>
            <th className="px-6 py-4 text-left">Gender</th>
            <th className="px-6 py-4 text-left">Age</th>
            <th className="px-6 py-4 text-left">Tests</th>
            <th className="px-6 py-4 text-left">Last Test</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((patient, index) => {
            const fullName = `${patient.first_name} ${patient.middle_name ? patient.middle_name + " " : ""}${patient.surname}`;
            const initials = getInitials(patient.first_name, patient.surname);
            const hasPendingTests = patient.has_pending_tests ?? (patient.pending_tests_count ?? 0) > 0;

            return (
              <tr
                key={patient.id}
                className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                onClick={() => onPatientClick(patient.id)}
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={patient.profile_picture_location || undefined}
                        alt={fullName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground">#{patient.id}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="capitalize">{patient.gender}</p>
                </td>

                <td className="px-6 py-4">
                  <p>{patient.age ? `${patient.age} yrs` : "N/A"}</p>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <FlaskConical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {patient.total_tests_count ?? 0}
                      </span>
                    </div>
                    {(patient.pending_tests_count ?? 0) > 0 && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                        {patient.pending_tests_count} pending
                      </Badge>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {patient.last_test_date ? (
                    <p className="text-sm">
                      {format(new Date(patient.last_test_date), "MMM dd, yyyy")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tests yet</p>
                  )}
                </td>

                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={
                      hasPendingTests
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }
                  >
                    {hasPendingTests ? "Has Pending" : "All Complete"}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPatientClick(patient.id);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 h-9"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}