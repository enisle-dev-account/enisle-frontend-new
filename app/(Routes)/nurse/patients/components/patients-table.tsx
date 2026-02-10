'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, LogOut, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import type { DoctorPatientsData } from '@/types';
import EmptyList from '@/components/empty-list';
import { AdmitPatientDrawer } from './admit-patient-drawer';
import DischargePatientDrawer from './discharge-patient-drawer';

interface PatientsTableProps {
  patients: DoctorPatientsData[];
  type: 'in_patient' | 'out_patient';
}

export function PatientsTable({ patients, type }: PatientsTableProps) {
  const router = useRouter();
  const [admitDrawerOpen, setAdmitDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatientsData | null>(null);

  const handleViewPatient = (consultationId: string | null) => {
    if (consultationId) {
      router.push(`/patient/${consultationId}`);
    }
  };

  const handleDischarge = (patientId: string) => {
    console.log('[v0] Discharge patient:', patientId);
  };

  const handleOpenAdmitDrawer = (patient: DoctorPatientsData) => {
    setSelectedPatient(patient);
    setAdmitDrawerOpen(true);
  };
  const handleOpendDischargeDrawer = (patient: DoctorPatientsData) => {
    setSelectedPatient(patient);
    setAdmitDrawerOpen(true);
  };


  if (patients.length === 0) {
    return (
      <div className="overflow-hidden">
        <EmptyList title="No patients Found" description="List of patients will appear here when patients are admitted in your hospital." />
        <AdmitPatientDrawer
          open={admitDrawerOpen}
          onOpenChange={setAdmitDrawerOpen}
          patient={selectedPatient}
        />
      </div>
    );
  }

  if (type === 'in_patient') {
    return (
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Billing Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium text-sm">
                  {patient.mrn.slice(0, 8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {patient.first_name} {patient.middle_name || ''} {patient.surname}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {patient.created_at
                    ? format(new Date(patient.created_at), 'dd MMM yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  {patient.doctor ? (
                    <div className="text-sm">
                      {patient.doctor.first_name} {patient.doctor.last_name}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {patient.gender || '-'}
                </TableCell>
                <TableCell>
                  {patient.billing_status ? (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.billing_status.toLowerCase() === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : patient.billing_status.toLowerCase() === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {patient.billing_status}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {patient.status || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleOpendDischargeDrawer(patient)}
                      className="gap-1"
                    >
                      Discharge
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPatient(patient.consultation_id)}
                      className="gap-1 bg-transparent border-primary text-primary"
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DischargePatientDrawer
          open={admitDrawerOpen}
          onOpenChange={setAdmitDrawerOpen}
          patient={selectedPatient}
        />
      </div>
    );
  }

  // Out-patient table
  return (
    <div className="overflow-hidden">
      <>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Billing Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium text-sm">
                  {patient.mrn.toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {patient.first_name} {patient.middle_name || ''} {patient.surname}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {patient.created_at
                    ? format(new Date(patient.created_at), 'dd MMM yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  {patient.doctor ? (
                    <div className="text-sm">
                      {patient.doctor.first_name} {patient.doctor.last_name}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {patient.gender || '-'}
                </TableCell>
                <TableCell>
                  {patient.billing_status ? (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.billing_status.toLowerCase() === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : patient.billing_status.toLowerCase() === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {patient.billing_status}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {patient.status || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleOpenAdmitDrawer(patient)}
                      className="gap-1"
                    >
                      Admit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPatient(patient.consultation_id)}
                      className="gap-1 bg-transparent border-primary text-primary"
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AdmitPatientDrawer
          open={admitDrawerOpen}
          onOpenChange={setAdmitDrawerOpen}
          patient={selectedPatient}
        />
      </>
    </div>
  );
}
