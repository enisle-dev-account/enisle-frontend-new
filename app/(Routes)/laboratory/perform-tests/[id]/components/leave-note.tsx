"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useApiMutation } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";

const noteSchema = z.object({
  content: z
    .string()
    .min(1, "Note cannot be empty")
    .max(1000, "Note is too long"),
});

interface LeaveNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: number;
  patientName: string;
  onSuccess?: () => void;
}

export function LeaveNoteModal({
  open,
  onOpenChange,
  testId,
  patientName,
  onSuccess,
}: LeaveNoteModalProps) {
  const { showSuccess } = useSuccessModal();

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
  });

  const mutation = useApiMutation("POST", `/laboratory/note/create/`, {
    onSuccess: () => {
      showSuccess("Note added successfully");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      showSuccess("Failed to add note");
    },
  });

  const onSubmit = (data: z.infer<typeof noteSchema>) => {
    mutation.mutate({
      test_id: testId,
      content: data.content,
    });
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Leave a Note</span>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-medium">
              {patientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{patientName}</p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Leave a short note for this patient..."
                        className="min-h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 rounded-full"
                  disabled={mutation.isPending}
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving..." : "Proceed"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}