"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users, UserCheck, BedDouble } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";
import { request, useApiQuery } from "@/hooks/api";

import type { DoctorPatientsResponse, PatientAdmissionStatus } from "@/types";
import { Pagination } from "@/components/pagination";
import { DoctorPatientsTable } from "../patient/components/patient-table";
import EmptyList from "@/components/empty-list";
import { DoctorPatientsTableSkeleton } from "../patient/components/skeletons/table-skeleton";

const PATIENT_TABS = [
  {
    value: "all",
    label: "All Patients",
    icon: Users,
  },
  {
    value: "admitted",
    label: "Admitted",
    icon: BedDouble,
  },
  {
    value: "scheduled",
    label: "Scheduled",
    icon: UserCheck,
  },
  {
    value: "discharged",
    label: "Discharged",
    icon: UserCheck,
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
    data: resp,
    isLoading,
    error,
    refetch,
  } = useApiQuery<DoctorPatientsResponse>(
    [
      "doctor-patients",
      activeTab ?? "all",
      searchQuery,
      currentPage.toString(),
    ],
    url,
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTabChange = (tab: string) => {
    const newTab = tab === "all" ? null : (tab as PatientAdmissionStatus);
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const data = resp?.results;

  const tabCounts = {
    all: data?.all_patient || 0,
    out_patient: data?.out_patient || 0,
    admitted: data?.in_patient || 0,
  };

  const patients = data?.data || [];

  return (
    <main className="  overflow-hidden gap-6  flex flex-col">
      {/* Header Section */}
      <div className="p-4  rounded-2xl bg-background">
        {/* Tabs */}
        <Tabs
          value={activeTab ?? "all"}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-fit justify-start rounded-none bg-transparent p-0 gap-8">
            {PATIENT_TABS.map((tab) => {
              const tabValue = tab.value ?? "all";
              return (
                <TabsTrigger
                  key={tabValue}
                  value={tabValue}
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-0 py-3 flex gap-x-3 items-center"
                >
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
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
      <div className="flex-1 overflow-auto  pb-4 h-full flex items-center justify-center bg-background  rounded-2xl">
        {isLoading ? (
          <DoctorPatientsTableSkeleton />
        ) : error ? (
          <div className="flex min-h-80 items-center justify-center">
            <p className="text-destructive">Failed to load patients</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center ">
            <div className="text-center">
              <EmptyList
                showRefresh
                onRefresh={() => refetch()}
                title="No patients found"
                description="List of patients will appear here when patients are admitted in your hospital."
              />
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-background w-full space-y-2 rounded-2xl ">
            <div className=" bg-background ">
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
                      <Users className="h-5 w-5 text-primary " />
                    </div>
                    <div className="flex items-center text-lg gap-x-3">
                      <p className="font-medium text-muted-foreground">
                        {activeTab === "admitted"
                          ? "Admitted Patients"
                          : activeTab === "out_patient"
                            ? "Outpatients"
                            : "Total Patients"}
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
              </div>
            </div>

            <DoctorPatientsTable patients={patients} />
          </div>
        )}
      </div>

      {/* Pagination */}
      {patients.length > 0 && (
        <Pagination
          totalPages={resp?.count ? Math.ceil(resp.count / pageSize) : 1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}
