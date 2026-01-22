"use client";

import { motion } from "framer-motion";
import { useApiQuery } from "@/hooks/api";
import type { Product } from "@/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductDetailsDrawerProps {
  productId: string |null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefetch: () => void;
  previewData?: Product | null;
}

export function ProductDetailsDrawer({
  productId,
  open,
  onOpenChange,
  onRefetch,
  previewData,
}: ProductDetailsDrawerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading } = useApiQuery<Product>(
    ["product",productId? productId :""],
    `/store/list/${productId}/`,
    {
      queryKey: ["product", productId],
      enabled: !previewData && !!productId,
    }
  );

  const displayProduct = previewData || product;

  const images = displayProduct
    ? [
        displayProduct.cover_image?.file,
        ...(displayProduct.product_images?.map((img) => img.file) || []),
      ].filter(Boolean)
    : [];

  const currentImage = images[currentImageIndex] || "/placeholder-product.png";

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const drawerVariants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: { type: "spring" as const, damping: 30, stiffness: 300 },
    },
    exit: {
      y: "100%",
      transition: { duration: 0.2 },
    },
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] min-h-[90vh]  max-h-[90vh]">
        <div className="mx-auto w-full max-w-7xl h-full flex flex-col overflow-hidden">
          <DrawerHeader className="border-b px-6 py-4 shrink-0">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold">
                Product Details
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {isLoading && !previewData ? (
            <div className="flex items-center justify-center flex-1">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : displayProduct ? (
            <div
              className="flex-1 no-scrollbar overflow-y-auto px-6 py-6"
            >
              <div className="grid md:grid-cols-2 gap-12">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                  <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden group">
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                      alt={displayProduct.title}
                      className="w-full h-full object-contain p-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/50 text-background text-xs px-3 py-1 rounded-full">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((img, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            idx === currentImageIndex
                              ? "border-primary"
                              : "border-muted-foreground"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={img}
                            alt={`${displayProduct.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Information */}
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {displayProduct.title}
                    </h2>
                    <p className="text-2xl font-semibold text-primary mb-2">
                      ₦{typeof displayProduct.price === "number"
                        ? displayProduct.price.toLocaleString()
                        : displayProduct.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By {displayProduct.vendor} • SKU: {displayProduct.sku || "N/A"}
                    </p>
                  </div>

                  {/* Description */}
                  <Card className="p-4 border-0 bg-muted/30">
                    <h3 className="font-semibold mb-2 text-foreground">
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {displayProduct.description}
                    </p>
                  </Card>

                  {/* Product Information */}
                  <Card className="p-4 border-0 bg-muted/30">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Product Information
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category:</dt>
                        <dd className="font-medium capitalize">
                          {displayProduct.categories?.replaceAll("_", " ") || "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type:</dt>
                        <dd className="font-medium capitalize">
                          {displayProduct.type || "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Stock Available:</dt>
                        <dd className="font-medium">{displayProduct.stock}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Availability:</dt>
                        <dd className="font-medium capitalize">
                          {displayProduct.availability?.replaceAll("_", " ") || "—"}
                        </dd>
                      </div>
                    </dl>
                  </Card>

                  {/* Specifications */}
                  {displayProduct.information &&
                    Object.keys(displayProduct.information).length > 0 && (
                      <Card className="p-4 border-0 bg-muted/30">
                        <h3 className="font-semibold mb-3 text-foreground">
                          Specifications
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(displayProduct.information).map(
                            ([key, value], idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="font-semibold text-foreground">
                                  {key}:
                                </span>
                                <span className="text-muted-foreground">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </Card>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-destructive">Failed to load product details</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}