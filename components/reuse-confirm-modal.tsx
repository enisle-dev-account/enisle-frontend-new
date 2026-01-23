import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConfirmActionProps {
  triggerText: string;
  title: string;
  description: string;
  actionText: string;
  onConfirm: () => Promise<any>;
  variant?: "default" | "destructive" | "outline" | "secondary";
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  isPending?: boolean; // Optional: pass mutation.isPending from parent
}

export function ConfirmAction({
  triggerText,
  title,
  description,
  actionText,
  onConfirm,
  variant = "destructive",
  open,
  setOpen,
  isPending = false,
}: ConfirmActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = isPending || isLoading;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await onConfirm();
      
      // Only close if successful
      if (res?.status !== "error") {
        setOpen(false);
        setError(null);
      } else {
        setError(res.message || "An error occurred");
      }
    } catch (error: any) {
      console.error("Confirmation error:", error);
      setError(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset error when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null);
    }
    setOpen(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-md">
            <p className="text-red-700 text-sm font-medium flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 shrink-0" />
              {error}
            </p>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button 
            onClick={handleConfirm} 
            disabled={loading}
            variant={variant}
          >
            {loading ? "Processing..." : actionText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}