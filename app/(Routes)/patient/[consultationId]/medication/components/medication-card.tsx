"use client";

import { differenceInDays, format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { MedicationPrescription } from "@/types";
import { getInitials, getStatusColor } from "@/lib/utils";

interface MedicationCardProps {
  medication: MedicationPrescription;
  onOpenPrescription?: () => void;
  onRefetch?: () => void;
}

export function MedicationCard({
  medication,
  onOpenPrescription,
}: MedicationCardProps) {
  return (
    <Card className="border-b-2 border-b-purple-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={medication.doctor.profile_picture || ""}
                alt={`${medication.doctor.first_name} ${medication.doctor.last_name}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(
                  medication.doctor.first_name,
                  medication.doctor.last_name,
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-md">
                  {medication.doctor.first_name} {medication.doctor.last_name}
                </p>
                <span className="text-sm text-muted-foreground">|</span>
                <span className="text-sm text-purple-600">Medication</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(medication.status)} capitalize`}>
              {medication.status}
            </Badge>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="border-r pr-3">
                {format(new Date(medication.created_at), "MMM dd, yyyy")}
              </span>
              <span>{format(new Date(medication.created_at), "hh:mm a")}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onOpenPrescription}>
                  Prescribe Medication
                </DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        <h3 className="font-bold">Prescribed Medications</h3>
        <Separator />

        <div className="space-y-3">
          {medication.prescribed_medicines.map((med) => (
            <div key={med.id} className="border rounded-lg p-4">
              <div className="flex items-start  justify-between mb-7">
                <div>
                  <p className="font-semibold text-lg">{med.medicine.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {med.medicine.generic_name}
                  </p>
                </div>
                <Badge className={`${getStatusColor(med.status)} capitalize`}>
                  {med.status}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Quantity</span>{" "}
                  <span className=" text-primary text-lg font-bold">
                    {med.quantity}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Medicine Type:</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {med.medicine_type}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Dosage</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {med.dosage}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Frequency</span>{" "}
                  <span className=" text-primary  text-lg font-bold capitalize">
                    {med.frequency.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Medicine Type:</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {med.medicine_type}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Start Date:</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {format(new Date(med.start_date), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">End Date:</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {format(new Date(med.end_date), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Duration:</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {differenceInDays(
                      new Date(med.end_date),
                      new Date(med.start_date),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>

              {med.pharmacist_notes && (
                <div className="flex flex-col mt-8 gap-1">
                  <span className="text-muted-foreground"> Pharmarcist Note</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {med.pharmacist_notes}
                  </span>
                </div>
              )}
              {med.notes && (
                <div className="flex flex-col mt-8 gap-1">
                  <span className="text-muted-foreground">Note</span>{" "}
                  <span className=" text-primary text-lg font-bold capitalize">
                    {med.notes}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
