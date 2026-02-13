import { ImportProductTypes } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function capitalizeNames(...names: Array<string | null | undefined>): string {
    return names
        .filter((n): n is string => typeof n === "string" && n.trim().length > 0)
        .map(n => {
            const s = n.trim()
            return s[0].toUpperCase() + s.slice(1)
        })
        .join(" ")
}


export function getBillingStatusColor(status: string | null) {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800 py-[0.375rem] px-[0.6875rem] border-none";
    case "pending":
      return "bg-yellow-100 text-yellow-800 py-[0.375rem] px-[0.6875rem] border-none";
    case "unpaid":
      return "bg-red-100 text-red-800 py-[0.375rem] px-[0.6875rem] border-none";
    default:
      return "bg-gray-100 text-gray-800 py-[0.375rem] px-[0.6875rem] border-none";
  }
}

export function getConsultationStatusColor(status: string | null) {
  switch (status?.toLowerCase()) {
    case "in_queue":
      return "bg-blue-100 text-blue-800 py-[0.375rem] px-[0.6875rem] border-none";
    case "completed":
      return "bg-green-100 text-green-800 py-[0.375rem] px-[0.6875rem] border-none";
    case "canceled":
      return "bg-red-100 text-red-800 py-[0.375rem] px-[0.6875rem] border-none";
    default:
      return "bg-gray-100 text-gray-800 py-[0.375rem] px-[0.6875rem] border-none";
  }
}


export function getAdmissionStatusColor(status: boolean) {
  switch (status) {
    case true:
      return "bg-blue-100 text-blue-800 py-[0.375rem] px-[0.6875rem] border-none";
    case false:
      return "bg-yellow-100 text-yellow-800 py-[0.375rem] px-[0.6875rem] border-none";
    default:
      return "bg-gray-100 text-gray-800 py-[0.375rem] px-[0.6875rem] border-none";
  }
}

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const getCSVHeader = (csvType: ImportProductTypes) => {
  return {
    product: [
      "title",
      "sku",
      "categories",
      "description",
      "price",
      "currency",
      "stock",
      "availability",
      "vendor",
      "type",
    ],
    medicine: [],
    staff: [],
  }[csvType];
};

export const getCSVContent = (csvType: ImportProductTypes) => {
  return {
    product: [
      "Disposable Syringe,SYR-99,surgical_products,5ml sterile syringe,1.20,USD,1000,available,SafeInject,Surgical",
      "Latex Gloves,GLV-01,protective_products,Size Large Powder-free,15.00,USD,200,available,HealthGuard,Protective",
    ],
    medicine: [],
    staff: [],
  }[csvType];
};


export const getInitials = (first: string, last: string) => {
  return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
};


export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    dispensed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};


export function zFill(num: number | string, width: number): string {
  const numStr = String(num);
  return numStr.padStart(width, "0");
}

export function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}


export function statusInvoiceColor(status: string) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending_confirmation: "bg-amber-100 text-amber-700 border-amber-200",
    initiated: "bg-blue-100 text-blue-700 border-blue-200",
    declined: "bg-red-100 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
}