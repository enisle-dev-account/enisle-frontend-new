import { ImportProductTypes } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeNames(
  ...names: Array<string | null | undefined>
): string {
  return names
    .filter((n): n is string => typeof n === "string" && n.trim().length > 0)
    .map((n) => {
      const s = n.trim();
      return s[0].toUpperCase() + s.slice(1);
    })
    .join(" ");
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