"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionPreviewModal({
  isOpen,
  onOpenChange,
}: TransactionPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice Preview (Coming Soon)</DialogTitle>
          <DialogDescription>
            Preview and manage your transaction invoices
          </DialogDescription>
        </DialogHeader>
        <div className="py-8 text-center text-muted-foreground">
          <p>This feature is coming soon. You will be able to preview invoice details here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
