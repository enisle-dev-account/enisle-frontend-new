"use client";

import { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/api";
import { TransactionsDataResponse } from "@/types/cashier";
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
import { TransactionsHistorySheet } from "./components/transactions-history-sheet";
import { TransactionPreviewModal } from "./components/transaction-preview-modal";

export default function CashierTransactionsPage() {
  const [activeTab, setActiveTab] = useState<"in_queue" | "history">("in_queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("status", activeTab === "in_queue" ? "in_queue" : "history");
    if (searchQuery.trim()) {
      params.append("search_query", searchQuery.trim());
    }
    return params.toString();
  };

  const { data: transactionsData, isLoading } = useApiQuery<TransactionsDataResponse>(
    ["transactions", activeTab, searchQuery],
    `/cashier/transactions/list?${buildQueryString()}`
  );

  const consultations = useMemo(() => {
    return transactionsData?.results?.consultations || [];
  }, [transactionsData]);

  const inQueueCount = transactionsData?.results?.in_queue_transactions || 0;
  const historyCount = transactionsData?.results?.history_transactions || 0;
  const totalCount = transactionsData?.count || 0;

  const getFullName = (firstName: string, middleName: string, surname: string) => {
    return [firstName, middleName, surname].filter(Boolean).join(" ");
  };

  const getPayingForText = (consultation: any) => {
    const payingFor = consultation.transactions.map((t: any) =>
      t.transaction.paying_for.charAt(0).toUpperCase() +
      t.transaction.paying_for.slice(1).toLowerCase()
    );
    
    if (payingFor.length <= 3) {
      return payingFor.join(", ");
    }
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

  return (
    <main className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Manage patient consultations and billing</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "in_queue" | "history")}>
          <TabsList>
            <TabsTrigger value="in_queue" className="flex gap-2">
              In Queue
              <Badge variant="secondary">{inQueueCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex gap-2">
              History
              <Badge variant="secondary">{historyCount}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Search Input */}
          <div className="mt-4">
            <Input
              placeholder="Search by last name, middle name or first name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* In Queue Tab */}
          <TabsContent value="in_queue" className="mt-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Queue No. / Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Paying For</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : consultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                            consultation.patient.surname
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
                                setSelectedConsultationId(consultation.id);
                                // TODO: Open checkout modal
                              }}
                            >
                              Checkout
                            </Button>
                            <Button
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
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4">
            <div className="rounded-lg border">
              <Table>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : consultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                            consultation.patient.surname
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
                                setSelectedConsultationId(consultation.id);
                                setIsPreviewModalOpen(true);
                              }}
                            >
                              Preview
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 bg-transparent"
                              onClick={() => {
                                setSelectedConsultationId(consultation.id);
                                setIsHistorySheetOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 text-red-500 hover:text-red-600 bg-transparent"
                              onClick={() => {
                                // TODO: Handle delete/archive transaction
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal - Coming Soon */}
      <TransactionPreviewModal
        isOpen={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
      />
    </main>
  );
}
