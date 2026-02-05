"use client";

import { Fragment, useMemo } from "react";
import type {
  DetailedConsultationResponsePatientVital,
  Encounter,
  LabTest,
  MedicationPrescription,
  Surgery,
  RadiologyStudy,
} from "@/types";
import { EncounterCard } from "../encounter-notes/components/encounter-card";
import { MedicationCard } from "../medication/components/medication-card";
import { LabCard } from "../lab/components/lab-card";
import { SurgeryCard } from "../surgery/components/surgery-card";
import { RadiologyCard } from "../radiology/components/radiology-card";
import { VitalDetailPage } from "../vitals/components/vital-details";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AllPatientInformationProps {
  vital?: DetailedConsultationResponsePatientVital;
  encounter?: Encounter;
  labs?: LabTest[];
  medications?: MedicationPrescription[];
  surgeries?: Surgery[];
  scans?: RadiologyStudy[];
  isLoading: boolean;
  consultationId: string;
  currentUserId?: string;
  onRefetch: () => void;
  onEditEncounter?: () => void;
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
  vital,
  encounter,
  labs = [],
  medications = [],
  surgeries = [],
  scans = [],
  isLoading,
  consultationId,
  currentUserId,
  onRefetch,
  onEditEncounter,
  onOpenPrescription,
  onOpenInvestigation,
  onOpenSurgical,
}: AllPatientInformationProps) {
  const mergedAndSortedData = useMemo(() => {
    const items: CombinedItem[] = [];

    if (vital) {
      items.push({ type: "vital", data: vital });
    }

    if (encounter) {
      items.push({ type: "encounter", data: encounter });
    }

    labs.forEach((lab) => items.push({ type: "lab", data: lab }));
    medications.forEach((med) => items.push({ type: "medication", data: med }));
    surgeries.forEach((surgery) =>
      items.push({ type: "surgery", data: surgery }),
    );
    scans.forEach((scan) => items.push({ type: "scan", data: scan }));

    return items.sort((a, b) => {
      const getDate = (item: CombinedItem) => {
        return new Date(item.data.created_at).getTime();
      };
      return getDate(b) - getDate(a);
    });
  }, [vital, encounter, labs, medications, surgeries, scans]);

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
                  <div
                    key={`vital-${index}`}
                    className="bg-background border-b-2 border-primary rounded-xl flex flex-col gap-5 p-6"
                  >
                    <p className="font-bold  ">Vitals</p>
                    <VitalDetailPage
                      vital={
                        item.data as DetailedConsultationResponsePatientVital
                      }
                      onClose={onRefetch}
                    />
                  </div>
                )}
              </Fragment>
            );

          case "encounter":
            return (
              <EncounterCard
                key={`encounter-${index}`}
                encounter={item.data}
                consultationId={consultationId}
                currentUserId={currentUserId}
                onRefetch={onRefetch}
                onOpenPrescription={onOpenPrescription}
                onOpenInvestigation={onOpenInvestigation}
                onOpenSurgical={onOpenSurgical}
              />
            );

          case "lab":
            return (
              <LabCard
                key={`lab-${item.data.id}`}
                lab={item.data}
                currentUserId={currentUserId}
              />
            );

          case "medication":
            return (
              <MedicationCard
                onOpenPrescription={onOpenPrescription}
                key={`medication-${item.data.id}`}
                onRefetch={onRefetch}
                medication={item.data}
              />
            );

          case "surgery":
            return (
              <SurgeryCard
                consultationId={consultationId}
                currentUserId={currentUserId}
                onRefetch={onRefetch}
                key={`surgery-${item.data.id}`}
                surgery={item.data}
              />
            );

          case "scan":
            return (
              <RadiologyCard
                key={`scan-${item.data.id}`}
                radiology={item.data}
                
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
