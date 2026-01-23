"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import Image from "next/image";
import { toBase64 } from "@/lib/utils";
import { shimmer } from "@/components/image-shimmer";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { useConfirm } from "@/providers/confirm-box-provider";

interface ProductsTableProps {
  products: Product[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onSelectProduct: (id: string) => void;
  onEditProduct: (id: string) => void;
  onRefetch: () => void;
}

export function ProductsTable({
  products,
  selectedIds,
  onSelectIds,
  onSelectProduct,
  onEditProduct,
  onRefetch,
}: ProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSuccess } = useSuccessModal();
  const { confirm } = useConfirm();
  const deleteMutation = useMutation({
    mutationFn: (productId: string) =>
      request(`/store/products/${productId}/delete/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      setDeletingId(null);
      onRefetch();
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      setDeletingId(null);
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectIds(products.map((p) => p.id));
    } else {
      onSelectIds([]);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Product?",
      message:
        "This action cannot be undone. This will permanently delete the product from our servers.",
      variant: "destructive",
    });
    if (confirmed) {
      deleteMutation.mutate(id);
    } else {
      setDeletingId(null);
    }
  };

  const handleSelectOne = (productId: string, checked: boolean) => {
    if (checked) {
      onSelectIds([...selectedIds, productId]);
    } else {
      onSelectIds(selectedIds.filter((id) => id !== productId));
    }
  };

  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < products.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <table className="w-full">
        <thead className=" sticky top-0 z-10">
          <tr className="text-sm font-medium text-muted-foreground">
            <th className="px-6 py-4 text-left">
              <Checkbox
                className="border-custom-gray-1"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="px-6 py-4 text-left">Product Details</th>
            <th className="px-6 py-4 text-left">Categories</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-left">SKU</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="transition-colors"
            >
              <td className="px-6 py-4">
                <Checkbox
                  className="border-custom-gray-1"
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={(checked: boolean) =>
                    handleSelectOne(product.id, checked)
                  }
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={product.cover_image.file}
                    alt={product.title}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    width={40}
                    height={40}
                    className="rounded-md h-10 w-10 object-cover"
                  />
                  <p className="font-medium text-foreground">{product.title}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm capitalize text-muted-foreground">
                {product.categories?.replaceAll("_", " ") || "—"}
              </td>
              <td className="px-6 py-4 font-medium">
                {typeof product.price === "number"
                  ? `₦${product.price.toLocaleString()}`
                  : product.price}
              </td>
              <td className="px-6 py-4 text-sm">{product.stock}</td>
              <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                {product.sku}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button
                    className="bg-primary font-bold h-8 px-3 text-sm hover:bg-primary/90"
                    onClick={() => onSelectProduct(product.id)}
                  >
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {deletingId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(product.id);
                        }}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(product.id);
                          handleDelete(product.id);
                        }}
                        className="text-destructive focus:text-destructive"
                        disabled={deletingId === product.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === product.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
