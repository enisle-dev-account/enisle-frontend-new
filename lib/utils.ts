import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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