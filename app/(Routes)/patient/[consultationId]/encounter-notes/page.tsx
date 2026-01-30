"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { request } from "@/hooks/api";
import { Pagination } from "@/components/pagination";

import { EncountersTable } from "./components/encounters-table";
import { EncounterDetail } from "./components/encounter-detail";
import type { EncountersListResponse } from "@/types";

export default function EncountersPage() {
  const params = useParams();
  const consultationId = params?.consultationId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(
    null
  );
  const pageSize = 10;

  // Get current user ID (you'll need to implement this based on your auth)
  const currentUserId = ""; // TODO: Get from auth context/redux

  const queryParams = new URLSearchParams();
  if (searchQuery.trim()) {
    queryParams.append("search", searchQuery);
  }
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", pageSize.toString());

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<EncountersListResponse>({
    queryKey: [
      "encounters",
      consultationId,
      searchQuery,
      currentPage.toString(),
    ],
    queryFn: async () => {
      return request(
        `/patient/consultation/${consultationId}/encounters/?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );
    },
    enabled: !!consultationId,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleViewEncounter = (encounterId: string) => {
    setSelectedEncounterId(encounterId);
  };

  const handleBack = () => {
    setSelectedEncounterId(null);
    refetch();
  };

  const handleEditEncounter = (encounterId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit encounter:", encounterId);
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;
  const selectedEncounter = data?.results.find(
    (enc) => enc.id === selectedEncounterId
  );

  // Show detail view if an encounter is selected
  if (selectedEncounter) {
    return (
      <main className="rounded-t-2xl overflow-hidden h-full flex flex-col p-4">
        <EncounterDetail
          encounter={selectedEncounter}
          consultationId={consultationId}
          currentUserId={currentUserId}
          onBack={handleBack}
          onEdit={() => handleEditEncounter(selectedEncounter.id)}
          onRefetch={refetch}
        />
      </main>
    );
  }

  // Show list view
  return (
    <main className="rounded-t-2xl overflow-hidden h-full flex flex-col gap-4 p-4">
      {/* Header Section */}
      <Card className="p-4 space-y-4">
        {/* Encounter Count */}
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-12" />
          </div>
        ) : data ? (
          <div className="flex items-center gap-3">
            <p className="text-[17px] font-medium text-muted-foreground">
              Total Encounters
            </p>
            <p className="text-[17px] font-semibold">{data.count}</p>
          </div>
        ) : null}

        {/* Search Bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by complaints, doctor name..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 bg-transparent"
          />
        </div>
      </Card>

      {/* Table Section */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-destructive">Failed to load encounters</p>
            </div>
          ) : data?.results && data.results.length > 0 ? (
            <EncountersTable
              encounters={data.results}
              onViewEncounter={handleViewEncounter}
              onEditEncounter={handleEditEncounter}
              onRefetch={refetch}
              currentUserId={currentUserId}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No encounters found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {data && data.count > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </main>
  );
}