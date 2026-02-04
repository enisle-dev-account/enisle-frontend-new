"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit2, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WardBedOccupancyData, WardRoomData } from "@/types";
import { Icon } from "@/components/icon";
import { RoomEditorModal } from "./room-editor-modal";

interface WardsCarouselProps {
  wards: WardBedOccupancyData[];
  onEdit: (ward: WardBedOccupancyData) => void;
  onDelete: (wardId: string) => void;
}

export default function WardsCarousel({
  wards,
  onEdit,
  onDelete,
}: WardsCarouselProps) {
  const [selectedRoom, setSelectedRoom] = useState<WardRoomData | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<string>("");
  const [selectedWardName, setSelectedWardName] = useState<string>("");
  const [roomEditorOpen, setRoomEditorOpen] = useState(false);

  const handleEditRoom = (
    room: WardRoomData,
    wardId: string,
    wardName: string,
  ) => {
    setSelectedRoom(room);
    setSelectedWardId(wardId);
    setSelectedWardName(wardName);
    setRoomEditorOpen(true);
  };

  if (wards.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
        <p className="text-muted-foreground">No wards yet</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {wards.map((ward) => (
          <CarouselItem
            key={ward.id}
            className="md:basis-1/2 lg:basis-1/3 py-1 mx-1"
          >
            <Card className="h-full pt-0 border-[#E9EBF2]">
              <CardHeader className=" relative bg-[#FCF3FF] h-full pt-8 flex items-center justify-center ">
                <Icon name="ward" size={100} className="fill-none" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 absolute top-2 right-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(ward)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(ward.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex gap-x-3">
                    <CardTitle className="text-base">{ward.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {ward.rooms?.length || 0} rooms
                    </CardDescription>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ward.description || "No description"}
                </p>
                {ward.rooms && ward.rooms.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 h-14.25">
                      {ward.rooms.slice(0, 6).map((room) => (
                        <div
                          key={room.id}
                          onClick={() =>
                            handleEditRoom(room, ward.id, ward.name)
                          }
                          className="group h-fit flex items-center gap-1.5 px-2.5 py-1 bg-accent border border-transparent hover:border-muted-foreground/20 rounded-full cursor-pointer transition-all"
                        >
                          <span className="text-[10px] font-medium text-secondary-foreground whitespace-nowrap">
                            {room.name}
                            <span className="ml-1 opacity-60">
                              ({room.beds?.length || 0})
                            </span>
                          </span>
                          <Pencil className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}

                      {ward.rooms.length > 6 && (
                        <div className="px-2.5 py-1 bg-muted/30 rounded-full border border-dashed">
                          <p className="text-[10px] font-medium text-muted-foreground">
                            +{ward.rooms.length - 6} more
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {wards.length > 3 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}

      <RoomEditorModal
        open={roomEditorOpen}
        onOpenChange={setRoomEditorOpen}
        room={selectedRoom}
        wardId={selectedWardId}
        wardName={selectedWardName}
      />
    </Carousel>
  );
}
