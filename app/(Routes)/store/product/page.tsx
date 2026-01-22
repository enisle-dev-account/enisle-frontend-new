"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useApiQuery } from "@/hooks/api";
import type { ProductsResponse } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { SuccessModal } from "./components/success-modal";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsTableSkeleton } from "./components/table-skeleton";

function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
    ["products", searchQuery, currentPage.toString(), sortBy],
    url,
  );

  const bulkDeleteMutation = useMutation({
    mutationFn: (productIds: string[]) =>
      request(`/store/products/${productIds.join(",")}/delete/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      setSuccessMessage("Products deleted successfully!");
      setSuccessOpen(true);
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

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} product(s)?`,
      )
    ) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  const handleAddSuccess = (message: string) => {
    setSuccessMessage(message);
    setSuccessOpen(true);
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
      {/* Header and Controls */}
      <div className="space-y-4 border-b bg-background p-4">
        <div className="flex items-start justify-between">
          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-45">
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

        {/* Current Products Count */}
        {isLoading ? (
          <Card className="p-4 border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
          </Card>
        ) : data ? (
          <Card className="p-4 border-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-lg gap-x-3">
                <p className="font-medium text-muted-foreground">
                  Total Products
                </p>
                <p className="font-semibold">{data.count}</p>
              </div>
            </div>
          </Card>
        ) : null}
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
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

      {/* Pagination */}
      {data && data.count > 0 && (
        <div className="border-t bg-background p-4">
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

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        message={successMessage}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col">
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
