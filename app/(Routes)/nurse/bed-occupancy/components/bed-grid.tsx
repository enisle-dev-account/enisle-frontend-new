"use client";

import type { WardBedData } from "@/types";

interface WardBedDataWithRoomName extends WardBedData {
    roomName: string;
}

interface BedGridProps {
  beds: WardBedDataWithRoomName[];
  selectedBed: WardBedData | null;
  onBedSelect: (bed: WardBedData) => void;
}

export function BedGrid({ beds, selectedBed, onBedSelect }: BedGridProps) {
  const getStatusColor = (state: string): string => {
    const lowerState = state.toLowerCase();
    if (lowerState === "not ready") return "bg-green-200 hover:bg-green-300";
    if (lowerState === "arrived") return "bg-purple-200 hover:bg-purple-300";
    if (lowerState === "open") return "bg-blue-200 hover:bg-blue-300";
    if (lowerState === "admitted") return "bg-gray-900 text-white hover:bg-gray-800 shadow-lg";
    if (lowerState === "hold") return "bg-blue-900 hover:bg-blue-800 text-white";
    if (lowerState === "wait") return "bg-blue-100 hover:bg-blue-200";
    if (lowerState === "registered")
      return "bg-pink-200 hover:bg-pink-300";
    return "bg-gray-200 hover:bg-gray-300";
  };

  if (beds.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">No beds found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-6 p-6 bg-muted/50 rounded-lg">
      {beds.map((bed) => (
        <button
          key={bed.id}
          onClick={() => onBedSelect(bed)}
          className={`
            aspect-square rounded-lg flex flex-col items-center justify-center font-semibold
            transition-all cursor-pointer shadow-lg
            ${getStatusColor(bed.state)}
            ${
              selectedBed?.id === bed.id
                ? "ring-2 ring-primary ring-offset-2 scale-105"
                : ""
            }
          `}
        >

          <span className="font-semibold text-sm">{`RM-${bed.roomName.split(" ")[1]}`}</span>
                        <span>{String(bed.name).padStart(2, "0")}</span>
        </button>
      ))}
    </div>
  );
}
