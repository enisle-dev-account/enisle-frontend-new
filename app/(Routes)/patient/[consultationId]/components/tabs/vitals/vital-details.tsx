"use client";

import { Icon, IconName } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import type { DetailedConsultationResponsePatientVital } from "@/types";
import { format } from "date-fns";

interface VitalDetailModalProps {
  vital: DetailedConsultationResponsePatientVital;
  onClose: () => void;
}

export function VitalDetailPage({ vital, onClose }: VitalDetailModalProps) {
  return (
    <div>
      <div className="space-y-6 bg-background border-b-2 border-primary rounded-xl p-6">
        {/* Vital Info */}
        <div className="space-y-4">
          {/* Status and Timestamps */}
          <div className=" flex justify-between text-sm">
            <div className="flex gap-x-4 items-center">
              <div className="flex items-center space-x-3">
                {/* Avatar (shadcn) */}
                <Avatar className="h-10 w-10">
                  {vital.taken_by?.profile_picture ? (
                    <AvatarImage
                      src={vital.taken_by.profile_picture}
                      alt={`${vital.taken_by.first_name} ${vital.taken_by.last_name}`}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(
                        vital.taken_by?.first_name ?? "",
                        vital.taken_by?.last_name ?? "",
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-md">
                      {vital.taken_by.first_name} {vital.taken_by.last_name}
                    </p>
                    <span className="text-sm text-muted-foreground">|</span>
                    <span className="text-sm text-primary">Nurse</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-muted-foreground">
              {/* time taken */}
              <span className="text-muted-foreground">Time Taken: </span>
              <span className="font-medium">
                {vital.created_at
                  ? format(
                      new Date(vital.created_at),
                      "MMM dd, yyyy   'at' hh:mm a",
                    )
                  : "Unknown"}
              </span>
            </div>
          </div>

          <p className="font-bold  text-sm border-b py-4 mb-4">Vitals</p>

          <div className="grid  md:grid-cols-4 gap-x-5 gap-y-6">
            {Object.entries(vital.vital_info || {}).map(([key, value]) => {
              let iconName = "";
              let unit = ""; 
              switch (key) {
                case "blood_pressure":
                  iconName = "blood-pressure";
                  unit = "mmHg";
                  break;
                case "systolic_bp":
                  iconName = "blood-pressure";
                  unit = "mmHg";
                  break;
                case "diastolic_bp":
                  iconName = "blood-pressure";
                  unit = "mmHg";
                  break;
                case "pulse":
                  iconName = "heart-rate";
                  unit = "bpm";
                  break;
                case "pulse_rhythm":
                  iconName = "heart-rate";
                  break;
                case "respiration":
                  iconName = "breathing";
                  break;
                case "respiratory_pattern":
                  iconName = "breathing";
                  break;
                case "temperature":
                  iconName = "temperature";
                  unit = "°C";
                  break;
                case "temperature_method":
                  iconName = "temperature";
                  break;
                case "spo2":
                  iconName = "spo2";
                  break;
                case "fi02":
                  iconName = "spo2";
                  break;
                case "height":
                  iconName = "height";
                    unit = "cm";
                  break;
                case "weight":
                  iconName = "weight-scale";
                  unit = "kg";
                  break;
                case "bmi":
                  iconName = "bmi";
                  unit = "kg/m";
                  break;
                case "cuff_location":
                  iconName = "bp-monitor";
                  break;
                case "cuff_size":
                  iconName = "bp-monitor";
                  break;
                default:
                  iconName = "patient-details";
                  break;
              }

              return (
                <Card
                  key={key}
                  className=" flex justify-between rounded-[0.625rem]  flex-row min-h-21.5 border-none ring-0 outline-none shadow-lg py-3 px-5.25"
                >
                  <div className="justify-between h-full flex flex-col">
                    <label className="font-bold  capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    <p className="font-semibold text-lg">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                        {unit && <span className="text-muted-foreground"> {unit}</span>}
                    </p>
                  </div>
                  <div>
                    <Icon
                      name={iconName as IconName}
                      size={50}
                      className="fill-none"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Other Notes */}
        {vital.other_notes && (
          <div className="space-y-2">
            <h3 className="font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">{vital.other_notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
