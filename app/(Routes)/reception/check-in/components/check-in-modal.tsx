"use client";

import { useState, useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useApiQuery, useCustomUrlApiMutation } from "@/hooks/api";
import type { CheckInExistingPatientPayload, UsersListResponseItem } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

const checkInSchema = z.object({
  doctor: z.string().optional(),
  nurse: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
//   consultation_date_time: z.string().min(1, "Consultation date and time is required"),
});

type CheckInFormData = z.infer<typeof checkInSchema>;

interface CheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientName: string;
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function CheckInModal({
  open,
  onOpenChange,
  patientId,
  patientName,
}: CheckInModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();

  const form = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      doctor: "",
      nurse: "",
      priority: "medium",
    //   consultation_date_time: "",
    },
  });

  // Fetch doctors and nurses
  const { data: userListData, isLoading: userListLoading } = useApiQuery<
    UsersListResponseItem[]
  >(
    ["receptionist", "users", "doctor,nurse"],
    "/receptionist/users/doctor,nurse"
  );

  const checkInMutation = useCustomUrlApiMutation<CheckInExistingPatientPayload>(
    "POST",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["patients"],
        });
        onOpenChange(false);
        form.reset();
        setSelectedDate(undefined);
      },
      onError: (error: any) => {
        console.log("[v0] Check-in error:", error);
        form.setError("root", {
          message: error?.message || "Failed to check in patient",
        });
      },
    }
  );

  const onSubmit = async (data: CheckInFormData) => {
    const payload: CheckInExistingPatientPayload = {
      patient: patientId,
      doctor: data.doctor || undefined,
      nurse: data.nurse || undefined,
      priority: data.priority,
      consultation_date_time: new Date().toISOString(),
    };

    await checkInMutation.mutateAsync({
      url: "/receptionist/patient/check-in/existing/",
      data: payload,
    });
  };

  const doctors = userListData?.filter((user) => user.user_type === "doctor") || [];
  const nurses = userListData?.filter((user) => user.user_type === "nurse") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold">Check In Patient</DialogTitle>
          <DialogDescription>
            Check in {patientName} for a new consultation
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nurse Field */}
            <FormField
              control={form.control}
              name="nurse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to a Nurse</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={userListLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a nurse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nurses.map((nurse) => (
                        <SelectItem key={nurse.id} value={nurse.id}>
                          {nurse.first_name} {nurse.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Doctor Field */}
            <FormField
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consulting Doctor</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={userListLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.first_name} {doctor.last_name}
                          {doctor.speciality && ` (${doctor.speciality})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority Field */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm text-red-600">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={checkInMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={checkInMutation.isPending}
                className="flex-1"
              >
                {checkInMutation.isPending ? "Checking in..." : "Check In"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
