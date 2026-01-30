"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { request } from "@/hooks/api";

import type { DoctorConsultationResponse, ConsultationStatus } from "@/types";
import { Pagination } from "@/components/pagination";
import { ProductsTableSkeleton } from "../../store/product/components/skeletons/table-skeleton";
import { ConsultationsTable } from "./components/consultation-table";

const CONSULTATION_TABS = [
  { value: "in_queue", label: "In Queue" },
  { value: "checkout", label: "Checkout" },
  { value: "finished", label: "Finished" },
  { value: "canceled", label: "Canceled" },
];

export default function DoctorConsultationPage() {
  const [activeTab, setActiveTab] = useState<ConsultationStatus>("in_queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (activeTab !== null) {
      params.append("status", activeTab);
    }
    if (searchQuery.trim()) {
      params.append("search_query", searchQuery);
    }
    params.append("page", currentPage.toString());
    params.append("page_size", pageSize.toString());
    return params;
  }, [activeTab, searchQuery, currentPage, pageSize]);

  const url = `/doctor/consultations/list/?${queryParams.toString()}`;

  const { data, isLoading, error } = useQuery<DoctorConsultationResponse>({
    queryKey: [
      "doctor-consultations",
      activeTab ?? "all",
      searchQuery,
      currentPage.toString(),
    ],
    queryFn: async () => {
      return request(url, {
        method: "GET",
      });
    },
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ConsultationStatus);
    setCurrentPage(1);
  };

  const tabCounts = {
    in_queue: data?.results.in_queue || 0,
    checkout: data?.results.checkout || 0,
    finished: data?.results.finished || 0,
    canceled: data?.results.canceled || 0,
  };

  const totalItems = data?.count || 0;
  const consultations = data?.results.consultations || [];

  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b bg-background">
        {/* Tabs */}
        <Tabs
          value={activeTab ?? "in_queue"}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 gap-8">
            {CONSULTATION_TABS.map((tab) => {
              const count = tabCounts[tab.value as keyof typeof tabCounts];

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3"
                >
                  <span>{tab.label}</span>
                  {isLoading ? (
                    <Skeleton className="h-6 w-8 rounded-full" />
                  ) : (
                    <Badge
                      variant={
                        tab.value === "canceled" ? "destructive" : "secondary"
                      }
                      className={
                        tab.value === "canceled"
                          ? ""
                          : "bg-muted text-foreground"
                      }
                    >
                      {count}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Search Bar */}
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

      {/* Summary Card */}
      <div className="px-6 py-4 border-b">
        <Card className="p-4 border-0">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex items-center text-lg gap-x-3">
                <p className="font-medium text-muted-foreground">
                  {activeTab === "in_queue"
                    ? "In Queue"
                    : activeTab === "checkout"
                    ? "Checkout"
                    : activeTab === "finished"
                    ? "Finished"
                    : "Canceled"}
                </p>
                <p className="font-semibold">
                  {activeTab === "in_queue"
                    ? String(tabCounts.in_queue).padStart(2, "0")
                    : activeTab === "checkout"
                    ? String(tabCounts.checkout).padStart(2, "0")
                    : activeTab === "finished"
                    ? tabCounts.finished
                    : tabCounts.canceled}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <ProductsTableSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-destructive">Failed to load consultations</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No consultations found</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          </div>
        ) : (
          <ConsultationsTable
            consultations={consultations}
            activeTab={activeTab}
          />
        )}
      </div>

      {/* Pagination */}
      {consultations.length > 0 && (
        <div className="border-t bg-background p-6">
          <Pagination
            totalPages={totalItems ? Math.ceil(totalItems / pageSize) : 1}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </main>
  );
}