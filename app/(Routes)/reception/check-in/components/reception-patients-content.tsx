"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { useApiQuery } from "@/hooks/api";
import type { ReceptionConsultationResponse } from "@/types";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users } from "lucide-react";
import { TablePagination } from "@/components/table-pagination";
import { PatientsTable } from "./patients-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import EmptyList from "@/components/empty-list";

const PATIENT_TABS = [
  { value: "in_queue", label: "In Queue" },
  { value: "finished", label: "Finished" },
  { value: "canceled", label: "Canceled" },
  { value: null, label: "All Patients" },
];

export function ReceptionPatientsContent() {
  const [activeTab, setActiveTab] = useState<string | null>("in_queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (activeTab !== null && activeTab !== "all") {
      params.append("status", activeTab);
    }
    if (searchQuery.trim()) {
      params.append("search_query", searchQuery);
    }
    params.append("page", currentPage.toString());
    params.append("page_size", pageSize.toString());
    return params;
  }, [activeTab, searchQuery, currentPage, pageSize]);

  const url = `/receptionist/patients/list?${queryParams.toString()}`;

  const { data, isLoading } = useApiQuery<ReceptionConsultationResponse>(
    [
      "patients",
      activeTab ? activeTab : "",
      searchQuery,
      currentPage.toString(),
    ],
    url,
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const tabCounts = {
    in_queue: data?.results.total_in_queue || 0,
    finished: data?.results.total_finished || 0,
    canceled: data?.results.total_canceled || 0,
    all: data?.results.total_patients || 0,
  };

  const totalItems = data?.count || 0;
  const patients = data?.results.results || [];

  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b bg-background">
        {/* Tabs */}
        <Tabs
          value={activeTab ?? "all"}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 gap-8">
            {PATIENT_TABS.map((tab) => {
              const displayLabel =
                tab.value === null ? "All Patients" : tab.label;
              const count =
                tab.value === null
                  ? tabCounts.all
                  : tabCounts[tab.value as keyof typeof tabCounts];
              return (
                <TabsTrigger
                  key={tab.value ?? "all"}
                  value={tab.value ?? "all"}
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3"
                >
                  <span>
                    {displayLabel}
                    {"  "}
                  </span>
                  <span className="text-muted-foreground">
                    <Badge>{count}</Badge>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between gap-4 mt-6">
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by last name, middle name or first name"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b">
          <Card className="p-4 border-0">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex items-center text-lg gap-x-3">
                <p className="font-medium text-muted-foreground">
                  All Patients
                </p>
                <p className="font-semibold">{tabCounts.all}</p>
              </div>
            </div>
          </Card>
        </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <EmptyList title="No patients yet" description="List of patients will appear here when patients are admitted in your hospital." />
        ) : (
          <PatientsTable patients={patients} activeTab={activeTab} />
        )}
      </div>

      {/* Pagination */}
      {patients.length > 0 && (
        <div className="border-t bg-background p-6">
          <TablePagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </main>
  );
}
