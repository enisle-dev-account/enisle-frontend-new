"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import type { WardRoomData, WardBedData } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCustomUrlApiMutation } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { Separator } from "@/components/ui/separator";

interface RoomEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: WardRoomData | null;
  wardId: string;
  wardName: string;
}

export function RoomEditorModal({
  open,
  onOpenChange,
  room,
  wardId,
  wardName,
}: RoomEditorModalProps) {
  const [bedToDelete, setBedToDelete] = useState<number | null>(null);
  const [showDeleteRoomDialog, setShowDeleteRoomDialog] = useState(false);
  const [newBedName, setNewBedName] = useState("");
  const queryClient = useQueryClient();
  const { showSuccess } = useSuccessModal();

  const addBedMutation = useCustomUrlApiMutation("POST", {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "wards"] });
      showSuccess("Bed created successfully!");
      onOpenChange(false);
    },
  });
  const removeBedMutation = useCustomUrlApiMutation("DELETE", {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "wards"] });
      showSuccess("Bed Removed successfully!");
      setBedToDelete(null)
      onOpenChange(false);
    },
  });

  const deleteRoomMutation = useCustomUrlApiMutation("DELETE", {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "wards"] });
      showSuccess("Room deleted successfully!");
      setShowDeleteRoomDialog(false);
      onOpenChange(false);
    },
  });

  if (!room) return null;

  const handleAddBed = () => {
    addBedMutation.mutateAsync({
      url: "/hospital/ward/room/bed/add/",
      data: {
        room_id: room.id,
        description: newBedName || undefined,
      },
    });

    setNewBedName("");
  };

  const handleRemoveBed = (bedId: number) => {
    removeBedMutation.mutateAsync({
      url: "/hospital/ward/room/bed/remove/",
      data: {
        room_id: room.id,
        bed_id: bedId,
      },
    });
  };

  const handleRemoveRoom = () => {
    deleteRoomMutation.mutateAsync({
      url: "/hospital/ward/room/delete/",
      data: {
        room_id: room.id,
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-bold">Edit Room</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Room Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Room Information</h3>
              <div className="p-3 bg-primary rounded-lg">
                <p className="text-sm text-white font-medium">
                  {wardName} → {room.name}
                </p>
              </div>
            </div>

            {/* Beds Management */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  Beds ({room.beds?.length || 0})
                </h3>
              </div>

              {/* Beds List */}
              {room.beds && room.beds.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {room.beds.map((bed) => (
                    <div
                      key={bed.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1 flex gap-x-4 items-center">
                        <p className="text-sm pl-2 font-medium text-foreground">
                          {bed.name}
                        </p>
                        <Separator orientation="vertical"/>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {bed.state}
                          </Badge>
                        </div>
                        <Separator orientation="vertical"/>

                        <p>{bed.description}</p>
                      </div>
                      <Separator orientation="vertical"/>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBedToDelete(bed.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No beds in this room
                </p>
              )}

              {/* Add Bed */}
              <div className="flex gap-2">
                <Input
                  placeholder="Bed description (Optional)"
                  value={newBedName}
                  onChange={(e) => setNewBedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddBed();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddBed}
                  size="sm"
                  className="gap-2"
                  disabled={addBedMutation.isPending}
                >
                  <Plus
                    className={cn("h-4 w-4", {
                      "animate-spin": addBedMutation.isPending,
                    })}
                  />
                  Add
                </Button>
              </div>
            </div>

            {/* Delete Room Section */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => setShowDeleteRoomDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Room
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This action will remove the room and all its beds permanently.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Room Confirmation Dialog */}
      <AlertDialog
        open={showDeleteRoomDialog}
        onOpenChange={setShowDeleteRoomDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <AlertDialogTitle>Delete Room?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to delete "{room.name}" and all{" "}
                  {room.beds?.length || 0} beds connected to this room. This
                  action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button
              disabled={deleteRoomMutation.isPending}
              onClick={handleRemoveRoom}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteRoomMutation.isPending ? "Deleting..." : "Delete Room"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Bed Confirmation Dialog */}
      <AlertDialog
        open={bedToDelete !== null}
        onOpenChange={() => setBedToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <AlertDialogTitle>Remove Bed?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this bed from the room? This
                  action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                if (bedToDelete !== null) {
                  handleRemoveBed(bedToDelete);
                }
              }}
              disabled={removeBedMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {removeBedMutation.isPending ? "Removing..." : "Remove Bed"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
