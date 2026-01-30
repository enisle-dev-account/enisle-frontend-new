"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useApiQuery } from "@/hooks/api";
import type { MedicineResponseData } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2 } from "lucide-react";
import { MedicinesTable } from "./components/medicine-table";
import { AddMedicineDrawer } from "./components/add-medicine-drawer";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { useConfirm } from "@/providers/confirm-box-provider";
import { Pagination } from "@/components/pagination";
import { ProductsTableSkeleton } from "../../store/product/components/skeletons/table-skeleton";

function MedicinesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { confirm } = useConfirm();
  const [productType, setProductType] = useState<string>();
  const [productStatus, setProductStatus] = useState<string>();
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(
    null,
  );
  const { showSuccess } = useSuccessModal();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const searchParams = useSearchParams();

  const queryParams = new URLSearchParams();
  if (searchQuery.trim()) {
    queryParams.append("search_query", searchQuery);
  }
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", pageSize.toString());

  if (productType) {
    queryParams.append("product_type", productType);
  }

  if (productStatus) {
    queryParams.append("product_status", productStatus);
  }

  const url = `/pharmacy/products/list/?${queryParams.toString()}`;
  const { data, isLoading, error, refetch } =
    useApiQuery<MedicineResponseData>(
      [
        "medicines",
        searchQuery,
        currentPage.toString(),
        productType || "",
        productStatus || "",
      ],
      url,
    );

  const bulkDeleteMutation = useMutation({
    mutationFn: (medicineIds: string[]) =>
      request(`/pharmacy/product/${medicineIds.join(",")}/delete/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      showSuccess(`${selectedIds.length} medicine(s) deleted successfully.`);
      setSelectedIds([]);
      refetch();
    },
    onError: (error) => {
      console.error("Bulk delete failed:", error);
      alert("Failed to delete medicines. Please try again.");
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirm({
      title: "Delete Medicine?",
      message: `Are you sure you want to delete ${selectedIds.length} medicine(s)?`,
      confirmText: "Yes, Delete",
      variant: "destructive",
    });

    if (confirmed) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  const handleAddSuccess = (message: string) => {
    showSuccess(message);
    setAddDrawerOpen(false);
    setEditingMedicineId(null);
    refetch();
  };

  const handleEdit = (medicineId: string) => {
    setEditingMedicineId(medicineId);
    setAddDrawerOpen(true);
  };

  const handleDrawerClose = (open: boolean) => {
    setAddDrawerOpen(open);
    if (!open) {
      setEditingMedicineId(null);
    }
  };

  const handleViewMedicine = (medicineId: string) => {
    router.push(`/pharmacy/medicine/${medicineId}`);
  };

  return (
    <>
      <div className="flex flex-col h-full gap-4">
        {/* Header and Controls */}
        <div className="space-y-4 rounded-3xl bg-background p-4">
          {/* Current Medicines Count */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
          ) : data ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[17px] gap-x-3">
                <p className="font-medium text-muted-foreground">
                  Total Medicines
                </p>
                <p className="font-semibold">{data.count}</p>
              </div>
            </div>
          ) : null}
          <div className="flex items-start justify-between">
            {/* Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, category, or generic name..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 bg-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={"/pharmacy/medicine/csv"}
                className="border-primary flex items-center gap-1 text-primary hover:bg-primary/10 font-medium px-3 py-1 rounded-full border"
              >
                <Plus className="mr-2 h-4 w-4" />
                Import CSV
              </Link>
              <Button
                className="bg-primary font-bold uppercase hover:bg-primary/90"
                onClick={() => setAddDrawerOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Medicine
              </Button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 rounded-3xl bg-background overflow-auto">
          <div className="flex p-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-2 text-sm">Action</div>

              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger className="w-fit min-w-37.5 bg-transparent border-[#177BE53B]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="health_and_wellness">
                    Health & Wellness
                  </SelectItem>
                  <SelectItem value="personal_care">Personal Care</SelectItem>
                  <SelectItem value="first_aid">First Aid</SelectItem>
                  <SelectItem value="medical_equipment">
                    Medical Equipment
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={productStatus} onValueChange={setProductStatus}>
                <SelectTrigger className="w-fit min-w-37.5 bg-transparent border-[#177BE53B]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>
          {isLoading ? (
            <ProductsTableSkeleton />
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-destructive">Failed to load medicines</p>
            </div>
          ) : data?.results && data.results.length > 0 ? (
            <MedicinesTable
              medicines={data.results}
              selectedIds={selectedIds}
              onSelectIds={setSelectedIds}
              onSelectMedicine={handleViewMedicine}
              onEditMedicine={handleEdit}
              onRefetch={refetch}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No medicines found</p>
            </div>
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

      {/* Add/Edit Drawer */}
      <AddMedicineDrawer
        open={addDrawerOpen}
        onOpenChange={handleDrawerClose}
        onSuccess={handleAddSuccess}
        editingMedicineId={editingMedicineId}
      />
    </>
  );
}

export default function MedicinesPage() {
  return (
    <main className="rounded-t-2xl overflow-hidden h-full flex flex-col">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            Loading...
          </div>
        }
      >
        <MedicinesContent />
      </Suspense>
    </main>
  );
}