"use client";

import { useParams, useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/api";
import type { MedicineResponseData, MedicinesData } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function MedicineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const medicineId = params.id as string;

  const { data: medicine, isLoading } = useApiQuery<MedicinesData>(
    ["medicine-detail", medicineId],
    `/pharmacy/products/list/${medicineId}/`,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="bg-white rounded-3xl p-8 space-y-8">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Medicine not found
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const stockPercentage =
    medicine.starting_stock && medicine.current_stock
      ? (Number(medicine.current_stock) / Number(medicine.starting_stock)) * 100
      : 0;

  return (
    <div className=" rounded-2xl pb-16  bg-background">
      {/* Medicine Information Card */}
      <div className="bg-white border-b  p-8">
        <h2 className="text-2xl font-semibold text-[#626467] mb-6">
          Medicine Information
        </h2>

        <div className="space-y-6">
          {/* Name and Popularity */}
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="text-lg font-medium">{medicine.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Popularity</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(medicine.popularity_rating || 0)
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-5 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Generic Name
                </p>
                <p className="text-base">{medicine.generic_name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Weight</p>
                <p className="text-base">{medicine.weight}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="text-base capitalize">
                  {medicine.category?.replaceAll("_", " ") || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Manufacturer
                </p>
                <p className="text-base">{medicine.vendor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Expiring Date
                </p>
                <p className="text-base">
                  {medicine.expiry_date
                    ? format(new Date(medicine.expiry_date), "MM/dd/yyyy")
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Card */}
      <div className="bg-white border-b  p-8">
        <h2 className="text-xl font-semibold text-[#7C7C7C] mb-6">Stock</h2>

        <div className="grid grid-cols-3 gap-12">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Starting Stock</p>
            <p className="text-2xl font-medium">
              {medicine.starting_stock || medicine.quantity}
              <span className="text-sm text-muted-foreground">box</span>
            </p>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Remaining</p>
              <div className="w-full bg-[#A2B0BF] rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 transition-all"
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Stock</p>
            <p className="text-2xl font-medium">
              {medicine.current_stock || medicine.quantity}
              <span className="text-sm text-muted-foreground">box</span>
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Stock Status</p>
            <Badge
              variant={
                medicine.availability === "available"
                  ? "default"
                  : "destructive"
              }
              className="text-sm py-2 rounded-md h-9 px-5 "
            >
              {medicine.availability === "available"
                ? "Available"
                : "Out of Stock"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="bg-white border-b  p-8 pb-14">
        <h2 className="text-xl font-semibold text-[#7C7C7C] mb-6">Estimated</h2>

        <div className="grid grid-cols-3 gap-12">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Manufacturer Price
            </p>
            <p className="text-2xl font-medium">
              {medicine.currency}
              {typeof medicine.vendor_price === "number"
                ? medicine.vendor_price.toLocaleString()
                : medicine.vendor_price || "0"}
              <span className="text-sm text-muted-foreground">box</span>
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Selling Price</p>
            <p className="text-2xl font-medium">
              {medicine.currency}
              {typeof medicine.price === "number"
                ? medicine.price.toLocaleString()
                : medicine.price}
              <span className="text-sm text-muted-foreground">box</span>
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Profit Margin</p>
            <p className="text-2xl font-medium text-green-600">
              {medicine.currency}
              {typeof medicine.price === "number" &&
              typeof medicine.vendor_price === "number"
                ? (medicine.price - medicine.vendor_price).toLocaleString()
                : "0"}
              <span className="text-sm text-muted-foreground">box</span>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {medicine.information && Object.keys(medicine.information).length > 0 && (
        <div className="bg-white rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-[#7C7C7C] mb-6">
            Additional Information
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {Object.entries(medicine.information).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-muted-foreground mb-1 capitalize">
                  {key.replaceAll("_", " ")}
                </p>
                <p className="text-base">{value as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
