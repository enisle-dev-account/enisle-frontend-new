"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MeetingRoomInfo } from "@/types";

interface MeetingRoomsCarouselProps {
  rooms: MeetingRoomInfo[];
  onEdit: (room: MeetingRoomInfo) => void;
  onDelete: (roomId: string) => void;
}

export default function MeetingRoomsCarousel({
  rooms,
  onEdit,
  onDelete,
}: MeetingRoomsCarouselProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
        <p className="text-muted-foreground">No meeting rooms yet</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {rooms.map((room) => (
          <CarouselItem key={room.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{room.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {room.room_type}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(room)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(room.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description || "No description"}
                </p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {rooms.length > 3 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}
