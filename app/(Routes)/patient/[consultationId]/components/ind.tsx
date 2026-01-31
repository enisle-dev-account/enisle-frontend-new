// "use client";

// import EmptyList from "@/components/empty-list";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import type {
//   DetailedConsultationResponsePatientVital,
//   Encounter,
//   LabTest,
//   MedicationPrescription,
//   Surgery,
//   RadiologyStudy,
// } from "@/types";
// import { VitalDetailPage } from "../vitals/components/vital-details";
// import { EncounterCard } from "../encounter-notes/components/encounter-card";
// import { LabCard } from "../lab/components/lab-card";
// import { MedicationCard } from "../medication/components/medication-card";
// import { SurgeryCard } from "../surgery/components/surgery-card";
// import { RadiologyCard } from "../radiology/components/radiology-card";

// // Vitals Tab
// interface VitalListProps {
//   vitals: DetailedConsultationResponsePatientVital[];
//   isLoading: boolean;
// }

// export function VitalList({ vitals, isLoading }: VitalListProps) {
//   if (isLoading) {
//     return (
//       <div className="mt-3 space-y-4">
//         {[...Array(2)].map((_, i) => (
//           <VitalCardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (vitals.length === 0) {
//     return (
//       <div className="mt-4">
//         <div className="border rounded-lg bg-white p-6">
//           <EmptyList
//             title="No Vitals"
//             description="No vital signs have been recorded for this consultation yet."
//           />
//         </div>
//       </div>
//     );
//   }

//   console.log(vitals, "we dey inside");
  

//   return (
//     <div className="mt-3 space-y-4">
//       {vitals.map((vital, index) => (
//         <VitalDetailPage
//           key={index}
//           vital={vital as DetailedConsultationResponsePatientVital}
//           onClose={() => {}}
//         />
//       ))}
//     </div>
//   );
// }

// // Encounter Tab
// interface EncounterListProps {
//   encounters: Encounter[];
//   isLoading: boolean;
//   currentUserId?: string;
//   onRefetch: () => void;
//   onEditEncounter?: () => void;
//   onOpenPrescription?: () => void;
//   onOpenInvestigation?: () => void;
//   onOpenSurgical?: () => void;
//   onAddEncounter?: () => void;
// }

// export function EncounterList({
//   encounters,
//   isLoading,
//   currentUserId,
//   onRefetch,
//   onEditEncounter,
//   onOpenPrescription,
//   onOpenInvestigation,
//   onOpenSurgical,
//   onAddEncounter,
// }: EncounterListProps) {
//   if (isLoading) {
//     return (
//       <div className="mt-3 space-y-4">
//         {[...Array(1)].map((_, i) => (
//           <EncounterCardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (encounters.length === 0) {
//     return (
//       <div className="mt-4">
//         <div className="border rounded-lg bg-white p-6">
//           <EmptyList
//             title="No Encounter Notes"
//             description="Create an encounter note to document the patient's visit, complaints, and medical history."
//           />
//           <div className="flex justify-center mt-6">
//             <Button onClick={onAddEncounter} className="rounded-full">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Encounter Note
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-3 space-y-4">
//       {encounters.map((encounter) => (
//         <EncounterCard
//           key={encounter.id}
//           encounter={encounter}
//           currentUserId={currentUserId}
//           onEdit={onEditEncounter}
//           onRefetch={onRefetch}
//           onOpenPrescription={onOpenPrescription}
//           onOpenInvestigation={onOpenInvestigation}
//           onOpenSurgical={onOpenSurgical}
//         />
//       ))}
//     </div>
//   );
// }

// // Labs Tab
// interface LabListProps {
//   labs: LabTest[];
//   isLoading: boolean;
//   currentUserId?: string;
// }

// export function LabList({ labs, isLoading, currentUserId }: LabListProps) {
//   if (isLoading) {
//     return (
//       <div className="mt-3 space-y-4">
//         {[...Array(2)].map((_, i) => (
//           <LabCardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (labs.length === 0) {
//     return (
//       <div className="mt-4">
//         <div className="border rounded-lg bg-white p-6">
//           <EmptyList
//             title="No Lab Results"
//             description="No laboratory tests have been requested or completed for this consultation."
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-3 space-y-4">
//       {labs.map((lab) => (
//         <LabCard key={lab.id} lab={lab} currentUserId={currentUserId} />
//       ))}
//     </div>
//   );
// }

// // Medications Tab
// interface MedicationListProps {
//   medications: MedicationPrescription[];
//   isLoading: boolean;
// }

// export function MedicationList({
//   medications,
//   isLoading,
// }: MedicationListProps) {
//   if (isLoading) {
//     return (
//       <div className="mt-3 space-y-4">
//         {[...Array(2)].map((_, i) => (
//           <MedicationCardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (medications.length === 0) {
//     return (
//       <div className="mt-4">
//         <div className="border rounded-lg bg-white p-6">
//           <EmptyList
//             title="No Medications"
//             description="No medications have been prescribed for this consultation."
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-3 space-y-4">
//       {medications.map((medication) => (
//         <MedicationCard key={medication.id} medication={medication} />
//       ))}
//     </div>
//   );
// }

// // Surgery Tab
// interface SurgeryListProps {
//   surgeries: Surgery[];
//   isLoading: boolean;
// }

// export function SurgeryList({ surgeries, isLoading }: SurgeryListProps) {
//   if (isLoading) {
//     return (
//       <div className="mt-3 space-y-4">
//         {[...Array(2)].map((_, i) => (
//           <SurgeryCardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (surgeries.length === 0) {
//     return (
//       <div className="mt-4">
//         <div className="border rounded-lg bg-white p-6">
//           <EmptyList
//             title="No Surgeries"
//             description="No surgical procedures have been requested for this consultation."
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-3 space-y-4">
//       {surgeries.map((surgery) => (
//         <SurgeryCard key={surgery.id} surgery={surgery} />
//       ))}
//     </div>
//   );
// }

// // Radiology/Scan Tab
// interface ScanListProps {
//   scans: RadiologyStudy[];
//   isLoading: boolean;
// }

// export function ScanList({ scans, isLoading }: ScanListProps) {
//   if (isLoading) {
//     return (
//       <div className="mt-3 space-y-4">
//         {[...Array(2)].map((_, i) => (
//           <RadiologyCardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (scans.length === 0) {
//     return (
//       <div className="mt-4">
//         <div className="border rounded-lg bg-white p-6">
//           <EmptyList
//             title="No Scans"
//             description="No radiology studies have been requested for this consultation."
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-3 space-y-4">
//       {scans.map((scan) => (
//         <RadiologyCard key={scan.id} radiology={scan} />
//       ))}
//     </div>
//   );
// }


import React from 'react'

export default function tabs() {
  return (
    <div>tabs</div>
  )
}

