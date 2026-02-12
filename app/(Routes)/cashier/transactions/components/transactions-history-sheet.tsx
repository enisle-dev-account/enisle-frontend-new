"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { TransactionConsultationData } from "@/types/cashier";

interface TransactionsHistorySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  consultations: TransactionConsultationData[];
}

export function TransactionsHistorySheet({
  isOpen,
  onOpenChange,
  consultations,
}: TransactionsHistorySheetProps) {
  const getFullName = (firstName: string, middleName: string, surname: string) => {
    return [firstName, middleName, surname].filter(Boolean).join(" ");
  };

  const getPayingForText = (consultation: TransactionConsultationData) => {
    const payingFor = consultation.transactions.map((t) =>
      t.transaction.paying_for.charAt(0).toUpperCase() +
      t.transaction.paying_for.slice(1).toLowerCase()
    );

    if (payingFor.length <= 3) {
      return payingFor.join(", ");
    }
    return `${payingFor.slice(0, 3).join(", ")} +${payingFor.length - 3}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-3/4 lg:w-1/2">
        <SheetHeader>
          <SheetTitle>Transaction History (Coming Soon)</SheetTitle>
        </SheetHeader>
        <div className="mt-6 text-muted-foreground text-sm">
          <p>This feature is coming soon. Full transaction history with invoice details will be available here.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
