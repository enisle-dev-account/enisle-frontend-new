"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, AlertCircle, XCircle, Edit2 } from "lucide-react";
import Image from "next/image";
import { toBase64 } from "@/lib/utils";
import { shimmer } from "@/components/image-shimmer";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PharmacyPatient } from "@/types";

interface PatientMedicationDrawerProps {
  patient: PharmacyPatient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinishSuccess: () => void;
  onRefetch: () => void;
}

export function PatientMedicationDrawer({
  patient,
  open,
  onOpenChange,
  onFinishSuccess,
  onRefetch,
}: PatientMedicationDrawerProps) {
  const [notes, setNotes] = useState("");
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(
    undefined,
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const finishMutation = useMutation({
    mutationFn: (prescriptionId: string) =>
      request(`/pharmacy/prescription/finish/${prescriptionId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      onFinishSuccess();
    },
    onError: (error: any) => {
      if (error?.status === 402) {
        setErrorMsg(
          "Dispensing blocked: This patient has not completed payment at the cashier.",
        );
      } else {
        setErrorMsg(
          error?.message ||
            "An unexpected error occurred while finishing the prescription.",
        );
      }
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({
      prescriptionId,
      notes,
    }: {
      prescriptionId: number;
      notes: string;
    }) =>
      request(`/pharmacy/prescription/note/${prescriptionId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pharmacist_notes: notes }),
      }),
    onSuccess: () => {
      setNotes("");
      setEditingId(null);
      onRefetch();
    },
    onError: (error: any) => {
      setErrorMsg(error?.message || "Failed to update pharmacist notes.");
    },
  });

  if (!patient) return null;

  const constructName = (p: PharmacyPatient["consultation"]["patient"]) => {
    const parts = [p.first_name, p.middle_name, p.surname].filter(Boolean);
    return parts.join(" ");
  };

  const constructDoctorName = (
    doctor: PharmacyPatient["consultation"]["doctor"],
  ) => {
    return `${doctor.first_name} ${doctor.last_name}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  };

  const getBillingStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const isFinished = patient.prescribed_medicines.every(
    (medicine) => medicine.status?.toLowerCase() === "completed",
  );

  const totalPrice = patient.prescribed_medicines.reduce(
    (total, medicine) => total + (medicine.medicine.price || 0),
    0,
  );

  const handleFinish = () => {
    finishMutation.mutate(patient.id);
  };

  const handleStartEdit = (medicine: any) => {
    setEditingId(medicine.id);
    setNotes(medicine.pharmacist_notes || ""); // Pre-fill with existing note
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNotes("");
  };

  const handleSendNote = (prescriptionId: number) => {
    if (notes.trim()) {
      updateNotesMutation.mutate({ prescriptionId, notes: notes.trim() });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full p-5 sm:min-w-3xl overflow-y-auto"
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">
              Patient Medication
            </SheetTitle>
          </div>
        </SheetHeader>
        {errorMsg && (
          <div className="mt-4 flex items-center gap-3 p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium flex-1">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg(null)}
              className="hover:bg-destructive/20 p-1 rounded-full transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}
        {/* Patient Info Card */}
        <div className="mt-6 p-6 border rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            {patient.consultation.patient.profile_picture_location ? (
              <Image
                src={patient.consultation.patient.profile_picture_location}
                alt={constructName(patient.consultation.patient)}
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(48, 48))}`}
                width={48}
                height={48}
                className="rounded-full h-12 w-12 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg font-medium">
                  {patient.consultation.patient.first_name[0]}
                  {patient.consultation.patient.surname[0]}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold">
                {constructName(patient.consultation.patient)}
              </p>
              <p className="text-sm text-[#8D95A5]">
                #{patient.consultation.patient.id}
              </p>
            </div>
          </div>
          <div className="flex gap-14">
            <div>
              <p className="text-sm text-[#8D95A5]">From</p>
              <p className="font-semibold">
                {constructDoctorName(patient.consultation.doctor)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#8D95A5]">Gender</p>
              <p className="font-semibold capitalize">
                {patient.consultation.patient.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#8D95A5]">Billing Status</p>
              <p
                className={
                  patient.billing_status === "paid"
                    ? "text-[#00D261]"
                    : "text-yellow-500"
                }
              >
                {getBillingStatus(patient.billing_status)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6  rounded-lg">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-fit justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="details"
                className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
              >
                Medicine Details
              </TabsTrigger>
              <TabsTrigger
                value="prices"
                className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
              >
                Prices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-4">
              <Accordion
                type="single"
                collapsible
                value={activeAccordion}
                onValueChange={setActiveAccordion}
              >
                {patient.prescribed_medicines.map((medicine, index) => {
                  const isEditing = editingId === medicine.id;
                  const isCompleted =
                    medicine.status?.toLowerCase() === "completed";
                  return (
                    <AccordionItem key={medicine.id} value={`item-${index}`}>
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        {medicine.medicine.title}
                      </AccordionTrigger>
                      <AccordionContent className="h-fit">
                        <div className="space-y-6 p-2">
                          <div className="grid grid-cols-3 gap-8">
                            <div className="flex flex-col ">
                              <p className="text-[#8D95A5] mb-0! text-sm">
                                Medicine Type
                              </p>
                              <p className="text-primary capitalize text-lg font-semibold">
                                {medicine.medicine_type || "-"}
                              </p>
                            </div>
                            <div className="flex flex-col ">
                              <p className="text-[#8D95A5] mb-0! text-sm">
                                Qty
                              </p>
                              <p className="text-primary capitalize text-lg font-semibold">
                                {medicine.quantity || "-"}
                              </p>
                            </div>
                            <div className="flex flex-col ">
                              <p className="text-[#8D95A5] mb-0! text-sm">
                                Dose
                              </p>
                              <p className="text-primary capitalize text-lg font-semibold">
                                {medicine.dosage || "-"}
                              </p>
                            </div>
                            <div className="flex flex-col ">
                              <p className="text-[#8D95A5] mb-0! text-sm">
                                Start Date
                              </p>
                              <p className="text-primary capitalize text-lg font-semibold">
                                {formatDate(medicine.start_date)}
                              </p>
                            </div>
                            <div className="flex flex-col ">
                              <p className="text-[#8D95A5] mb-0! text-sm">
                                End Date
                              </p>
                              <p className="text-primary capitalize text-lg font-semibold">
                                {formatDate(medicine.end_date)}
                              </p>
                            </div>
                            <div className="flex flex-col ">
                              <p className="text-[#8D95A5] mb-0! text-sm">
                                Prescription
                              </p>
                              <p className="text-primary capitalize text-lg font-semibold">
                                {medicine.frequency.replaceAll("_", ", ") ||
                                  "-"}
                              </p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-[#8D95A5] text-sm font-medium">
                                Pharmacist Notes
                              </label>
                              {!isEditing && !isCompleted && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary h-8 gap-2"
                                  onClick={() => handleStartEdit(medicine)}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                  {medicine.pharmacist_notes
                                    ? "Edit Note"
                                    : "Add Note"}
                                </Button>
                              )}
                            </div>

                            {isEditing ? (
                              <div className="space-y-3">
                                <Textarea
                                  placeholder="Type pharmacist notes here..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  className="min-h-25 focus-visible:ring-primary"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="rounded-full px-6"
                                    disabled={updateNotesMutation.isPending}
                                    onClick={() => handleSendNote(medicine.id)}
                                  >
                                    {updateNotesMutation.isPending
                                      ? "Saving..."
                                      : "Save Note"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full px-6"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-muted/30 p-3 rounded-md border border-dashed">
                                <p className="text-sm italic text-foreground/80 whitespace-pre-wrap">
                                  {medicine.pharmacist_notes ||
                                    "No notes added yet."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabsContent>

            <TabsContent value="prices" className="p-4">
              <div className="space-y-4">
                {patient.prescribed_medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex justify-between items-center py-4 border-b"
                  >
                    <p>{medicine.medicine.title}</p>
                    <p className="font-medium">
                      N{medicine.medicine.price.toLocaleString()}
                    </p>
                  </div>
                ))}

                <div className="flex justify-between items-center py-4">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">
                    N{totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </TabsContent>
            {!isFinished && (
              <Button
                className="w-37.5 absolute bottom-6 right-6 rounded-full bg-primary hover:bg-primary/90"
                onClick={handleFinish}
                disabled={finishMutation.isPending}
              >
                {finishMutation.isPending ? "Finishing..." : "Finish"}
              </Button>
            )}
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
