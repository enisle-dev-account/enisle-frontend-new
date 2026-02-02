"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyList from "@/components/empty-list";
import { request } from "@/hooks/api";
import type { Encounter, EncountersListResponse } from "@/types";
import { EncounterForm } from "./components/encounter-form";
import { useAuth } from "@/providers/auth-provider";
import {
  EmptyEncounterState,
  EncounterCard,
} from "./components/encounter-card";

export default function Page({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const { user } = useAuth();
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [encounterToEdit, setEncounterToEdit] = useState<Encounter | undefined>(
    undefined,
  );

  const { consultationId } = use(params);
  const currentUserId = user?.pk || "";

  const {
    data: encounters,
    isLoading,
    refetch,
  } = useQuery<Encounter[]>({
    queryKey: ["encounters", consultationId],
    queryFn: () =>
      request(`/patient/consultation/${consultationId}/encounters/`),
  });

  const hasEncounters = (encounters || [])?.length > 0;

  const handleRefetch = () => {
    refetch();
  };

  const handleEdit = (encounter: Encounter) => {
    setEncounterToEdit(encounter);
    setShowCreateForm(true);
  };

  const handleCreateSuccess = () => {
    handleRefetch();
    setShowCreateForm(false);
    setEncounterToEdit(undefined);
  };

  const handleFormClose = (open: boolean) => {
    setShowCreateForm(open);
    if (!open) {
      setEncounterToEdit(undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">
          Loading encounters...
        </div>
      </div>
    );
  }

  // If viewing a specific encounter
  if (selectedEncounter) {
    return (
      <EncounterCard
        encounter={selectedEncounter}
        currentUserId={currentUserId}
        consultationId={consultationId}
      />
    );
  }

  // Empty state
  if (!hasEncounters && !encounters) {
    return (
      <>
        {showCreateForm ? (
          <EncounterForm
            consultationId={consultationId}
            onCancel={() => handleFormClose(false)}
            onSuccess={() => handleCreateSuccess()}
          />
        ) : (
          <EmptyEncounterState onAdd={() => setShowCreateForm(true)} />
        )}
      </>
    );
  }

  // Single encounter - show detail directly
  if (encounters && encounters.length === 1) {
    return (
      <>
        <EncounterCard
          encounter={encounters[0]}
          currentUserId={currentUserId}
          consultationId={consultationId}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Encounter Notes</h3>
          <Button
            onClick={() => setShowCreateForm(true)}
            size="sm"
            className="rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Encounter
          </Button>
        </div>

        <div className="space-y-4">
          {encounters?.map((encounter) => (
            <div
              key={encounter.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedEncounter(encounter)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium">
                    {encounter.main_complaints.split(",")[0]}...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(encounter.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination can be added here if needed */}
      </div>
    </>
  );
}
