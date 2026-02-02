"use client";

import { useState, useCallback } from "react";
import { useApiQuery } from "@/hooks/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import { PatientsDataResponse } from "@/types";
import { PatientsTable } from "./patients-table";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";

export function NursePatientContent() {
  const [activeTab, setActiveTab] = useState<"in_patient" | "out_patient">(
    "in_patient",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // Build query params
  const queryParams = new URLSearchParams();
  if (debouncedSearch) {
    queryParams.append("search_query", debouncedSearch);
  }
  if (activeTab) {
    queryParams.append(
      "status",
      activeTab === "in_patient" ? "admitted" : activeTab,
    );
  }
  queryParams.append("page", page.toString());

  const {
    data: patientsData,
    isLoading,
    error,
  } = useApiQuery<PatientsDataResponse>(
    ["patients", activeTab, debouncedSearch, page.toString()],
    `/patient/list/?${queryParams.toString()}`,
  );

  const patients = patientsData?.results.data || [];
  const inPatientCount = patientsData?.results.in_patient || 0;
  const outPatientCount = patientsData?.results.out_patient || 0;
  const totalCount = patientsData?.count || 0;

  const handleTabChange = (value: string) => {
    setActiveTab(value as "in_patient" | "out_patient");
    setPage(1); // Reset to page 1 when changing tabs
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to page 1 when searching
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 gap-8">
          <TabsTrigger
            value="in_patient"
            className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3"
          >
            <span>
              {"In - Patients"}
              {"  "}
            </span>
            <span className="text-muted-foreground">
              <Badge>{inPatientCount}</Badge>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="out_patient"
            className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3"
          >
            <span>
              {"Out - Patients"}
              {"  "}
            </span>
            <span className="text-muted-foreground">
              <Badge>{outPatientCount}</Badge>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value="in_patient" className="mt-6 space-y-4">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Error loading patients
            </div>
          ) : (
            <>
              <PatientsTable patients={patients} type="in_patient" />
              <PaginationFooter
                currentPage={page}
                totalCount={totalCount}
                pageSize={10}
                onPageChange={setPage}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="out_patient" className="mt-6 space-y-4">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Error loading patients
            </div>
          ) : (
            <>
              <PatientsTable patients={patients} type="out_patient" />
              <PaginationFooter
                currentPage={page}
                totalCount={totalCount}
                pageSize={10}
                onPageChange={setPage}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SearchAndFilter({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-3 items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by last name, middle name or first name"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}

function PaginationFooter({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </Button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
        (page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      {totalPages > 5 && (
        <>
          <span className="px-2">...</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </Button>
    </div>
  );
}
