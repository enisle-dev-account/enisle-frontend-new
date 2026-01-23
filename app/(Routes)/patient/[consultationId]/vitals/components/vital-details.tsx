"use client";

import { Icon, IconName } from "@/components/icon";
import { Card } from "@/components/ui/card";
import type { DetailedConsultationResponsePatientVital } from "@/types";

interface VitalDetailModalProps {
  vital: DetailedConsultationResponsePatientVital;
  onClose: () => void;
}

export function VitalDetailPage({ vital, onClose }: VitalDetailModalProps) {
  const createdDate = new Date(vital.created_at);

  return (
    <div>
      <div className="space-y-6">
        {/* Vital Info */}
        <div className="space-y-4">
          <div className="grid  md:grid-cols-4 gap-x-5 gap-y-6">
            {Object.entries(vital.vital_info || {}).map(([key, value]) => {

                let iconName = ""
                switch (key) {
                    case "blood_pressure":
                        iconName = "blood-pressure"
                        break;
                    case "systolic_bp":
                        iconName = "blood-pressure"
                        break;
                    case "diastolic_bp":
                        iconName = "blood-pressure"
                        break;
                    case "pulse":
                        iconName = "heart-rate"
                        break;
                    case "pulse_rhythm":
                        iconName = "heart-rate"
                        break;
                    case "respiration":
                        iconName = "breathing"
                        break;
                    case "respiratory_pattern":
                        iconName = "breathing"
                        break;
                    case "temperature":
                        iconName = "temperature"
                        break;
                    case "temperature_method":
                        iconName = "temperature"
                        break;
                    case "spo2":
                        iconName = "spo2"
                        break;
                    case "fi02":
                        iconName = "spo2"
                        break;
                    case "height":
                        iconName = "height"
                        break;
                    case "weight":
                        iconName = "weight-scale"
                        break;
                    case "bmi":
                        iconName = "bmi"
                        break;
                    case "cuff_location":
                        iconName = "bp-monitor"
                        break;
                    case "cuff_size":
                        iconName = "bp-monitor"
                        break;
                    default:
                        iconName = "patient-details"
                        break;
                }
                
            return    (
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
                  </p>
                </div>
                <div>
                    <Icon name={iconName as IconName} size={50} className="fill-none" />
                </div>
              </Card>
            )})}
          </div>
        </div>

        {/* Other Notes */}
        {vital.other_notes && (
          <div className="space-y-2">
            <h3 className="font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">{vital.other_notes}</p>
          </div>
        )}

        {/* Status and Timestamps */}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium capitalize">{vital.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated:</span>
            {/* <span className="font-medium">
                {format(new Date(vital.updated_at), "PPp")}
              </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
