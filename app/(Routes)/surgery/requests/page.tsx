"use client";

import { useState, useCallback, useMemo } from "react";
import { Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/api";

import type { SurgeryPatientsDataResponse } from "@/types";
import { Pagination } from "@/components/pagination";
import EmptyList from "@/components/empty-list";
import { SurgeryTable } from "./components/surgery-table";
import { DoctorPatientsTableSkeleton } from "../../patient/components/skeletons/table-skeleton";

const SURGERY_TABS = [
  { value: "In - Patients", label: "In - Patients", apiValue: "admitted" },
  { value: "Out - Patients", label: "Out - Patients", apiValue: "out_patient" },
];

export default function SurgeryPage() {
  const [activeTab, setActiveTab] = useState<string>("In - Patients");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    const currentTabConfig = SURGERY_TABS.find(
      (tab) => tab.value === activeTab,
    );
    if (currentTabConfig) {
      params.append("status", currentTabConfig.apiValue);
    }
    if (searchQuery.trim()) params.append("search_query", searchQuery);
    params.append("page", currentPage.toString());
    params.append("page_size", pageSize.toString());
    return params;
  }, [activeTab, searchQuery, currentPage, pageSize]);

  const url = `/surgery/consultations/list/?${queryParams.toString()}`;

  const {
    data: resp,
    isLoading,
    error,
    refetch,
  } = useApiQuery<SurgeryPatientsDataResponse>(
    ["surgery-patients", activeTab, searchQuery, currentPage.toString()],
    url,
  );

  console.log(resp);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const data = resp?.results;
  const surgeries = data?.patients || [];

  const tabCounts = {
    "In - Patients": data?.in_patient || 0,
    "Out - Patients": data?.out_patient || 0,
  };

  return (
    <main className="overflow-hidden gap-6 flex flex-col">
      {/* Header Section */}
      <div className="p-4 rounded-2xl bg-background">
        {/* Tabs with Colored Badges */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-fit justify-start rounded-none bg-transparent p-0 gap-8">
            {SURGERY_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3 items-center"
              >
                <span>{tab.label}</span>
                <span
                  className={`flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] text-white ${
                    tab.value === "In - Patients" ? "bg-gray-500" : "bg-red-400"
                  }`}
                >
                  {tabCounts[tab.value as keyof typeof tabCounts]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 mt-2">
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

      {/* Table Section */}
      <div className="flex-1 overflow-auto min-h-80 pb-5 h-full flex flex-col items-center justify-start bg-background rounded-2xl">
        <div className="bg-background w-full">
          <div className="p-4 border-0">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-md">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center text-lg gap-x-3">
                  <p className="font-medium text-muted-foreground">
                    {activeTab}
                  </p>
                  <p className="font-semibold">
                    {String(
                      tabCounts[activeTab as keyof typeof tabCounts],
                    ).padStart(2, "0")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <DoctorPatientsTableSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-destructive">Failed to load surgery patients</p>
          </div>
        ) : surgeries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full">
            <EmptyList
              showRefresh
              onRefresh={() => refetch()}
              title="No surgery patients found"
              description="New surgery patients will appear here when they are registered."
            />
          </div>
        ) : (
          <div className="bg-background w-full space-y-2 rounded-2xl px-4">
            <SurgeryTable surgeries={surgeries} activeTab={activeTab} />
          </div>
        )}
      </div>

      {/* Pagination */}
      {surgeries.length > 0 && (
        <Pagination
          totalPages={resp?.count ? Math.ceil(resp.count / pageSize) : 1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}
