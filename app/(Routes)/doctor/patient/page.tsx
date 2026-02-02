"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, UserCheck, BedDouble } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { request } from "@/hooks/api";
import { TablePagination } from "@/components/table-pagination";

import type { DoctorPatientsResponse, PatientAdmissionStatus } from "@/types";
import { Pagination } from "@/components/pagination";
import { DoctorPatientsTable } from "./components/patient-table";

const PATIENT_TABS = [
  {
    value: null,
    label: "All Patients",
    icon: Users,
  },
  {
    value: "out_patient",
    label: "Outpatients",
    icon: UserCheck,
  },
  {
    value: "admitted",
    label: "Admitted",
    icon: BedDouble,
  },
];

export default function DoctorPatientsPage() {
  const [activeTab, setActiveTab] = useState<PatientAdmissionStatus>(null);
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

  const url = `/patient/list/?${queryParams.toString()}`;

  const {
    data:resp,
    isLoading,
    error,
  } = useQuery<DoctorPatientsResponse>({
    queryKey: [
      "doctor-patients",
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
    const newTab = tab === "all" ? null : (tab as PatientAdmissionStatus);
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const data=resp?.results

  const tabCounts = {
    all: data?.all_patient || 0,
    out_patient: data?.out_patient || 0,
    admitted: data?.in_patient || 0,
  };

  const patients = data?.data || [];

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
              const Icon = tab.icon;
              const tabValue = tab.value ?? "all";
              const count = tabCounts[tabValue as keyof typeof tabCounts];

              return (
                <TabsTrigger
                  key={tabValue}
                  value={tabValue}
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3 items-center"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="ml-1">
                    {isLoading ? <Skeleton className="h-4 w-6" /> : count}
                  </Badge>
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
                  {activeTab === "admitted"
                    ? "Admitted Patients"
                    : activeTab === "out_patient"
                      ? "Outpatients"
                      : "All Patients"}
                </p>
                <p className="font-semibold">
                  {activeTab === "admitted"
                    ? tabCounts.admitted
                    : activeTab === "out_patient"
                      ? tabCounts.out_patient
                      : tabCounts.all}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground text-sm">
                Loading patients...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-destructive">Failed to load patients</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No patients found</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          </div>
        ) : (
          <DoctorPatientsTable patients={patients} activeTab={activeTab} />
        )}
      </div>

      {/* Pagination */}
      {patients.length > 0 && (
        <div className="border-t bg-background p-6">
          <Pagination
            totalPages={resp?.count? Math.ceil(resp.count / pageSize) : 1}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </main>
  );
}
