"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiQuery, useApiMutation } from "@/hooks/api";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { Search, X, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: "Available" | "Not Available";
}

interface DoctorsResponse {
  results: Doctor[];
}

interface ShareResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: number;
  patientName: string;
  onSuccess?: () => void;
}

export function ShareResultModal({
  open,
  onOpenChange,
  testId,
  patientName,
  onSuccess,
}: ShareResultModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const { showSuccess } = useSuccessModal();

  const { data: doctorsData } = useApiQuery<DoctorsResponse>(
    ["doctors", searchQuery],
    `/laboratory/doctors/?search=${searchQuery}`,
    {
        queryKey:[  "doctors", searchQuery],
      enabled: open && searchQuery.length > 0,
    }
  );

  const shareMutation = useApiMutation("POST", `/laboratory/share/`, {
    onSuccess: () => {
      showSuccess("Test results shared successfully");
      setSearchQuery("");
      setSelectedDoctors([]);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      showSuccess("Failed to share test results");
    },
  });

  const doctors = doctorsData?.results || [];

  const handleShare = () => {
    if (selectedDoctors.length === 0) return;

    shareMutation.mutate({
      test_id: testId,
      doctor_ids: selectedDoctors,
    });
  };

  const toggleDoctor = (doctorId: number) => {
    setSelectedDoctors((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Share Patient's Lab Test</span>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded-lg">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-medium">Inter-Hospital Call</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search here"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Selected Doctors */}
          {selectedDoctors.length > 0 && (
            <div className="text-sm font-medium">
              Selected: {selectedDoctors.length}
            </div>
          )}

          {/* Doctors List */}
          <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
            {searchQuery === "" ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Start typing to search for doctors
                </p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No doctors found</p>
              </div>
            ) : (
              doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => toggleDoctor(doctor.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                    selectedDoctors.includes(doctor.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-medium">
                    {doctor.first_name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.email}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs ${
                      doctor.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {doctor.status === "Available" ? "🟢" : "🔴"}
                  </Badge>
                </button>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={
                selectedDoctors.length === 0 || shareMutation.isPending
              }
              className="flex-1 rounded-full bg-primary hover:bg-primary/90"
            >
              {shareMutation.isPending
                ? "Sharing..."
                : `Share (${selectedDoctors.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}