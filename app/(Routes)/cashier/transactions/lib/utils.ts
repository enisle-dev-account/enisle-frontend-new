import { TransactionConsultationData } from "@/types/cashier";

export function getFullName(p: TransactionConsultationData["patient"]) {
  return [p.first_name, p.middle_name, p.surname].filter(Boolean).join(" ");
}