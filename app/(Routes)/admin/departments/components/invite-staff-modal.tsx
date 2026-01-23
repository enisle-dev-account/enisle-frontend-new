"use client";
import { useState } from "react";
import { useApiMutation } from "@/hooks/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSuccessModal } from "@/providers/success-modal-provider";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  position: z.string().optional(),
  speciality: z.string().optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const ROLES = [
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "laboratory", label: "Laboratory Staff" },
  { value: "radiology", label: "Radiology Staff" },
  { value: "reception", label: "Reception" },
  { value: "cashier", label: "Cashier" },
  { value: "store", label: "Store Manager" },
  { value: "surgery", label: "Surgery Staff" },
];

const POSITIONS = [
  "Chief Administrator",
  "Senior Nurse",
  "Physician",
  "Pharmacist",
  "Surgeon",
  "Lead",
];

const SPECIALTIES = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Surgery",
  "Oncology",
  "Radiology",
  "Psychiatry",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Anesthesia",
];

interface InviteStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  setViewMode: React.Dispatch<React.SetStateAction<"invitations" | "staff">>
}

export function InviteStaffModal({
  open,
  onOpenChange,
  onSuccess,
  setViewMode
}: InviteStaffModalProps) {
  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "",
      position: "",
      speciality: "",
    },
  });
  const { showSuccess } = useSuccessModal();

  const mutation = useApiMutation<any>("POST", "/auth/invite-staff/", {
    onSuccess: () => {
      showSuccess("Invitation sent successfully!");
      form.reset();
      setViewMode("invitations");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.log("[v0] Invite error:", error);
    },
  });

  const onSubmit = (data: InviteFormData) => {
    const mutateData: Record<string, any> = {
      email: data.email,
      role: data.role,
      position: data.position,
    };

    if (form.watch("role") === "doctor" && data.speciality) {
      mutateData.speciality = data.speciality;
    }
    mutation.mutate(mutateData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new staff member to join your hospital
          </DialogDescription>
        </DialogHeader>


        {mutation.error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {(mutation.error as any)?.message || "Failed to send invitation"}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="staff@example.com"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a position (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {POSITIONS.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional</FormDescription>
                </FormItem>
              )}
            />

            {form.watch("role") === "doctor" && (
              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a specialty (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPECIALTIES.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Optional</FormDescription>
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
