"use client";

import { useRef } from "react";
import { TransactionConsultationData } from "@/types/cashier";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFullName(p: TransactionConsultationData["patient"]) {
  return [p.first_name, p.middle_name, p.surname].filter(Boolean).join(" ");
}

function fmt(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function fmtDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dashes(n = 40) {
  return "-".repeat(n);
}

function equals(n = 40) {
  return "=".repeat(n);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReceiptPrintProps {
  patientInfo: TransactionConsultationData;
  generatedInvoiceId?: string;
  hospitalName?: string;
  hospitalAddress?: string;
  hospitalPhone?: string;
}

// ─── Receipt Component ────────────────────────────────────────────────────────

export function ReceiptPrint({
  patientInfo,
  generatedInvoiceId,
  hospitalName = "MedCare Hospital",
  hospitalAddress = "12 Health Avenue, Lagos",
  hospitalPhone = "+234 800 000 0000",
}: ReceiptPrintProps) {
  const invoice = patientInfo?.invoice;
  const items = invoice?.transaction_list ?? [];
  const patient = patientInfo?.patient;

  const invoiceId = invoice?.invoice_id ?? generatedInvoiceId ?? "—";
  const total = items.reduce(
    (s: number, i: { quantity: number; price: number }) => s + i.quantity * i.price,
    0,
  );
  const paid = invoice?.paid_total_amount ?? 0;
  const balance = total - paid;

  const statusLabel =
    invoice?.status?.replace(/_/g, " ").toUpperCase() ?? "PENDING";

  return (
    <div
      id="thermal-receipt"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "12px",
        lineHeight: "1.5",
        color: "#000",
        background: "#fff",
        width: "302px",            // 80mm thermal roll width
        margin: "0 auto",
        padding: "12px 8px",
        letterSpacing: "0.02em",
      }}
    >
      {/* ── Hospital Header ── */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <div style={{ fontSize: "15px", fontWeight: "bold", letterSpacing: "0.1em" }}>
          ★ {hospitalName.toUpperCase()} ★
        </div>
        <div style={{ fontSize: "11px", marginTop: "2px" }}>{hospitalAddress}</div>
        <div style={{ fontSize: "11px" }}>Tel: {hospitalPhone}</div>
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "4px" }}>
        {equals()}
      </div>

      {/* ── Invoice Title ── */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <div style={{ fontSize: "13px", fontWeight: "bold", letterSpacing: "0.15em" }}>
          PATIENT INVOICE
        </div>
        <div style={{ fontSize: "10px", marginTop: "2px" }}>
          {`[ ${statusLabel} ]`}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px" }}>
        {dashes()}
      </div>

      {/* ── Invoice Meta ── */}
      <div style={{ marginBottom: "8px" }}>
        <Row label="Invoice No." value={invoiceId} />
        <Row label="Issued On" value={fmtDate(invoice?.issued_on)} />
        <Row label="Due On" value={fmtDate(invoice?.due_on)} />
        <Row label="Print Time" value={new Date().toLocaleString("en-GB")} />
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px" }}>
        {dashes()}
      </div>

      {/* ── Patient Details ── */}
      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "3px", letterSpacing: "0.05em" }}>
          PATIENT
        </div>
        <Row label="Name" value={patient ? getFullName(patient) : "—"} />
        <Row label="Gender" value={patient?.gender?.toUpperCase() ?? "—"} />
        <Row label="Phone" value={patient?.phone ?? "—"} />
        <Row label="Email" value={patient?.email ?? "—"} truncate />
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px" }}>
        {dashes()}
      </div>

      {/* ── Line Items ── */}
      <div style={{ marginBottom: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "4px", letterSpacing: "0.05em" }}>
          ITEMS
        </div>

        {/* Column Headers */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            fontWeight: "bold",
            borderBottom: "1px dashed #000",
            paddingBottom: "3px",
            marginBottom: "4px",
          }}
        >
          <span style={{ flex: 1 }}>DESCRIPTION</span>
          <span style={{ width: "30px", textAlign: "center" }}>QTY</span>
          <span style={{ width: "70px", textAlign: "right" }}>AMOUNT</span>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: "10px", color: "#555" }}>
            No items
          </div>
        ) : (
          items.map(
            (
              item: {
                itemType?: string;
                details?: string;
                quantity: number;
                price: number;
              },
              idx: number,
            ) => (
              <div key={idx} style={{ marginBottom: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      paddingRight: "4px",
                      wordBreak: "break-word",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.details || item.itemType || `Item ${idx + 1}`}
                  </span>
                  <span
                    style={{
                      width: "30px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.quantity}
                  </span>
                  <span
                    style={{
                      width: "70px",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {fmt(item.quantity * item.price)}
                  </span>
                </div>
                <div style={{ fontSize: "10px", color: "#444" }}>
                  @ {fmt(item.price)} each
                </div>
              </div>
            ),
          )
        )}
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "6px" }}>
        {dashes()}
      </div>

      {/* ── Totals ── */}
      <div style={{ marginBottom: "6px" }}>
        <Row label="Subtotal" value={fmt(total)} />
        <Row label="Amount Paid" value={fmt(paid)} />
        {balance > 0 && (
          <Row
            label="Balance Due"
            value={fmt(balance)}
            bold
          />
        )}
        {balance <= 0 && paid > 0 && (
          <Row label="Change" value={fmt(Math.abs(balance))} bold />
        )}
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "6px" }}>
        {equals()}
      </div>

      {/* ── Total Box ── */}
      <div
        style={{
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "bold",
          letterSpacing: "0.05em",
          margin: "6px 0",
        }}
      >
        TOTAL: {fmt(total)}
      </div>

      {/* ── Payment Method ── */}
      {invoice?.payment_method && (
        <div style={{ textAlign: "center", fontSize: "11px", marginBottom: "4px" }}>
          Payment via:{" "}
          <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
            {invoice.payment_method.replace(/_/g, " ")}
          </span>
        </div>
      )}

      {/* ── Payment Date ── */}
      {invoice?.payment_datetime && (
        <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "6px" }}>
          Paid on: {fmtDate(invoice.payment_datetime)}
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px" }}>
        {dashes()}
      </div>

      {/* ── Notes / Description ── */}
      {(invoice?.description || invoice?.additional_notes) && (
        <>
          {invoice?.description && (
            <div style={{ marginBottom: "4px", fontSize: "11px" }}>
              <span style={{ fontWeight: "bold" }}>Note: </span>
              {invoice.description}
            </div>
          )}
          {invoice?.additional_notes && (
            <div style={{ marginBottom: "6px", fontSize: "11px" }}>
              <span style={{ fontWeight: "bold" }}>Additional: </span>
              {invoice.additional_notes}
            </div>
          )}
          <div
            style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px" }}
          >
            {dashes()}
          </div>
        </>
      )}

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", fontSize: "10px", marginTop: "4px" }}>
        <div>Thank you for choosing {hospitalName}.</div>
        <div>Your health is our priority.</div>
        <div style={{ marginTop: "6px", letterSpacing: "0.05em" }}>
          * * * KEEP THIS RECEIPT * * *
        </div>
        <div style={{ marginTop: "8px", fontSize: "9px", color: "#555" }}>
          Powered by MedSync
        </div>
      </div>
    </div>
  );
}

// ─── Row helper ───────────────────────────────────────────────────────────────

function Row({
  label,
  value,
  bold,
  truncate,
}: {
  label: string;
  value: string;
  bold?: boolean;
  truncate?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "4px",
        fontSize: "11px",
        fontWeight: bold ? "bold" : "normal",
        marginBottom: "1px",
      }}
    >
      <span style={{ color: "#444", flexShrink: 0 }}>{label}:</span>
      <span
        style={{
          textAlign: "right",
          overflow: truncate ? "hidden" : undefined,
          textOverflow: truncate ? "ellipsis" : undefined,
          whiteSpace: truncate ? "nowrap" : undefined,
          maxWidth: truncate ? "180px" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Print trigger hook ───────────────────────────────────────────────────────

export function usePrintReceipt() {
  const printReceipt = (
    patientInfo: TransactionConsultationData,
    opts?: {
      generatedInvoiceId?: string;
      hospitalName?: string;
      hospitalAddress?: string;
      hospitalPhone?: string;
    },
  ) => {
    const {
      generatedInvoiceId,
      hospitalName = "MedCare Hospital",
      hospitalAddress = "12 Health Avenue, Lagos",
      hospitalPhone = "+234 800 000 0000",
    } = opts ?? {};

    const invoice = patientInfo?.invoice;
    const items = invoice?.transaction_list ?? [];
    const patient = patientInfo?.patient;

    const invoiceId = invoice?.invoice_id ?? generatedInvoiceId ?? "—";
    const total = items.reduce(
      (s: number, i: { quantity: number; price: number }) =>
        s + i.quantity * i.price,
      0,
    );
    const paid = invoice?.paid_total_amount ?? 0;
    const balance = total - paid;
    const statusLabel =
      invoice?.status?.replace(/_/g, " ").toUpperCase() ?? "PENDING";

    const W = 40; // character width of the receipt

    function center(str: string) {
      const pad = Math.max(0, Math.floor((W - str.length) / 2));
      return " ".repeat(pad) + str;
    }

    function row(label: string, value: string) {
      const gap = W - label.length - value.length;
      return label + (gap > 0 ? " ".repeat(gap) : " ") + value;
    }

    function fmt2(n: number) {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(n);
    }

    function fmtD(d: string | null | undefined) {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    const lines: string[] = [
      center(`★ ${hospitalName.toUpperCase()} ★`),
      center(hospitalAddress),
      center(`Tel: ${hospitalPhone}`),
      "=".repeat(W),
      center("PATIENT INVOICE"),
      center(`[ ${statusLabel} ]`),
      "-".repeat(W),
      row("Invoice No.", invoiceId),
      row("Issued On", fmtD(invoice?.issued_on)),
      row("Due On", fmtD(invoice?.due_on)),
      row("Print Time", new Date().toLocaleString("en-GB")),
      "-".repeat(W),
      "PATIENT",
      row("Name", patient ? getFullName(patient) : "—"),
      row("Gender", patient?.gender?.toUpperCase() ?? "—"),
      row("Phone", patient?.phone ?? "—"),
      "-".repeat(W),
      "ITEMS",
      "-".repeat(W),
      ...items.flatMap(
        (
          item: {
            itemType?: string;
            details?: string;
            quantity: number;
            price: number;
          },
          idx: number,
        ) => {
          const name = (
            item.details ||
            item.itemType ||
            `Item ${idx + 1}`
          ).substring(0, 24);
          const lineTotal = fmt2(item.quantity * item.price);
          const unit = `@ ${fmt2(item.price)} x${item.quantity}`;
          return [
            row(name, lineTotal),
            `  ${unit}`,
          ];
        },
      ),
      "-".repeat(W),
      row("Subtotal", fmt2(total)),
      row("Amount Paid", fmt2(paid)),
      ...(balance > 0 ? [row("Balance Due", fmt2(balance))] : []),
      ...(balance <= 0 && paid > 0
        ? [row("Change", fmt2(Math.abs(balance)))]
        : []),
      "=".repeat(W),
      center(`TOTAL: ${fmt2(total)}`),
      ...(invoice?.payment_method
        ? [center(`Via: ${invoice.payment_method.replace(/_/g, " ").toUpperCase()}`)]
        : []),
      ...(invoice?.payment_datetime
        ? [center(`Paid: ${fmtD(invoice.payment_datetime)}`)]
        : []),
      "-".repeat(W),
      ...(invoice?.description ? [`Note: ${invoice.description}`] : []),
      ...(invoice?.additional_notes
        ? [`Additional: ${invoice.additional_notes}`]
        : []),
      "-".repeat(W),
      center(`Thank you for choosing ${hospitalName}.`),
      center("Your health is our priority."),
      "",
      center("* * * KEEP THIS RECEIPT * * *"),
      "",
      center("Powered by MedSync"),
    ];

    const receiptContent = lines.join("\n");

    // Open a clean print window
    const printWin = window.open("", "_blank", "width=400,height=700");
    if (!printWin) return;

    printWin.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt – ${invoiceId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #1a1a1a;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 24px 16px 48px;
    }

    .receipt-wrapper {
      background: #fff;
      width: 302px;
      padding: 16px 12px;
      position: relative;
      border-radius: 2px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.5);
    }

    /* Torn top edge */
    .receipt-wrapper::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 0;
      right: 0;
      height: 16px;
      background: repeating-linear-gradient(
        90deg,
        #1a1a1a 0px, #1a1a1a 6px,
        transparent 6px, transparent 12px
      );
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='302' height='16'%3E%3Cpath d='M0 8 Q12 0 24 8 Q36 16 48 8 Q60 0 72 8 Q84 16 96 8 Q108 0 120 8 Q132 16 144 8 Q156 0 168 8 Q180 16 192 8 Q204 0 216 8 Q228 16 240 8 Q252 0 264 8 Q276 16 288 8 Q300 0 302 8 L302 16 L0 16 Z' fill='black'/%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='302' height='16'%3E%3Cpath d='M0 8 Q12 0 24 8 Q36 16 48 8 Q60 0 72 8 Q84 16 96 8 Q108 0 120 8 Q132 16 144 8 Q156 0 168 8 Q180 16 192 8 Q204 0 216 8 Q228 16 240 8 Q252 0 264 8 Q276 16 288 8 Q300 0 302 8 L302 16 L0 16 Z' fill='black'/%3E%3C/svg%3E");
    }

    /* Torn bottom edge */
    .receipt-wrapper::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 16px;
      background: repeating-linear-gradient(
        90deg,
        #1a1a1a 0px, #1a1a1a 6px,
        transparent 6px, transparent 12px
      );
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='302' height='16'%3E%3Cpath d='M0 8 Q12 16 24 8 Q36 0 48 8 Q60 16 72 8 Q84 0 96 8 Q108 16 120 8 Q132 0 144 8 Q156 16 168 8 Q180 0 192 8 Q204 16 216 8 Q228 0 240 8 Q252 16 264 8 Q276 0 288 8 Q300 16 302 8 L302 0 L0 0 Z' fill='black'/%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='302' height='16'%3E%3Cpath d='M0 8 Q12 16 24 8 Q36 0 48 8 Q60 16 72 8 Q84 0 96 8 Q108 16 120 8 Q132 0 144 8 Q156 16 168 8 Q180 0 192 8 Q204 16 216 8 Q228 0 240 8 Q252 16 264 8 Q276 0 288 8 Q300 16 302 8 L302 0 L0 0 Z' fill='black'/%3E%3C/svg%3E");
    }

    pre {
      font-family: 'Share Tech Mono', 'Courier New', Courier, monospace;
      font-size: 11.5px;
      line-height: 1.55;
      color: #111;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Faint horizontal scan lines for that thermal look */
    .receipt-wrapper {
      background-image: repeating-linear-gradient(
        to bottom,
        transparent,
        transparent 1px,
        rgba(0,0,0,0.015) 1px,
        rgba(0,0,0,0.015) 2px
      );
    }

    /* Print styles */
    @media print {
      @page {
        margin: 0;
        size: 80mm auto;
      }
      body {
        background: #fff !important;
        padding: 0 !important;
      }
      .receipt-wrapper {
        box-shadow: none !important;
        width: 100% !important;
        background-image: none !important;
      }
      .receipt-wrapper::before,
      .receipt-wrapper::after {
        display: none !important;
      }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
    <div class="receipt-wrapper">
      <pre>${receiptContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    </div>

    <div class="no-print" style="display:flex;gap:10px;margin-top:8px;">
      <button
        onclick="window.print()"
        style="
          font-family: 'Share Tech Mono', monospace;
          background: #fff;
          border: 2px solid #fff;
          color: #111;
          padding: 10px 24px;
          font-size: 13px;
          cursor: pointer;
          letter-spacing: 0.08em;
          border-radius: 2px;
        "
      >
        [ PRINT ]
      </button>
      <button
        onclick="window.close()"
        style="
          font-family: 'Share Tech Mono', monospace;
          background: transparent;
          border: 2px solid #555;
          color: #aaa;
          padding: 10px 24px;
          font-size: 13px;
          cursor: pointer;
          letter-spacing: 0.08em;
          border-radius: 2px;
        "
      >
        [ CLOSE ]
      </button>
    </div>
  </div>
</body>
</html>`);

    printWin.document.close();
  };

  return { printReceipt };
}