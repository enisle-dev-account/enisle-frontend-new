"use client";

import React from "react";

import { useState, useCallback, useMemo } from "react";
import { useApiQuery } from "@/hooks/api";
import type { ConsultationVitalsDataResponse } from "@/types";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { TablePagination } from "@/components/table-pagination";
import { VitalsTable } from "./vitals-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function VitalsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append("search_query", searchQuery);
    }
    params.append("page", currentPage.toString());
    params.append("page_size", pageSize.toString());
    return params;
  }, [searchQuery, currentPage, pageSize]);

  const url = `/nurse/consultations/list?${queryParams.toString()}`;

  const { data, isLoading } = useApiQuery<ConsultationVitalsDataResponse>(
    ["nurse", "consultations", searchQuery, currentPage.toString()],
    url,
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const totalItems = data?.count || 0;
  const consultations = data?.results || [];
  const inQueueCount = consultations.length;

  return (
    <main className="rounded-t-2xl bg-transparent overflow-hidden h-full flex flex-col">
      <div className="py-6 border-b bg-background rounded-3xl mb-4">
        <div className=" mb-4  border-b ">
          <div className="flex px-6 items-center gap-3 pb-3 border-b-2 border-primary w-fit">
            <h1 className="font-bold">Patients</h1>
            <Badge variant="default">{inQueueCount}</Badge>
          </div>
        </div>

        <div className="flex gap-3 px-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by last name, middle name or first name"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-auto px-6 pb-6 pt-2 bg-background rounded-3xl">
        <Card className="py-4 ring-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#E6F0FF] p-2 rounded-md">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center text-lg gap-x-3">
              <p className="font-medium text-muted-foreground">In Queue</p>
              <p className="font-semibold">
                {String(inQueueCount).padStart(2, "0")}
              </p>
            </div>
          </div>
        </Card>
        <VitalsTable consultations={consultations} isLoading={isLoading} />
      </div>

      <div className=" bg-transparent p-6">
        <TablePagination
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
