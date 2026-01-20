"use client"

import { motion } from "framer-motion"
import { useApiQuery } from "@/hooks/api"
import type { Product } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface ProductDetailsModalProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefetch: () => void
}

export function ProductDetailsModal({
  productId,
  open,
  onOpenChange,
  onRefetch,
}: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data: product, isLoading } = useApiQuery<Product>(
    ["product", productId],
    `/store/list/${productId}/`
  )

  const images = product?.images || []
  const currentImage = images[currentImageIndex] || "/placeholder-product.png"

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogClose />
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : product ? (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header with Price */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-sm text-muted-foreground">
                  By {product.vendor || "Unknown"} • SKU: {product.sku}
                </p>
              </div>
              <p className="text-2xl font-bold text-primary">
                ₦{typeof product.price === "number" ? product.price.toLocaleString() : product.price}
              </p>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden group">
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex ? "border-primary" : "border-transparent"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start border-b bg-transparent p-0 rounded-none">
                <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary">
                  Details
                </TabsTrigger>
                <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary">
                  Features
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <Card className="p-4 border-0 bg-muted/30">
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd className="font-medium">{product.category || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type:</dt>
                      <dd className="font-medium">{product.type || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Stock Available:</dt>
                      <dd className="font-medium">{product.stock}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Availability:</dt>
                      <dd className="font-medium">
                        {product.availability ? "In Stock" : "Out of Stock"}
                      </dd>
                    </div>
                  </dl>
                </Card>

                {product.description && (
                  <Card className="p-4 border-0 bg-muted/30">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="features" className="pt-4">
                <Card className="p-4 border-0 bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    No additional features specified for this product.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-destructive">Failed to load product details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
