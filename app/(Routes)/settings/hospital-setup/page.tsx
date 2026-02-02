"use client";

import { useState } from "react";
import { useApiQuery, useCustomUrlApiMutation } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import type { MeetingRoomInfo, WardBedOccupancyData } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MeetingRoomModal from "./components/meeting-room-modal";
import WardModal from "./components/ward-modal";
import MeetingRoomsCarousel from "./components/meeting-rooms-carousel";
import WardsCarousel from "./components/wards-carousel";
import ConfirmDeleteDialog from "./components/confirm-delete-dialog";

export default function HospitalSetupPage() {
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [wardModalOpen, setWardModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"room" | "ward" | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoomInfo | null>(
    null,
  );
  const [selectedWard, setSelectedWard] = useState<WardBedOccupancyData | null>(
    null,
  );

  const queryClient = useQueryClient();

  // Fetch meeting rooms
  const { data: meetingRooms = [] } = useApiQuery<MeetingRoomInfo[]>(
    ["hospital", "rooms"],
    "/hospital/room/list/",
  );

  // Fetch wards
  const { data: wards = [] } = useApiQuery<WardBedOccupancyData[]>(
    ["hospital", "wards"],
    "/hospital/wards/list/",
  );

  // Meeting room mutations
  const createRoomMutation = useCustomUrlApiMutation<{
    rooms: {
      id: number;
      name: string;
    }[];
  }>("POST", {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "rooms"] });
      setRoomModalOpen(false);
      setSelectedRoom(null);
      console.log(res);
    },
  });

  const updateRoomMutation = useCustomUrlApiMutation<{
    name: string;
    description: string;
  }>("PATCH", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "rooms"] });
      setRoomModalOpen(false);
      setSelectedRoom(null);
    },
  });

  const deleteRoomMutation = useCustomUrlApiMutation("DELETE", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "rooms"] });
      setDeleteConfirmOpen(false);
      setSelectedItem(null);
    },
  });

  // Ward mutations
  const createWardMutation = useCustomUrlApiMutation<any>("POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "wards"] });
    },
  });

  const createWardBedMutation = useCustomUrlApiMutation<any>("POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "wards"] });
      setWardModalOpen(false);
      setSelectedWard(null);
    },
  });

  const updateWardMutation = useCustomUrlApiMutation<any>("PATCH", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "wards"] });
      setWardModalOpen(false);
      setSelectedWard(null);
    },
  });

  const deleteWardMutation = useCustomUrlApiMutation("DELETE", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "wards"] });
      setDeleteConfirmOpen(false);
      setSelectedItem(null);
    },
  });

  // Meeting room handlers
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setRoomModalOpen(true);
  };

  const handleEditRoom = (room: MeetingRoomInfo) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    setSelectedItem(roomId);
    setDeleteType("room");
    setDeleteConfirmOpen(true);
  };

  const handleSaveRoom = (data: { name: string; description?: string }) => {
    if (selectedRoom) {
      updateRoomMutation.mutateAsync({
        url: `/hospital/room/edit/${selectedRoom.id}/`,
        data,
      });
    } else {
      createRoomMutation.mutateAsync({
        url: "/hospital/room/create/",
        data,
      });
    }
  };

  // Ward handlers
  const handleAddWard = () => {
    setSelectedWard(null);
    setWardModalOpen(true);
  };

  const handleEditWard = (ward: WardBedOccupancyData) => {
    setSelectedWard(ward);
    setWardModalOpen(true);
  };

  const handleDeleteWard = (wardId: string) => {
    setSelectedItem(wardId);
    setDeleteType("ward");
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    if (deleteType === "room") {
      await deleteRoomMutation.mutateAsync({
        url: `/hospital/room/delete/${selectedItem}/`,
      });
    } else if (deleteType === "ward") {
      await deleteWardMutation.mutateAsync({
        url: `/hospital/wards/delete/${selectedItem}/`,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hospital Set Up</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Set up your hospital wards, meeting rooms and other spaces.
        </p>
      </div>

      {/* Meeting Rooms Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Meeting Room
            </h2>
            <p className="text-sm text-muted-foreground">
              Apps already connected to the system
            </p>
          </div>
          <Button onClick={handleAddRoom} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Room
          </Button>
        </div>
        <MeetingRoomsCarousel
          rooms={meetingRooms}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
        />
      </div>

      {/* Wards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Wards</h2>
            <p className="text-sm text-muted-foreground">
              Apps already connected to the system
            </p>
          </div>
          <Button onClick={handleAddWard} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Ward
          </Button>
        </div>
        <WardsCarousel
          wards={wards}
          onEdit={handleEditWard}
          onDelete={handleDeleteWard}
        />
      </div>

      {/* Modals */}
      <MeetingRoomModal
        open={roomModalOpen}
        onOpenChange={setRoomModalOpen}
        room={selectedRoom}
        onSave={handleSaveRoom}
        isLoading={createRoomMutation.isPending || updateRoomMutation.isPending}
      />

      <WardModal
        open={wardModalOpen}
        onOpenChange={setWardModalOpen}
        ward={selectedWard}
        isLoading={createWardMutation.isPending || updateWardMutation.isPending || createWardBedMutation.isPending}
        createWardMutation={createWardMutation}
        updateWardMutation={updateWardMutation}
        createWardBedMutation={createWardBedMutation}
      />

      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={deleteType === "room" ? "Delete Meeting Room?" : "Delete Ward?"}
        description={
          deleteType === "room"
            ? "Are you sure you want to delete this meeting room?"
            : "Are you sure you want to delete this ward?"
        }
        onConfirm={handleConfirmDelete}
        isLoading={deleteRoomMutation.isPending || deleteWardMutation.isPending}
      />
    </div>
  );
}
