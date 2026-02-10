"use client";

import { Fragment, useMemo } from "react";
import {
  DetailedConsultationResponsePatientVital,
  Encounter,
  LabTest,
  MedicationPrescription,
  Surgery,
  RadiologyStudy,
  DetailedPatientConsultationInfoResponse,
} from "@/types";

import { VitalDetailPage } from "./vitals/vital-details";
import { Skeleton } from "@/components/ui/skeleton";
import { EncounterCard } from "./encounter-notes/encounter-card";
import { MedicationCard } from "./medication/medication-card";
import { SurgeryCard } from "./surgery/surgery-card";
import { RadiologyCard } from "./scans/scans-card";
import { LabCard } from "./lab/lab-card";

interface AllPatientInformationProps {
  data: DetailedPatientConsultationInfoResponse;
  isLoading: boolean;
  isConsultationView: boolean;
  currentUserId?: string;
  onRefetch: () => void;
  consultaionId:string |null
  onOpenPrescription?: () => void;
  onOpenInvestigation?: () => void;
  onOpenSurgical?: () => void;
}

type CombinedItem =
  | { type: "vital"; data: DetailedConsultationResponsePatientVital }
  | { type: "encounter"; data: Encounter }
  | { type: "lab"; data: LabTest }
  | { type: "medication"; data: MedicationPrescription }
  | { type: "surgery"; data: Surgery }
  | { type: "scan"; data: RadiologyStudy };

export default function AllPatientInformation({
  data,
  isLoading,
  isConsultationView,
  currentUserId,
  consultaionId,
  onRefetch,
  onOpenPrescription,
  onOpenInvestigation,
  onOpenSurgical,
}: AllPatientInformationProps) {
  const mergedAndSortedData = useMemo(() => {
    const items: CombinedItem[] = [];

    // Add all items with their type
    data.vitals?.forEach((vital) => items.push({ type: "vital", data: vital }));
    data.encounters?.forEach((encounter) =>
      items.push({ type: "encounter", data: encounter }),
    );
    data.labs?.forEach((lab) => items.push({ type: "lab", data: lab }));
    data.medications?.forEach((med) =>
      items.push({ type: "medication", data: med }),
    );
    data.surgeries?.forEach((surgery) =>
      items.push({ type: "surgery", data: surgery }),
    );
    data.scans?.forEach((scan) => items.push({ type: "scan", data: scan }));

    if(data.encounters.length===0 && isConsultationView) items.push({type:"encounter",data:{} as any})
    // Sort by created_at or updated_at (newest first)
    return items.sort((a, b) => {
      const getDate = (item: CombinedItem) => {
        const dateStr =
          (item.data as any).updated_at || (item.data as any).created_at;
        return new Date(dateStr).getTime();
      };
      return getDate(b) - getDate(a);
    });
  }, [data]);

  if (isLoading) {
    return (
      <div key={"uniquekey"} className="mt-4 pb-10 space-y-9">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
          >
            {/* Header Area */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />{" "}
                {/* Avatar/Icon */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />{" "}
              {/* Status Badge */}
            </div>

            <div className="space-y-3 pt-2">
              <Skeleton
                className={`h-4 w-[${Math.random() > 0.5 ? "90%" : "70%"}]`}
              />
              <Skeleton className="h-4 w-[85%]" />
              {i % 2 === 0 && <Skeleton className="h-4 w-[40%]" />}{" "}
            </div>

            {i % 3 === 0 && (
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                {[9, 6, 7, 8].map((v) => (
                  <div key={v} className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && mergedAndSortedData.length === 0) {
    return (
      <div className="mt-4 flex items-center justify-center h-50 bg-white rounded-2xl">
        <p className="text-lg">No data found</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pb-10 space-y-9">
      {mergedAndSortedData.map((item, index) => {
        switch (item.type) {
          case "vital":
            return (
              <Fragment key={`vital-${index}`}>
                {item.data.created_at && (item.data as any).taken_by && (
                
                    <VitalDetailPage
                    key={`vital-${index}`}
                      vital={
                        item.data as DetailedConsultationResponsePatientVital
                      }
                      onClose={onRefetch}
                    />
                )}
              </Fragment>
            );

          case "encounter":
            return (
              <EncounterCard
                key={`encounter-${index}`}
                encounter={item.data}
                consultationId={
                  isConsultationView
                    ? consultaionId|| ""
                    : ""
                }
                currentUserId={currentUserId}
                onRefetch={onRefetch}
                onOpenPrescription={onOpenPrescription}
                onOpenInvestigation={onOpenInvestigation}
                onOpenSurgical={onOpenSurgical}
                isConsultationView={isConsultationView}
              />
            );

          case "lab":
            return (
              <LabCard
                key={`lab-${item.data.id}`}
                lab={item.data}
                currentUserId={currentUserId}
                isConsultationView={isConsultationView}
              />
            );

          case "medication":
            return (
              <MedicationCard
                onOpenPrescription={onOpenPrescription}
                key={`medication-${item.data.id}`}
                onRefetch={onRefetch}
                medication={item.data}
                isConsultationView={isConsultationView}
              />
            );

          case "surgery":
            return (
              <SurgeryCard
                consultationId={
                  isConsultationView
                    ? (item.data as Surgery).consultation|| ""
                    : ""
                }
                currentUserId={currentUserId}
                onRefetch={onRefetch}
                key={`surgery-${item.data.id}`}
                surgery={item.data}
                isConsultationView={isConsultationView}
              />
            );

          case "scan":
            return (
              <RadiologyCard
                key={`scan-${item.data.id}`}
                radiology={item.data}
                isConsultationView={isConsultationView}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
