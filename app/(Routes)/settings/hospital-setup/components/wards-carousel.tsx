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
import type { WardBedOccupancyData } from "@/types";

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
          <CarouselItem key={ward.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{ward.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {ward.rooms?.length || 0} rooms
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
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ward.description || "No description"}
                </p>
                {ward.rooms && ward.rooms.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {ward.rooms.slice(0, 2).map((room) => (
                      <p key={room.id} className="text-xs text-foreground">
                        • {room.name} ({room.beds?.length || 0} beds)
                      </p>
                    ))}
                    {ward.rooms.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{ward.rooms.length - 2} more rooms
                      </p>
                    )}
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
    </Carousel>
  );
}
