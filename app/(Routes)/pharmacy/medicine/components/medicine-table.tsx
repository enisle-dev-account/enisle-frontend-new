"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import type { MedicinesData } from "@/types";
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
import { format } from "date-fns";
import { CURRENCY_SYMBOLS } from "../schemas/medicine.schems";

interface MedicinesTableProps {
  medicines: MedicinesData[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onSelectMedicine: (id: string) => void;
  onEditMedicine: (id: string) => void;
  onRefetch: () => void;
}

export function MedicinesTable({
  medicines,
  selectedIds,
  onSelectIds,
  onSelectMedicine,
  onEditMedicine,
  onRefetch,
}: MedicinesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSuccess } = useSuccessModal();
  const { confirm } = useConfirm();

  const deleteMutation = useMutation({
    mutationFn: (medicineId: string) =>
      request(`/pharmacy/product/${medicineId}/delete/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      showSuccess("Medicine deleted successfully");
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
      onSelectIds(medicines.map((m) => m.id));
    } else {
      onSelectIds([]);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Medicine?",
      message:
        "This action cannot be undone. This will permanently delete the medicine from our servers.",
      variant: "destructive",
    });
    if (confirmed) {
      deleteMutation.mutate(id);
    } else {
      setDeletingId(null);
    }
  };

  const handleSelectOne = (medicineId: string, checked: boolean) => {
    if (checked) {
      onSelectIds([...selectedIds, medicineId]);
    } else {
      onSelectIds(selectedIds.filter((id) => id !== medicineId));
    }
  };

  const isAllSelected =
    medicines.length > 0 && selectedIds.length === medicines.length;

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

  const getAvailabilityColor = (availability: string) => {
    return availability === "available"
      ? "text-green-600 bg-green-50"
      : "text-orange-600 bg-orange-50";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <table className="w-full">
        <thead className="sticky top-0 z-10">
          <tr className="text-sm font-medium text-muted-foreground">
            <th className="px-6 py-4 text-left">
              <Checkbox
                className="border-custom-gray-1"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Generic Name</th>
            <th className="px-6 py-4 text-left">Weight</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <motion.tr
              key={medicine.id}
              variants={rowVariants}
              className="transition-colors hover:bg-muted/50"
            >
              <td className="px-6 py-4">
                <Checkbox
                  className="border-custom-gray-1"
                  checked={selectedIds.includes(medicine.id)}
                  onCheckedChange={(checked: boolean) =>
                    handleSelectOne(medicine.id, checked)
                  }
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {medicine.cover_image ? (
                    <Image
                      src={medicine.cover_image.file}
                      alt={medicine.title}
                      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      width={40}
                      height={40}
                      className="rounded-md h-10 w-10 object-cover"
                    />
                  ) : null}
                  <p className="font-medium text-foreground max-w-50 truncate">
                    {medicine.title}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {medicine.generic_name || "—"}
              </td>
              <td className="px-6 py-4 text-sm">{medicine.weight}</td>
              <td className="px-6 py-4 text-sm capitalize">
                {medicine.category?.replaceAll("_", " ") || "—"}
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                {CURRENCY_SYMBOLS[medicine.currency as keyof typeof CURRENCY_SYMBOLS] || ""}
                {typeof medicine.price === "number"
                  ? medicine.price.toLocaleString()
                  : medicine.price} 
              </td>
              <td className="px-6 py-4 text-sm">
                {medicine.current_stock || medicine.quantity}
              </td>

            
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getAvailabilityColor(
                    medicine.availability,
                  )}`}
                >
                  {medicine.availability.replaceAll("_", " ")}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button
                    className="bg-primary font-bold h-8 px-3 text-sm hover:bg-primary/90"
                    onClick={() => onSelectMedicine(medicine.id)}
                  >
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {deletingId === medicine.id ? (
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
                          onEditMedicine(medicine.id);
                        }}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(medicine.id);
                          handleDelete(medicine.id);
                        }}
                        className="text-destructive focus:text-destructive"
                        disabled={deletingId === medicine.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === medicine.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
