"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Copy,
    Check,
    Printer,
    Send,
    Save,
    Eye,
    User,
    Calendar, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useApiMutation, useCustomUrlApiMutation } from "@/hooks/api";
import {
    TransactionConsultationData,
    TransactionItem, TransactionDataItem
} from "@/types/cashier";
import {
    PAYMENT_METHODS
} from "@/lib/constants";
import SectionLabel from "./section-label";
import ItemsTable from "./items-table";
import { statusInvoiceColor } from "@/lib/utils";
import altLogo from "@/public/alt-logo.png";
import Image from "next/image";
import { usePrintReceipt } from "./reciept-print";
import { getFullName } from "../lib/utils";


interface InvoiceFormState {
  recipient_email: string;
  issued_on: string;
  due_on: string;
  description: string;
  recurring_monthly: boolean;
  additional_notes: string;
}

interface InvoiceEditState {
  payment_method: string;
  status: string;
  paid_total_amount: number;
  payment_datetime: string;
}

interface CheckoutSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  consultationId: string | null;
  patientInfo?: TransactionConsultationData | null;
  generatedInvoiceId?: string;
  paymentToken?: string;
  onSuccess?: () => void;
  /** Optional hospital info for the receipt */
  hospitalName?: string;
  hospitalAddress?: string;
  hospitalPhone?: string;
}



function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function PatientBanner({
  patient,
}: {
  patient: TransactionConsultationData["patient"];
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {patient.profile_picture_location ? (
          <img
            src={patient.profile_picture_location}
            alt={getFullName(patient)}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-sm">{getFullName(patient)}</p>
        <p className="text-xs flex gap-x-1.5 text-muted-foreground">
          <span>{patient.email}</span>
          <span className="capitalize">· {patient.country_code}</span>
          <span>· {patient.phone}</span>
        </p>
      </div>
      <Badge variant="outline" className="capitalize shrink-0 text-xs">
        {patient.gender}
      </Badge>
    </div>
  );
}

function getDetailFromItem(item: TransactionDataItem): string {
  if (!item) return "";
  if (typeof item === "string") return item;

  if (
    "doctor__first_name" in item &&
    "doctor__last_name" in item &&
    typeof item.doctor__first_name === "string" &&
    typeof item.doctor__last_name === "string"
  ) {
    return `${item.doctor__first_name} ${item.doctor__last_name}`;
  }

  if (
    "consultation__doctor__first_name" in item &&
    "consultation__doctor__last_name" in item &&
    typeof item.consultation__doctor__first_name === "string" &&
    typeof item.consultation__doctor__last_name === "string"
  ) {
    return `${item.consultation__doctor__first_name} ${item.consultation__doctor__last_name}`;
  }

  if (
    "scan_request__request_type" in item &&
    typeof item.scan_request__request_type === "string"
  ) {
    return item.scan_request__request_type;
  }

  if (
    "investigation_request__request_type__test_name" in item &&
    typeof item.investigation_request__request_type__test_name === "string"
  ) {
    return item.investigation_request__request_type__test_name;
  }

  if (
    "patient_bed__name" in item &&
    typeof item.patient_bed__name === "string"
  ) {
    return item.patient_bed__name;
  }

  if ("created_at" in item && typeof item.created_at === "string") {
    return new Date(item.created_at).toLocaleString();
  }

  return "";
}

export function CheckoutSheet({
  isOpen,
  onOpenChange,
  consultationId,
  patientInfo,
  generatedInvoiceId,
  paymentToken,
  onSuccess,
  hospitalName,
  hospitalAddress,
  hospitalPhone,
}: CheckoutSheetProps) {
  const hasInvoice = !!patientInfo?.invoice && !patientInfo?.invoice?.is_draft;
  const isEditMode = !hasInvoice;

  const [copied, setCopied] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState<InvoiceFormState>({
    recipient_email: "",
    issued_on: "",
    due_on: "",
    description: "",
    recurring_monthly: false,
    additional_notes: "",
  });

  const [editForm, setEditForm] = useState<InvoiceEditState>({
    payment_method: "",
    status: "confirmed",
    paid_total_amount: 0,
    payment_datetime: "",
  });

  const [items, setItems] = useState<TransactionItem[]>([]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [selectedDraft, setSelectedDraft] = useState("");

  const { printReceipt } = usePrintReceipt();

  const { mutate: createInvoice, isPending: isCreating } = useApiMutation<void>(
    "POST",
    consultationId
      ? `/cashier/invoice/create/consultation/${consultationId}/`
      : "",
    {
      onSuccess: () => {
        toast.success("Invoice sent successfully");
        onSuccess?.();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message || "Failed to create invoice"),
    },
  );

  const { mutate: saveDraft, isPending: isSavingDraft } = useApiMutation<void>(
    "POST",
    consultationId
      ? `/cashier/invoice/create/consultation/${consultationId}/`
      : "",
    {
      onSuccess: () => {
        toast.success("Draft saved");
        onSuccess?.();
      },
      onError: (err) => toast.error(err.message || "Failed to save draft"),
    },
  );

  const { mutate: updateInvoice, isPending: isUpdating } =
    useCustomUrlApiMutation<void>("PATCH", {
      onSuccess: () => {
        toast.success("Invoice updated");
        onSuccess?.();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message || "Failed to update invoice"),
    });

  useEffect(() => {
    if (!patientInfo) return;

    if (patientInfo.transactions?.length && !hasInvoice) {
      setItems(
        patientInfo.transactions.map((t) => ({
          itemType: t.transaction.paying_for,
          itemId: t.transaction.id,
          quantity: 1,
          price: t.transaction.pricing?.price ?? 0,
          details: getDetailFromItem(t.transaction.item),
        })),
      );
    }

    if (patientInfo.invoice) {
      const inv = patientInfo.invoice;
      setItems(inv.transaction_list ?? []);
      setAmountPaid(inv.paid_total_amount ?? 0);
      setInvoiceForm({
        recipient_email: inv.recipient_email ?? "",
        issued_on: inv.issued_on ?? "",
        due_on: inv.due_on ?? "",
        description: inv.description ?? "",
        recurring_monthly: inv.recurring_monthly ?? false,
        additional_notes: inv.additional_notes ?? "",
      });
      setEditForm({
        payment_method: inv.payment_method ?? "",
        status: inv.status ?? "",
        paid_total_amount: inv.paid_total_amount ?? 0,
        payment_datetime: inv.payment_datetime ?? "",
      });
    } else if (patientInfo.patient?.email) {
      setInvoiceForm((p) => ({
        ...p,
        recipient_email: patientInfo.patient.email,
      }));
    }
  }, [patientInfo]);

  const draftOptions = useMemo(
    () =>
      patientInfo?.draft_invoices?.map((d) => ({
        label: `${d.invoice_id} — ${new Date(d.created_at).toLocaleDateString()}`,
        value: d.invoice_id,
      })) ?? [],
    [patientInfo?.draft_invoices],
  );

  const populateDraft = (invoiceId: string) => {
    const draft = patientInfo?.draft_invoices?.find(
      (d) => d.invoice_id === invoiceId,
    );
    if (!draft) return;
    setSelectedDraft(invoiceId);
    setItems(draft.transaction_list ?? []);
    setInvoiceForm({
      recipient_email: draft.recipient_email ?? "",
      issued_on: draft.issued_on ?? "",
      due_on: draft.due_on ?? "",
      description: draft.description ?? "",
      recurring_monthly: draft.recurring_monthly ?? false,
      additional_notes: draft.additional_notes ?? "",
    });
  };

  const paymentLink = paymentToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${paymentToken}`
    : "";

  const copyLink = async () => {
    if (!paymentLink) return;
    await navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const invoiceId =
    patientInfo?.invoice?.invoice_id ?? generatedInvoiceId ?? "—";

  const handleSend = () => {
    if (total <= 0) {
      toast.error("Total amount cannot be zero");
      return;
    }
    if (!invoiceForm.issued_on || !invoiceForm.due_on) {
      toast.error("Please fill in issued and due dates");
      return;
    }
    createInvoice({ ...invoiceForm, transaction_list: items, is_draft: false });
  };

  const handleSaveAsDraft = () => {
    if (total <= 0) {
      toast.error("Total amount cannot be zero");
      return;
    }
    saveDraft({ ...invoiceForm, transaction_list: items, is_draft: true });
  };

  const handleUpdate = () => {
    if (!patientInfo?.invoice?.invoice_id) return;
    if (!editForm.payment_datetime) {
      toast.error("Please select a payment date");
      return;
    }
    if (!editForm.payment_method) {
      toast.error("Please select a payment method");
      return;
    }
    updateInvoice({
      url: `/cashier/invoice/${patientInfo.invoice.invoice_id}/update`,
      data: {
        ...editForm,
        paid_total_amount: patientInfo.invoice.paid_total_amount,
        status: "confirmed"
      },
    });
  };

  const handlePrint = () => {
    if (!patientInfo) {
      toast.error("No invoice data to print");
      return;
    }
    printReceipt(patientInfo, {
      generatedInvoiceId,
      hospitalName,
      hospitalAddress,
      hospitalPhone,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="min-w-[calc(40vw)] sm:max-w-lg p-0 flex flex-col gap-0 overflow-hidden"
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <div>
            <Image src={altLogo} alt="Alt Logo" width={130} height={130} />
          </div>

          <div className="flex items-start justify-between gap-3 mt-3">
            <div>
              <SheetTitle className="text-base font-semibold">
                {hasInvoice ? "Invoice Details" : "Create Invoice"}
              </SheetTitle>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {hasInvoice && (
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${statusInvoiceColor(patientInfo?.invoice?.status ?? "")}`}
                >
                  {patientInfo?.invoice?.status?.replace(/_/g, " ")}
                </Badge>
              )}
              {/* {paymentLink && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={copyLink}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {copied ? "Copied!" : "Copy payment link"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )} */}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {patientInfo?.patient && (
            <div>
              <SectionLabel>Patient</SectionLabel>
              <PatientBanner patient={patientInfo.patient} />
            </div>
          )}

          {isEditMode && draftOptions.length > 0 && (
            <div>
              <Field label="Load from draft">
                <Select value={selectedDraft} onValueChange={populateDraft}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select a saved draft…" />
                  </SelectTrigger>
                  <SelectContent>
                    {draftOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-sm"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {hasInvoice && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Payment Method" required>
                <Select
                  value={editForm.payment_method}
                  onValueChange={(v) =>
                    setEditForm((p) => ({ ...p, payment_method: v }))
                  }
                >
                  <SelectTrigger className="h-9 text-sm w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem
                        key={m.value}
                        value={m.value}
                        className="text-sm"
                      >
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Payment Date" required>
                <Input
                  type="date"
                  value={editForm.payment_datetime}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      payment_datetime: e.target.value,
                    }))
                  }
                  className="h-9 text-sm"
                />
              </Field>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Field label="Recipient Email">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="patient@example.com"
                  value={invoiceForm.recipient_email}
                  onChange={(e) =>
                    setInvoiceForm((p) => ({
                      ...p,
                      recipient_email: e.target.value,
                    }))
                  }
                  disabled={!isEditMode}
                  className="h-9 pl-9 text-sm"
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Issued On" required={isEditMode}>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={invoiceForm.issued_on}
                    onChange={(e) =>
                      setInvoiceForm((p) => ({
                        ...p,
                        issued_on: e.target.value,
                      }))
                    }
                    disabled={!isEditMode}
                    className="h-9 pl-9 text-sm"
                  />
                </div>
              </Field>

              <Field label="Due On" required={isEditMode}>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={invoiceForm.due_on}
                    onChange={(e) =>
                      setInvoiceForm((p) => ({
                        ...p,
                        due_on: e.target.value,
                      }))
                    }
                    disabled={!isEditMode}
                    className="h-9 pl-9 text-sm"
                  />
                </div>
              </Field>
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <Checkbox
                id="recurring"
                checked={invoiceForm.recurring_monthly}
                onCheckedChange={(v) =>
                  setInvoiceForm((p) => ({ ...p, recurring_monthly: !!v }))
                }
                disabled={!isEditMode}
              />
              <label
                htmlFor="recurring"
                className="text-sm leading-none cursor-pointer select-none"
              >
                Recurring invoice (monthly)
              </label>
            </div>
          </div>

          <ItemsTable
            items={items}
            isEditable={isEditMode}
            onItemsChange={setItems}
            amountPaid={hasInvoice ? editForm.paid_total_amount : amountPaid}
            onAmountPaidChange={(v) => {
              setAmountPaid(v);
              if (hasInvoice)
                setEditForm((p) => ({ ...p, paid_total_amount: v }));
            }}
          />

          <div className="flex flex-col gap-4">
            <Field label="Description">
              <Textarea
                placeholder="Enter invoice description…"
                rows={2}
                value={invoiceForm.description}
                onChange={(e) =>
                  setInvoiceForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                disabled={!isEditMode}
                className="text-sm resize-none"
              />
            </Field>

            <Field label="Additional Notes">
              <Textarea
                placeholder="Any additional notes for the patient…"
                rows={2}
                value={invoiceForm.additional_notes}
                onChange={(e) =>
                  setInvoiceForm((p) => ({
                    ...p,
                    additional_notes: e.target.value,
                  }))
                }
                disabled={!isEditMode}
                className="text-sm resize-none"
              />
            </Field>
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-background shrink-0">
          {isEditMode ? (
            <div className="flex items-center justify-end gap-3">
              {/* <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary gap-1.5 px-0 h-auto"
                onClick={() => setIsPreviewMode(true)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button> */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAsDraft}
                  disabled={isSavingDraft || isCreating}
                  className="gap-1.5"
                >
                  {isSavingDraft ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save draft
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSend}
                  disabled={isCreating || isSavingDraft}
                  className="gap-1.5"
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Invoice
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="gap-1.5"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Complete Payment
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}