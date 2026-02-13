"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  User,
  Mail,
  CreditCard,
  FileText,
  Hash,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hourglass,
  RefreshCw,
} from "lucide-react";
import {
  TransactionInvoiceData,
  TransactionConsultationPatientData,
  TransactionItem,
} from "@/types/cashier";
import Image from "next/image";
import altLogo from "@/public/alt-logo.png";
import { formatCurrency } from "@/lib/utils";
import { getFullName } from "../lib/utils";


function fmtDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


type InvoiceStatus =
  | "initiated"
  | "pending_confirmation"
  | "confirmed"
  | "declined";

const STATUS_CONFIG: Record<
  InvoiceStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    Icon: React.ElementType;
  }
> = {
  initiated: {
    label: "Initiated",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    Icon: Hourglass,
  },
  pending_confirmation: {
    label: "Pending",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    Icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    Icon: CheckCircle2,
  },
  declined: {
    label: "Declined",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    Icon: XCircle,
  },
};

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as InvoiceStatus] ?? {
    label: status.replace(/_/g, " "),
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
    Icon: AlertCircle,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      <cfg.Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span>{value || "—"}</span>
      </div>
    </div>
  );
}

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: TransactionInvoiceData | null;
  patient?: TransactionConsultationPatientData | null;
  hospitalName?: string;
  hospitalAddress?: string;
  hospitalPhone?: string;
}

export function TransactionPreviewModal({
  isOpen,
  onOpenChange,
  invoice,
  patient,
  hospitalName = "MedCare Hospital",
  hospitalAddress,
  hospitalPhone,
}: TransactionPreviewModalProps) {
  if (!invoice) return null;

  const items: TransactionItem[] = invoice.transaction_list ?? [];
  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const paid = invoice.paid_total_amount ?? 0;
  const balance = subtotal - paid;

  const paymentMethodLabel = invoice.payment_method
    ? invoice.payment_method.replace(/_/g, " ")
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle>{""}</DialogTitle>
      <DialogContent
        className="min-w-3xl min-h-[calc(75vh)] p-0 overflow-hidden gap-0 rounded-xl"
        style={{ maxHeight: "90vh" }}
      >
        <div className="relative px-7 pt-6">
          <div className="relative flex flex-col gap-4">
            <div>
              <Image src={altLogo} alt="Alt Logo" width={130} height={130} />
            </div>
            <div className="border-b pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]  mb-1">
                {hospitalName}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]  mb-1">
                {hospitalPhone}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]  mb-1">
                {hospitalAddress}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="mt-1.5 font-bold text-2xl text-[#626467]">
                #{invoice.invoice_id}
              </p>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusPill status={invoice.status} />
                {invoice.is_draft && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-background/40">
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-x-6 gap-y-4">
            <MetaItem
              icon={CalendarDays}
              label="Issued"
              value={fmtDate(invoice.issued_on)}
            />
            <MetaItem
              icon={CalendarDays}
              label="Due"
              value={fmtDate(invoice.due_on)}
            />
            {invoice.payment_datetime ? (
              <MetaItem
                icon={CheckCircle2}
                label="Paid on"
                value={fmtDate(invoice.payment_datetime)}
              />
            ) : (
              <MetaItem
                icon={Clock}
                label="Created"
                value={fmtDate(invoice.created_at)}
              />
            )}
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          <div className="px-7 py-5 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {patient && (
                <div className="rounded-lg border bg-muted/30 px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Billed To
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                      {patient.profile_picture_location ? (
                        <img
                          src={patient.profile_picture_location}
                          alt={getFullName(patient)}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-foreground/60" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-none">
                        {getFullName(patient)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {patient.gender} · {patient.age}y ·{" "}
                        {patient.country_code}
                      </p>
                    </div>
                  </div>
                  {patient.phone && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {patient.phone}
                    </p>
                  )}
                </div>
              )}

              <div className="rounded-lg border bg-muted/30 px-4 py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Send To
                </p>
                <div className="flex items-start gap-2 mt-1">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm break-all">
                    {invoice.recipient_email || patient?.email || "—"}
                  </span>
                </div>
                {paymentMethodLabel && (
                  <div className="flex items-center gap-2 mt-2.5">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm capitalize">
                      {paymentMethodLabel}
                    </span>
                  </div>
                )}
                {invoice.recurring_monthly && (
                  <div className="flex items-center gap-2 mt-2.5">
                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Recurring monthly
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Line items ── */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
                Items
              </p>

              <div className="rounded-lg border overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_60px_80px_90px] gap-3 px-4 py-2.5 bg-muted/50 border-b">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Description
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-center">
                    Qty
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">
                    Unit price
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">
                    Total
                  </span>
                </div>

                {/* Rows */}
                {items.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No items on this invoice
                  </div>
                ) : (
                  items.map((item, idx) => {
                    const lineTotal = item.quantity * item.price;
                    const label =
                      item.details ||
                      item.itemType?.replace(/_/g, " ") ||
                      `Item ${idx + 1}`;
                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-[1fr_60px_80px_90px] gap-3 px-4 py-3 items-center ${
                          idx < items.length - 1 ? "border-b" : ""
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium capitalize leading-snug">
                            {label}
                          </p>
                          {item.itemType && item.details && (
                            <p className="text-xs text-muted-foreground capitalize mt-0.5">
                              {item.itemType.replace(/_/g, " ")}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                          {item.quantity}
                        </p>
                        <p className="text-sm text-right text-muted-foreground">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm text-right font-medium">
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── Totals ── */}
            <div className="ml-auto w-full max-w-xs flex flex-col gap-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {/* <div className="flex justify-between text-sm text-muted-foreground">
                <span>Amount paid</span>
                <span>{formatCurrency(paid)}</span>
              </div> */}
              <Separator />
              <div className="flex justify-between text-base font-bold">
                {/* THESE ARE COMMENTED OUT BECAUSE PARTIAL PAYMENTS ARE NOT YET SUPPORTED */}
                {/* <span>{balance > 0 ? "Balance due" : "Total"}</span> */} 
                <span>Total</span>
                <span
                  className={balance > 0 ? "text-red-600" : "text-emerald-600"}
                >
                  {formatCurrency(balance > 0 ? balance : subtotal)}
                </span>
              </div>
              {balance <= 0 && paid > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Change</span>
                  <span>{formatCurrency(Math.abs(balance))}</span>
                </div>
              )}
            </div>

            {(invoice.description || invoice.additional_notes) && (
              <div className="flex flex-col gap-3">
                {invoice.description && (
                  <div className="rounded-lg border bg-muted/30 px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Description
                      </p>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {invoice.description}
                    </p>
                  </div>
                )}
                {invoice.additional_notes && (
                  <div className="rounded-lg border bg-muted/30 px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Notes
                      </p>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {invoice.additional_notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer strip ── */}
          <div className="px-7 py-3.5 border-t bg-muted/20 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Last updated {fmtDate(invoice.updated_at)}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {invoice.invoice_id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
