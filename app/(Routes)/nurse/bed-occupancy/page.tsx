"use client";

import { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/api";
import type { WardBedOccupancyData } from "@/types";
import { BedOccupancyContent } from "./components/bed-occupancy-content";

export default function BedOccupancyPage() {
  const [selectedWardId, setSelectedWardId] = useState<string>("");

  const { data: wards = [], isLoading } = useApiQuery<WardBedOccupancyData[]>(
    ["hospital", "wards"],
    "/hospital/wards/list/"
  );

  const selectedWard = useMemo(() => {
    if (!selectedWardId && wards.length > 0) {
      setSelectedWardId(wards[0].id);
      return wards[0];
    }
    return wards.find((w) => w.id === selectedWardId);
  }, [wards, selectedWardId]);

  return (
    <main className="rounded-t-2xl bg-background overflow-hidden p-6 h-full">
    <div className="flex h-full gap-6">
      <div className="w-56 border-r border-border pr-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-semibold text-lg">Wards</h2>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading wards...</p>
          ) : wards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No wards available</p>
          ) : (
            wards.map((ward) => (
              <button
                key={ward.id}
                onClick={() => setSelectedWardId(ward.id)}
                className={`w-full text-left px-4 py-4 rounded-md transition-colors text-sm ${
                  selectedWardId === ward.id
                    ? "bg-[#f3f3f4] text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {ward.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedWard ? (
          <BedOccupancyContent ward={selectedWard} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a ward to view beds</p>
          </div>
        )}
      </div>
    </div>

    </main>
  );
}
