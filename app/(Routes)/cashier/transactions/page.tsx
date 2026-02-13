"use client";

import { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/api";
import {
  TransactionsDataResponse,
  TransactionConsultationData,
  TransactionInvoiceData,
  TransactionConsultationPatientData,
} from "@/types/cashier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bell, X, Eye } from "lucide-react";
import { TransactionPreviewModal } from "./components/transaction-preview-modal";
import { CheckoutSheet } from "./components/chashier-sheet";
import { useAuth } from "@/providers/auth-provider";
import { HospitalDetailsResponse } from "@/types";
import { DoctorPatientsTableSkeleton } from "../../patient/components/skeletons/table-skeleton";
import { format } from "date-fns";

export default function CashierTransactionsPage() {
  const [activeTab, setActiveTab] = useState<"in_queue" | "history">(
    "in_queue",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [previewInvoice, setPreviewInvoice] =
    useState<TransactionInvoiceData | null>(null);
  const [previewPatient, setPreviewPatient] =
    useState<TransactionConsultationPatientData | null>(null);

  // Checkout sheet state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<TransactionConsultationData | null>(null);

  // Other modals
  const [selectedConsultationId, setSelectedConsultationId] = useState<
    string | null
  >(null);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("status", activeTab === "in_queue" ? "in_queue" : "history");
    if (searchQuery.trim()) params.append("search_query", searchQuery.trim());
    return params.toString();
  };

  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useApiQuery<TransactionsDataResponse>(
    ["transactions", activeTab, searchQuery],
    `/cashier/transactions/list?${buildQueryString()}`,
  );

  const { data: hospitalDetails, isLoading: isHospitalDetailsLoading } =
    useApiQuery<HospitalDetailsResponse>(
      ["hospital", "details"],
      `/hospital/details`,
    );

  const consultations = useMemo(
    () => transactionsData?.results?.consultations || [],
    [transactionsData],
  );

  const inQueueCount = transactionsData?.results?.in_queue_transactions || 0;
  const historyCount = transactionsData?.results?.history_transactions || 0;
  const generatedInvoiceId = transactionsData?.results?.generated_invoice_id;
  const paymentToken = transactionsData?.results?.payment_token;

  const getFullName = (
    firstName: string,
    middleName: string,
    surname: string,
  ) => [firstName, middleName, surname].filter(Boolean).join(" ");

  const getPayingForText = (consultation: TransactionConsultationData) => {
    const payingFor = consultation.transactions.map(
      (t) =>
        t.transaction.paying_for.charAt(0).toUpperCase() +
        t.transaction.paying_for.slice(1).toLowerCase(),
    );
    if (payingFor.length <= 3) return payingFor.join(", ");
    return `${payingFor.slice(0, 3).join(", ")} +${payingFor.length - 3}`;
  };

  const getStatusBadge = (status: string) => {
    if (status === "in_queue") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-0 capitalize">
          Not Present
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 border-0 capitalize">
        Checked In
      </Badge>
    );
  };

  const openCheckout = (consultation: TransactionConsultationData) => {
    setSelectedConsultation(consultation);
    setCheckoutOpen(true);
  };

  return (
    <main className="">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "in_queue" | "history")}
      >
        <div className="bg-background rounded-3xl p-6">
          <TabsList className="justify-start rounded-none border-b p-0 gap-8 mb-6 bg-background">
            <TabsTrigger
              value="in_queue"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-b-2 border-x-0 border-t-0 border-transparent px-0 py-3 flex gap-x-3"
            >
              In Queue
              <Badge variant="default">{inQueueCount}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-b-2 border-x-0 border-t-0 border-transparent px-0 py-3 flex gap-x-3"
            >
              History
              <Badge variant="default">{historyCount}</Badge>
            </TabsTrigger>
          </TabsList>

          <div className="">
            <Input
              placeholder="Search by last name, middle name or first name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        {/* In Queue Tab */}
        <TabsContent value="in_queue" className="mt-4">
          <div className="  bg-background rounded-3xl p-6">
            {isLoading? (
                <DoctorPatientsTableSkeleton />
            ):(<Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Queue No. / Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Paying For</TableHead>
                  <TableHead>Invoice Created</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No consultations found
                    </TableCell>
                  </TableRow>
                ) : (
                  consultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={`${
                              consultation.status === "in_queue"
                                ? "bg-orange-500"
                                : "bg-green-500"
                            } text-white`}
                          >
                            {consultation.queue_number}
                          </Badge>
                          {getStatusBadge(consultation.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getFullName(
                          consultation.patient.first_name,
                          consultation.patient.middle_name,
                          consultation.patient.surname,
                        )}
                      </TableCell>
                      <TableCell>{getPayingForText(consultation)}</TableCell>
                      <TableCell>{consultation.invoice? <span className="text-sm font-medium text-foreground">{format(consultation.invoice.created_at, "PPP")}</span> : "—"}</TableCell>
                      <TableCell className="capitalize">
                        {consultation.patient.gender}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openCheckout(consultation)}
                          >
                            Checkout
                          </Button>
                          {/* <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 bg-transparent"
                            onClick={() => {
                              setSelectedConsultationId(consultation.id);
                              // TODO: Open notification modal
                            }}
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 text-red-500 hover:text-red-600 bg-transparent"
                            onClick={() => {
                              // TODO: Remove from queue
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>)}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <div className="bg-background rounded-3xl p-6">
            {isLoading? (
                <DoctorPatientsTableSkeleton />
            ):(<Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Paying For</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { consultations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No transaction history found
                    </TableCell>
                  </TableRow>
                ) : (
                  consultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {consultation.invoice?.invoice_id || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getFullName(
                          consultation.patient.first_name,
                          consultation.patient.middle_name,
                          consultation.patient.surname,
                        )}
                      </TableCell>
                      <TableCell>{getPayingForText(consultation)}</TableCell>
                      <TableCell className="capitalize">
                        {consultation.patient.gender}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setPreviewInvoice(consultation.invoice); // the invoice object from the history row
                              setPreviewPatient(consultation.patient); // the patient object from the history row
                            }}
                          >
                            Preview
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Checkout Sheet */}
      <CheckoutSheet
        isOpen={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
          if (!open) setSelectedConsultation(null);
        }}
        consultationId={selectedConsultation?.id ?? null}
        patientInfo={selectedConsultation}
        generatedInvoiceId={generatedInvoiceId}
        paymentToken={paymentToken ?? undefined}
        onSuccess={() => refetch()}
        hospitalName={hospitalDetails?.name}
        hospitalPhone={hospitalDetails?.mobile}
        hospitalAddress={`${hospitalDetails?.city}, ${hospitalDetails?.state}, ${hospitalDetails?.postal_code}`}
      />

      <TransactionPreviewModal
        isOpen={!!previewInvoice}
        onOpenChange={(open) => !open && setPreviewInvoice(null)}
        invoice={previewInvoice}
        patient={previewPatient}
        hospitalName={hospitalDetails?.name}
        hospitalPhone={hospitalDetails?.mobile}
        hospitalAddress={`${hospitalDetails?.city}, ${hospitalDetails?.state}, ${hospitalDetails?.postal_code}`}
      />
    </main>
  );
}
