"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DoctorPatientData } from "@/types";

interface DoctorPatientsTableProps {
  patients: DoctorPatientData[];
}

export function DoctorPatientsTable({ patients }: DoctorPatientsTableProps) {
  const router = useRouter();

  const getBillingBadge = (status: string) => {
    const isPending = status.toLowerCase() === "pending";
    return (
      <span className="text-sm font-medium text-slate-700">
        {isPending ? "Pending Payment" : "Paid"}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "admitted":
        return (
          <Badge className="bg-emerald-50 text-emerald-500 hover:bg-emerald-100 border-none shadow-none font-normal">
            Admitted
          </Badge>
        );
      case "in_queue":
        return (
          <Badge className="bg-amber-50 text-amber-500 hover:bg-amber-100 border-none shadow-none font-normal">
            In Queue
          </Badge>
        );
      case "discharged":
        return (
          <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none shadow-none font-normal">
            Discharged
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-50 text-blue-500 hover:bg-blue-100 border-none shadow-none font-normal">
            {status.replace("_", " ")}
          </Badge>
        );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full bg-white rounded-xl"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className=" font-medium">Patient ID</TableHead>
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className=" font-medium">Admission Date</TableHead>
            <TableHead className=" font-medium">Gender</TableHead>
            <TableHead className=" font-medium">Billing Status</TableHead>
            <TableHead className="  font-medium">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="group border-none hover:bg-slate-50/50 cursor-pointer transition-colors"
              onClick={() => router.push(`/doctor/patients/${patient.id}`)}
            >
              <TableCell className="py-4 font-medium text-slate-600">
                {patient.mrn?.split("-").pop() ||
                  patient.id.toString().padStart(3, "0")}
              </TableCell>

              <TableCell className="py-4">
                <span className="font-medium text-slate-700">
                  {patient.first_name} {patient.surname}
                </span>
              </TableCell>

              <TableCell className="py-4 text-slate-600">
                {patient.admission_date
                  ? format(new Date(patient.admission_date), "do MMM. yyyy")
                  : format(new Date(patient.created_at), "do MMM. yyyy")}
              </TableCell>

              <TableCell className="py-4 text-slate-600">
                {patient.gender}
              </TableCell>

              <TableCell className="py-4">
                {getBillingBadge(patient.billing_status)}
              </TableCell>

              <TableCell className="py-4">
                {getStatusBadge(patient.status)}
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
