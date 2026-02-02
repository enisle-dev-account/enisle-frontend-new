"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useApiQuery } from "@/hooks/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { Pagination } from "@/components/pagination";
import { ProductsTableSkeleton } from "@/app/(Routes)/store/product/components/skeletons/table-skeleton";
import { PatientsTable } from "./patients-table";
import { PatientMedicationDrawer } from "./patient-medication-drawer";
import { PatientsResponse, PharmacyPatient } from "@/types";
import EmptyList from "@/components/empty-list";



interface PatientsContentProps {
  status: string;
  viewMode: "list" | "grid";
}

export default function PatientsContent({ status, viewMode }: PatientsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState<PharmacyPatient | null>(null);
  const { showSuccess } = useSuccessModal();

  const queryParams = new URLSearchParams();
  queryParams.append("status", status);
  if (searchQuery.trim()) {
    queryParams.append("search_query", searchQuery);
  }
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", pageSize.toString());

  const url = `/pharmacy/patients/list/?${queryParams.toString()}`;
  const { data, isLoading, error, refetch } = useApiQuery<PatientsResponse>(
    ["pharmacy-patients", status, searchQuery, currentPage.toString()],
    url
  );

  useEffect(()=>{
    if (data?.results && data.results.length > 0  && selectedPatient) {
      setSelectedPatient(data.results.find(patient => patient.id === selectedPatient.id) || null);
    }
  },[data?.results])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewPatient = (patient: PharmacyPatient) => {
    setSelectedPatient(patient);
    
  };

  const handleFinishSuccess = () => {
    showSuccess("Medicine request has been completed successfully");
    setSelectedPatient(null);
    refetch();
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  const getStatusLabel = () => {
    switch (status) {
      case "in_queue":
        return "In Queue";
      case "checkout":
        return "Checkout";
      case "finished":
        return "Finished";
      case "canceled":
        return "Canceled";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-4">
        {/* Header and Controls */}
        <div className="space-y-4 rounded-3xl bg-background p-4">
          {/* Current Patients Count */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
          ) : data ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[17px] gap-x-3">
                <p className="font-medium text-muted-foreground">{getStatusLabel()}</p>
                <p className="font-semibold">{data.count}</p>
              </div>
            </div>
          ) : null}

          {/* Search and Filters */}
          <div className="flex items-center gap-2">
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

        {/* Table Content */}
        <div className="flex-1 rounded-3xl bg-background overflow-auto">
          {isLoading ? (
            <ProductsTableSkeleton />
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-destructive">Failed to load patients</p>
            </div>
          ) : data?.results && data.results.length > 0 ? (
            <PatientsTable
              patients={data.results}
              onViewPatient={handleViewPatient}
              status={status}
            />
          ) : (
            <EmptyList description="No Patients Found"/>
          )}
        </div>
      </div>

      {/* Pagination */}
      {data && data.count > 0 && (
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Patient Medication Drawer */}
      <PatientMedicationDrawer
        patient={selectedPatient}
        open={!!selectedPatient}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
        onFinishSuccess={handleFinishSuccess}
        onRefetch={refetch}
      />
    </>
  );
}