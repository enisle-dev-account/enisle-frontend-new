"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useApiQuery } from "@/hooks/api";
import type { ProductsResponse } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { ProductsTable } from "./components/products-table";
import { ProductsPagination } from "./components/products-pagination";
import { AddProductDrawer } from "./components/add-product-drawer";
import { ProductDetailsModal } from "./components/products-details-modal";
import { SuccessModal } from "./components/success-modal";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = useSearchParams();

  const queryParams = new URLSearchParams();
  if (searchQuery.trim()) {
    queryParams.append("search_query", searchQuery);
  }
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", pageSize.toString());

  const url = `/store/list/?${queryParams.toString()}`;
  const { data, isLoading, error, refetch } = useApiQuery<ProductsResponse>(
    ["products", searchQuery, currentPage.toString()],
    url,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  const handleAddSuccess = (message: string) => {
    setSuccessMessage(message);
    setSuccessOpen(true);
    setAddDrawerOpen(false);
    refetch();
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
              className="border-primary flex items-center gap-1  text-primary hover:bg-primary/10 font-medium px-3 py-1 rounded-full border"
            >
                            <Plus className="mr-2 h-4 w-4" />

              Import CSV
            </Link>
            <Button
              className="bg-primary font-bold uppercase  hover:bg-primary/90"
              onClick={() => setAddDrawerOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

       

        {/* Current Products Count */}
        {data && (
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
        )}
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-destructive">Failed to load products</p>
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <ProductsTable
            products={data.results}
            onSelectProduct={setSelectedProduct}
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
        onOpenChange={setAddDrawerOpen}
        onSuccess={handleAddSuccess}
      />

      {selectedProduct && (
        <ProductDetailsModal
          productId={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          onRefetch={refetch}
        />
      )}

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
