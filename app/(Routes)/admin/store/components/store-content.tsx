import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { request, useApiQuery } from "@/hooks/api";
import { ProductsResponse } from "@/types";
import { Grid3x3, List, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ProductsListView from "./products-list";
import ProductsGridView from "./products-grid";
import { ProductDetailsDrawer } from "@/app/(Routes)/store/product/components/products-details-drawer";
import { useMutation } from "@tanstack/react-query";
import { useConfirm } from "@/providers/confirm-box-provider";
import { useSuccessModal } from "@/providers/success-modal-provider";

export default function StoreItemsContent({
  viewMode,
}: {
  viewMode: "list" | "grid";
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("active");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { confirm } = useConfirm();
  const { showSuccess } = useSuccessModal();
  const queryParams = new URLSearchParams();
  if (searchQuery.trim()) {
    queryParams.append("search_query", searchQuery);
  }
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", pageSize.toString());

  if (sortBy && sortBy !== "active") {
    queryParams.append("availability", sortBy);
  }

  const url = `/store/list/admin/?${queryParams.toString()}`;
  const { data, isLoading, error, refetch } = useApiQuery<ProductsResponse>(
    ["store-products", searchQuery, currentPage.toString(), sortBy],
    url,
  );
  const deleteMutation = useMutation({
    mutationFn: (productIds: string[]) =>
      request(`/store/products/${productIds.join(",")}/delete/`, {
        method: "DELETE",
      }),
    onSuccess: (_, variables) => {
      const count = variables.length;
      showSuccess(
        `${count} product${count > 1 ? "s" : ""} deleted successfully.`,
      );

      setSelectedIds((prev) => prev.filter((id) => !variables.includes(id)));
      refetch();
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Failed to delete products. Please try again.");
    },
  });

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;
  const handleDelete = async (ids: string[]) => {
    if (ids.length === 0) return;

    const isBulk = ids.length > 1;
    const confirmed = await confirm({
      title: isBulk ? "Delete Products?" : "Delete Product?",
      message: `Are you sure you want to delete ${isBulk ? ids.length : "this"} product(s)? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "destructive",
    });

    if (confirmed) {
      deleteMutation.mutate(ids);
    }
  };
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-background p-6 space-y-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-blue-600">🏪</span>
              Store Items
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-fit bg-white border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active | Out of stock</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="out_of_stock">Out of stock</SelectItem>
              </SelectContent>
            </Select>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(selectedIds)}
                disabled={deleteMutation.isPending}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedIds.length})
              </Button>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search table"
                className="pl-10 w-75 bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-destructive">Failed to load products</p>
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <>
            {viewMode === "list" ? (
              <ProductsListView
                products={data.results}
                selectedIds={selectedIds}
                onSelectIds={setSelectedIds}
                onSelectProduct={setSelectedProduct}
                onDelete={(id) => handleDelete(id)}
                isDeleting={deleteMutation.isPending}
                deletingIds={deleteMutation.variables || []}
              />
            ) : (
              <ProductsGridView
                products={data.results}
                selectedIds={selectedIds}
                onSelectIds={setSelectedIds}
                onSelectProduct={setSelectedProduct}
                onDelete={(id) => handleDelete(id)}
                isDeleting={deleteMutation.isPending}
                deletingIds={deleteMutation.variables || []}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
      <ProductDetailsDrawer
        onRefetch={refetch}
        open={!!selectedProduct}
        productId={selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      />

      {data && data.count > 0 && (
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
