"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Phone, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DoctorPatientData } from "@/types";

interface DoctorPatientsTableProps {
  patients: DoctorPatientData[];
  activeTab: string | null;
}

export function DoctorPatientsTable({
  patients,
  activeTab,
}: DoctorPatientsTableProps) {
  const router = useRouter();

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
  };

  const getGenderBadgeColor = (gender: string) => {
    const normalized = gender.toLowerCase();
    if (normalized === "male") return "bg-blue-50 text-blue-600";
    if (normalized === "female") return "bg-pink-50 text-pink-600";
    return "bg-gray-50 text-gray-600";
  };

  const getStatusBadge = () => {
    if (activeTab === "admitted") {
      return (
        <Badge className="bg-purple-50 text-purple-600 hover:bg-purple-50">
          Admitted
        </Badge>
      );
    }
    if (activeTab === "out_patient") {
      return (
        <Badge className="bg-green-50 text-green-600 hover:bg-green-50">
          Outpatient
        </Badge>
      );
    }
    return null;
  };

  const handleViewPatient = (patientId: number) => {
    router.push(`/doctor/patients/${patientId}`);
  };

  const handleStartConsultation = (patientId: number) => {
    router.push(`/doctor/consultation/start/${patientId}`);
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
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="text-sm font-medium text-muted-foreground hover:bg-transparent">
            <TableHead>Patient Info</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Registered</TableHead>
            {activeTab && <TableHead>Status</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <motion.tr
              key={patient.id}
              variants={rowVariants}
              className="transition-colors hover:bg-muted/50 cursor-pointer"
              onClick={() => handleViewPatient(patient.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={patient.profile_picture_location || ""}
                      alt={`${patient.first_name} ${patient.surname}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(patient.first_name, patient.surname)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {patient.first_name}{" "}
                      {patient.middle_name ? `${patient.middle_name} ` : ""}
                      {patient.surname}
                    </p>
                    {patient.mrn && (
                      <p className="text-xs text-muted-foreground">
                        MRN: {patient.mrn}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`capitalize ${getGenderBadgeColor(patient.gender)}`}
                >
                  {patient.gender}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {patient.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {patient.country_code} {patient.phone}
                      </span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate max-w-50">
                        {patient.email}
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {patient.address ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-50">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{patient.address}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(patient.created_at), "MMM dd, yyyy")}
                </p>
              </TableCell>
              {activeTab && (
                <TableCell>
                  {getStatusBadge()}
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 h-8 text-xs font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPatient(patient.id);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPatient(patient.id);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartConsultation(patient.id);
                        }}
                      >
                        Start Consultation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}