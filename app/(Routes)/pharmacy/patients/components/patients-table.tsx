"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";
import { toBase64 } from "@/lib/utils";
import { shimmer } from "@/components/image-shimmer";
import { PharmacyPatient } from "@/types";


interface PatientsTableProps {
  patients: PharmacyPatient[];
  onViewPatient: (patient: PharmacyPatient) => void;
  status: string;
}

export function PatientsTable({ patients, onViewPatient, status }: PatientsTableProps) {
  const getStatusBadge = (consultationStatus: string) => {
    if (consultationStatus === "in_queue") {
      return (
        <Badge className="bg-[#FFF7E1] text-[#E58116] hover:bg-[#FFF7E1]">
          Not Present
        </Badge>
      );
    }
    return (
      <Badge className="bg-[#E1FFF1] text-[#00D261] hover:bg-[#E1FFF1]">
        Checked In
      </Badge>
    );
  };

  const getMedicineStatus = (medicines: Array<{ status: string }>) => {
    const allCompleted = medicines.every((m) => m.status?.toLowerCase() === "completed");
    if (allCompleted) {
      return <p className="text-[#2271FE]">Completed</p>;
    }
    return <p>Not Completed</p>;
  };

  const getBillingStatus = (billingStatus: string) => {
    return billingStatus.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const constructName = (patient: PharmacyPatient["consultation"]["patient"]) => {
    const parts = [patient.first_name, patient.middle_name, patient.surname].filter(Boolean);
    return parts.join(" ");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="text-sm font-medium text-muted-foreground border-b">
            {status === "in_queue" && <th className="px-6 py-4 text-left">Queue No. / Status</th>}
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Vitals</th>
            <th className="px-6 py-4 text-left">Gender</th>
            <th className="px-6 py-4 text-left">Billing Status</th>
            <th className="px-6 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <motion.tr
              key={patient.id}
              variants={rowVariants}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {status === "in_queue" && (
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${
                        patient.consultation.status === "in_queue"
                          ? "bg-[#E58116]"
                          : "bg-[#00D261]"
                      }`}
                    >
                      {patient.queue_number}
                    </div>
                    {getStatusBadge(patient.consultation.status)}
                  </div>
                </td>
              )}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {patient.consultation.patient.profile_picture_location ? (
                    <Image
                      src={patient.consultation.patient.profile_picture_location}
                      alt={constructName(patient.consultation.patient)}
                      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(40, 40))}`}
                      width={40}
                      height={40}
                      className="rounded-full h-10 w-10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {patient.consultation.patient.first_name[0]}
                        {patient.consultation.patient.surname[0]}
                      </span>
                    </div>
                  )}
                  <p className="font-medium">{constructName(patient.consultation.patient)}</p>
                </div>
              </td>
              <td className="px-6 py-4">{getMedicineStatus(patient.prescribed_medicines)}</td>
              <td className="px-6 py-4">
                {patient.is_vitals_taken ? (
                  <p className="text-[#2271FE] cursor-pointer hover:underline">Taken</p>
                ) : (
                  <p>Not Taken</p>
                )}
              </td>
              <td className="px-6 py-4">
                <p className="capitalize">{patient.consultation.patient.gender}</p>
              </td>
              <td className="px-6 py-4">
                <p className={patient.billing_status === "paid" ? "text-[#00D261]" : ""}>
                  {getBillingStatus(patient.billing_status)}
                </p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-primary font-bold h-8 px-4 text-sm hover:bg-primary/90"
                    onClick={() => onViewPatient(patient)}
                  >
                    View
                  </Button>
                  {patient.consultation.status === "in_queue" && (
                    <button className="border border-[#2271FE] p-1.5 rounded-lg hover:bg-[#2271FE]/10 transition-colors">
                      <X className="h-4 w-4 text-[#2271FE]" />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}