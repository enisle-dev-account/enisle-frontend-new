"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useApiQuery } from "@/hooks/api";
import type { ProductsResponse } from "@/types";
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
import { ProductsTable } from "./components/products-table";
import { ProductsPagination } from "./components/products-pagination";
import { AddProductDrawer } from "./components/add-product-drawer";
import { ProductDetailsDrawer } from "./components/products-details-drawer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsTableSkeleton } from "./components/skeletons/table-skeleton";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { useConfirm } from "@/providers/confirm-box-provider";

function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { confirm } = useConfirm();
  const [sortBy, setSortBy] = useState<string>();
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const { showSuccess } = useSuccessModal();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const searchParams = useSearchParams();

  const queryParams = new URLSearchParams();
  if (searchQuery.trim()) {
    queryParams.append("search_query", searchQuery);
  }
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", pageSize.toString());

  // Add sort parameter
  if (sortBy) {
    queryParams.append(
      "ordering",
      sortBy === "newest" ? "-created_at" : "created_at",
    );
  }

  const url = `/store/list/?${queryParams.toString()}`;
  const { data, isLoading, error, refetch } = useApiQuery<ProductsResponse>(
    ["products", searchQuery, currentPage.toString(), sortBy ? sortBy : ""],
    url,
  );

  const bulkDeleteMutation = useMutation({
    mutationFn: (productIds: string[]) =>
      request(`/store/products/${productIds.join(",")}/delete/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      showSuccess(`${selectedIds.length} product(s) deleted successfully.`);
      setSelectedIds([]);
      refetch();
    },
    onError: (error) => {
      console.error("Bulk delete failed:", error);
      alert("Failed to delete products. Please try again.");
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleBulkDelete =async  () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirm({
      title: "Delete Product?",
      message: `Are you sure you want to delete ${selectedIds.length} product(s)?`,
      confirmText: "Yes, Delete",
      variant: "destructive", 
    });

    if (confirmed)
   {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  const handleAddSuccess = (message: string) => {
    showSuccess(message);
    setAddDrawerOpen(false);
    setEditingProductId(null);
    refetch();
  };

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setAddDrawerOpen(true);
  };

  const handleDrawerClose = (open: boolean) => {
    setAddDrawerOpen(open);
    if (!open) {
      setEditingProductId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-4">
        {/* Header and Controls */}
        <div className="space-y-4 rounded-3xl bg-background p-4">
          {/* Current Products Count */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
          ) : data ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[17px] gap-x-3">
                <p className="font-medium text-muted-foreground">
                  Total Products
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
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 bg-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={"/store/product/csv"}
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
                Add Product
              </Button>
            </div>
          </div>

          {/* Action Bar */}
        </div>

        {/* Table Content */}
        <div className="flex-1 rounded-3xl bg-background overflow-auto">
          <div className="flex p-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-2 text-sm">Action</div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-fit min-w-10 bg-transparent border-[#177BE53B]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
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
              <p className="text-destructive">Failed to load products</p>
            </div>
          ) : data?.results && data.results.length > 0 ? (
            <ProductsTable
              products={data.results}
              selectedIds={selectedIds}
              onSelectIds={setSelectedIds}
              onSelectProduct={setSelectedProduct}
              onEditProduct={handleEdit}
              onRefetch={refetch}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      {data && data.count > 0 && (
        <div className="  p-4">
          <ProductsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Drawers and Modals */}
      <AddProductDrawer
        open={addDrawerOpen}
        onOpenChange={handleDrawerClose}
        onSuccess={handleAddSuccess}
        editingProductId={editingProductId}
      />

      <ProductDetailsDrawer
        productId={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onRefetch={refetch}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <main className="rounded-t-2xl  overflow-hidden h-full flex flex-col">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            Loading...
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </main>
  );
}
