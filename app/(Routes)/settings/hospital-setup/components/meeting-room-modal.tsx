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
import type { MeetingRoomInfo } from "@/types";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface MeetingRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: MeetingRoomInfo | null;
  onSave: (data: RoomFormData) => void;
  isLoading: boolean;
}

export default function MeetingRoomModal({
  open,
  onOpenChange,
  room,
  onSave,
  isLoading,
}: MeetingRoomModalProps) {
  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room?.name || "",
      description: room?.description || "",
    },
  });

  useEffect(() => {
    if (room) {
      form.reset({
        name: room.name,
        description: room.description,
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [room, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {room ? "Edit Meeting Room" : "Add Meeting Room"}
          </DialogTitle>
          <DialogDescription>
            {room
              ? "Update meeting room details"
              : "Create a new meeting room"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSave)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room name"
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter room description"
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
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
