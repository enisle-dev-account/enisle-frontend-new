"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import { PatientsTable } from "./components/patients-table";
import EmptyList from "@/components/empty-list";
import type { LaboratoryRequestPatient } from "@/types/laboratory";

interface PatientsResponse {
  results: LaboratoryRequestPatient[];
  count: number;
}

export default function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("search_query", searchQuery);
    params.append("page", currentPage.toString());
    params.append("page_size", pageSize.toString());
    return params;
  }, [searchQuery, currentPage, pageSize]);

  const url = `/laboratory/patients/list/?${queryParams.toString()}`;

  const {
    data: resp,
    isLoading,
    error,
  } = useApiQuery<PatientsResponse>(
    ["laboratory-patients", searchQuery, currentPage.toString()],
    url
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePatientClick = (patientId: number) => {
    router.push(`/laboratory/patients/${patientId}`);
  };

  const patients = resp?.results || [];
  const totalCount = resp?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="overflow-hidden gap-6 flex flex-col">
      {/* Header Section */}
      <div className="p-4 rounded-2xl bg-background">
        {/* Tab */}
        <Tabs value="all" className="w-full">
          <TabsList className="w-fit justify-start rounded-none bg-transparent p-0 gap-8">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3 items-center"
            >
              <span>All Patients</span>
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] text-white bg-primary">
                {totalCount}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by last name, middle name or first name"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-transparent"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm">
                <span>First and last name of patients</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={handleClearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
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
                    Total Patients
                  </p>
                  <p className="font-semibold">{String(totalCount).padStart(2, "0")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="w-full p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-destructive">Failed to load patients</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full">
            <EmptyList
              title="No Patients Found"
              description="Patient records will appear here"
            />
          </div>
        ) : (
          <div className="bg-background w-full space-y-2 rounded-2xl px-4">
            <PatientsTable data={patients} onPatientClick={handlePatientClick} />
          </div>
        )}
      </div>

      {/* Pagination */}
      {patients.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}