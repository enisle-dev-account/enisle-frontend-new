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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { WardBedOccupancyData, WardResponse } from "@/types";
import { UseMutationResult } from "@tanstack/react-query";

const wardSchema = z.object({
  name: z.string().min(1, "Ward name is required"),
  description: z.string().optional(),
  rooms: z.coerce.number().min(1, "Number of rooms is required"),
});

type WardFormData = z.infer<typeof wardSchema>;

interface WardBedsFormData {
  beds: Record<number, number>;
}

interface WardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ward: WardBedOccupancyData | null;
  isLoading: boolean;
  createWardMutation: UseMutationResult<any, Error, any, unknown>;
  updateWardMutation: UseMutationResult<any, Error, any, unknown>;
  createWardBedMutation: UseMutationResult<any, Error, any, unknown>;
}

export default function WardModal({
  open,
  onOpenChange,
  ward,
  isLoading,
  createWardMutation,
  updateWardMutation,
  createWardBedMutation,
}: WardModalProps) {
  const form = useForm<WardFormData>({
    resolver: zodResolver(wardSchema),
    defaultValues: {
      name: "",
      description: "",
      rooms: 0,
    },
  });
  const formBed = useForm<WardBedsFormData>({
    defaultValues: {
      beds: {},
    },
  });

  const [step, setStep] = useState(0);
  const [resultWard, setResultWard] = useState<WardResponse | null>(null);

  useEffect(() => {
    if (ward) {
      form.reset({
        name: ward.name,
        description: ward.description,
        rooms: ward.rooms?.length || 0,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        rooms: 0,
      });
    }
  }, [ward, open]);

  const handleSubmit = async (data: WardFormData) => {
    if (!ward) {
      const res: WardResponse = await createWardMutation.mutateAsync({
        url: "/hospital/wards/create/",
        data,
      });

      if (res.status === "Ward created successfully") {
        setStep(1);
        setResultWard(res);
      }
    } else {
      updateWardMutation.mutateAsync({
        url: `/hospital/wards/update/${ward.id}/`,
        data,
      });
    }
  };

  const handleFormBedSubmit = async (data: WardBedsFormData) => {
    // Transform the beds object to the expected payload format
    const bedData = Object.entries(data.beds).map(([roomId, bedCount]) => ({
      room: parseInt(roomId),
      beds: bedCount,
    }));

    await createWardBedMutation.mutateAsync({
      url: "/hospital/wards/beds/create/",
      method: "POST",
      data: { data: bedData },
    });

    // Reset and close modal after successful creation
    setResultWard(null);
    setStep(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ward ? "Edit Ward" : "Add Ward"}
          </DialogTitle>
          <DialogDescription>
            {ward ? "Update ward details" : "Create a new ward"}
          </DialogDescription>
        </DialogHeader>

        {step === 0 ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ward name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter ward description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Rooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of rooms"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Next Step"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...formBed}>
            <form
              onSubmit={formBed.handleSubmit(handleFormBedSubmit)}
              className="space-y-4"
            >
              {resultWard?.rooms.map((room) => (
                <FormField
                  key={room.id}
                  control={formBed.control}
                  name={`beds.${room.id}` as "beds"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{room.name}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={`Enter number of beds for ${room.name}`}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
