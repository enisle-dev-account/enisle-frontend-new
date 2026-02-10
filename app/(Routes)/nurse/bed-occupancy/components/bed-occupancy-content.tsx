"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import type { WardBedOccupancyData, WardRoomData, WardBedData } from "@/types";
import { BedStatusLegend } from "./bed-status-legend";
import { BedGrid } from "./bed-grid";
import { PatientDetailsPanel } from "./patient-details-panel";
import { EmptyPatientDetailsPanel } from "./empty-bed-details-page";

export function BedOccupancyContent({ ward }: { ward: WardBedOccupancyData }) {
  const [patientSearch, setPatientSearch] = useState("");
  const [bedSearch, setBedSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedBed, setSelectedBed] = useState<WardBedData | null>(null);

  const rooms = useMemo(() => {
    return ward.rooms;
  }, [ward.rooms]);

  useEffect(() => {
    if (ward.rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(ward.rooms[0].id);
    }
  }, [ward.rooms, selectedRoom]);

  useEffect(() => {
    setSelectedRoom("all");
  }, [ward]);

const allBedsInSelection = useMemo(() => {
    if (selectedRoom === "all") {
        return ward.rooms.flatMap((room) =>
            room.beds.map((bed) => ({
                ...bed,
                roomName: room.name,
            })),
        );
    }
    const currentRoom = rooms.find((r) => r.id === selectedRoom);
    if (!currentRoom) return [];
    return currentRoom.beds.map((bed) => ({
        ...bed,
        roomName: currentRoom.name,
    }));
}, [selectedRoom, ward.rooms, rooms]);

  const filteredBeds = useMemo(() => {
    return allBedsInSelection.filter((bed) => {
      if (
        bedSearch &&
        !bed.name.toLowerCase().includes(bedSearch.toLowerCase())
      ) {
        return false;
      }

      if (patientSearch) {
        if (!bed.patient_consultation?.patient) {
          return false;
        }
        const patientName =
          `${bed.patient_consultation.patient.first_name} ${bed.patient_consultation.patient.surname}`.toLowerCase();
        if (!patientName.includes(patientSearch.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [patientSearch, bedSearch, allBedsInSelection]);

  const bedStatusCounts = useMemo(() => {
    const counts = {
      notReady: 0,
      arrived: 0,
      open: 0,
      admitted: 0,
      hold: 0,
      wait: 0,
      registered: 0,
    };

    allBedsInSelection.forEach((bed) => {
      const state = bed.state.toLowerCase();
      if (state === "not ready") counts.notReady++;
      else if (state === "arrived") counts.arrived++;
      else if (state === "open") counts.open++;
      else if (state === "admitted") counts.admitted++;
      else if (state === "hold") counts.hold++;
      else if (state === "wait") counts.wait++;
      else if (state === "registered") counts.registered++;
    });

    return counts;
  }, [allBedsInSelection]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patient first or last name"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="w-32">
            <Input
              placeholder="Bed No."
              value={bedSearch}
              onChange={(e) => setBedSearch(e.target.value)}
            />
          </div>

          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <BedStatusLegend counts={bedStatusCounts} />
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {allBedsInSelection.length > 0 ? (
            <BedGrid
              beds={filteredBeds}
              selectedBed={selectedBed}
              onBedSelect={setSelectedBed}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No beds available</p>
            </div>
          )}
        </div>

        {selectedBed?.patient_consultation && selectedBed.state === 'admitted'  ? (
          <div className="w-80 border-l border-border pl-6">
            <PatientDetailsPanel bed={selectedBed} />
          </div>
        ) : (
          <div className="w-80 border-l border-border pl-6">
            <EmptyPatientDetailsPanel />
          </div>
        )}
      </div>
    </div>
  );
}