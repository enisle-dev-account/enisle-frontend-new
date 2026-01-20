"use client";

import React, { useState, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/hooks/api";
import type { CreateProductFormData, ProductInformationItem } from "@/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  AVAILABILITY_LABELS,
  CATEGORY_LABELS,
  createProductSchema,
  TYPE_LABELS,
} from "../schemas/product.schema";

type CreateProductFormType = z.infer<typeof createProductSchema>;

interface AddProductDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  currencySymbol?: string;
}

interface ViewProductData {
  title: string;
  price: number;
  description: string;
  stock: number;
  availability: string;
  type: string;
  vendor: string;
  sku?: string;
  cover_image: string | null;
  product_images: string[];
  information: ProductInformationItem[];
}

export function AddProductDrawer({
  open,
  onOpenChange,
  onSuccess,
  currencySymbol = "₦",
}: AddProductDrawerProps) {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [viewingProduct, setViewingProduct] = useState<ViewProductData | null>(
    null,
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateProductFormType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      vendor: "",
      sku: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "information",
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await request("/store/product/create/", {
        method: "POST",
        body: data,
      });
      return response;
    },
    onSuccess: () => {
      onSuccess("Product created successfully!");
      handleReset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error("Product creation failed:", error);
      alert(error.message || "Failed to create product. Please try again.");
    },
  });

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImagesSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setProductImages([...productImages, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const removeProductImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleViewProduct = () => {
    const values = form.getValues();
    if (!values.title || !values.description) {
      alert("Please fill in at least title and description to preview");
      return;
    }

    const viewData: ViewProductData = {
      title: values.title,
      price: Number(values.price),
      description: values.description,
      stock: Number(values.stock),
      availability: values.availability,
      type: values.type,
      vendor: values.vendor,
      sku: values.sku,
      cover_image: coverPreview,
      product_images: imagePreviews,
      information: values.information || [],
    };
    setViewingProduct(viewData);
    setCurrentImageIndex(0);
  };

  const handleReset = () => {
    form.reset();
    setCoverImage(null);
    setCoverPreview(null);
    setProductImages([]);
    setImagePreviews([]);
    setViewingProduct(null);
    setCurrentImageIndex(0);
  };

  const onSubmit = async (formData: CreateProductFormType) => {
    const data = new FormData();

    // Append form fields
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", String(formData.price));
    data.append("stock", String(formData.stock));
    data.append("availability", formData.availability);
    data.append("type", formData.type);
    data.append("vendor", formData.vendor);
    data.append("currency", currencySymbol);
    data.append("is_active", true.toString());

    if (formData.categories) data.append("categories", formData.categories);
    if (formData.sku) data.append("sku", formData.sku);

    // Append information as JSON
    if (formData.information && formData.information.length > 0) {
      const informationObj = formData.information.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      );
      data.append("information", JSON.stringify(informationObj));
    }

    // Append cover image
    if (coverImage) {
      data.append("cover_image", coverImage);
    }

    // Append product images
    productImages.forEach((image) => {
      data.append("product_images", image);
    });

    createProductMutation.mutate(data);
  };

  const nextImage = () => {
    if (viewingProduct) {
      const totalImages = [
        viewingProduct.cover_image,
        ...viewingProduct.product_images,
      ].filter(Boolean).length;
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const prevImage = () => {
    if (viewingProduct) {
      const totalImages = [
        viewingProduct.cover_image,
        ...viewingProduct.product_images,
      ].filter(Boolean).length;
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const allImages = viewingProduct
    ? [viewingProduct.cover_image, ...viewingProduct.product_images].filter(
        Boolean,
      )
    : [];

  return (
    <>
      {/* Add Product Sheet */}
      <Sheet open={open && !viewingProduct} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:min-w-xl max-w-3xl p-0 overflow-y-auto"
        >
          <div className="p-6 bg-background">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Add new product
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Title and Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Product Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter product title"
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Price ({currencySymbol})
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="Enter product price"
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description with Cover Image */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-3 bg-muted p-4 rounded-lg">
                          {coverPreview ? (
                            <div className="relative shrink-0">
                              <img
                                src={coverPreview || "/placeholder.svg"}
                                alt="Cover"
                                className="h-24 w-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={removeCoverImage}
                                className="absolute -top-2 -right-2"
                              >
                                <Trash2
                                  size={20}
                                  className="text-destructive"
                                  fill="currentColor"
                                />
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex items-center justify-center w-24 h-24 border-2 border-dashed border-muted-foreground rounded-lg shrink-0 hover:bg-muted/50">
                              <div className="flex flex-col items-center text-xs text-center">
                                <Upload size={20} className="mb-1" />
                                <span>Cover</span>
                              </div>
                              <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverImageSelect}
                              />
                            </label>
                          )}
                          <Textarea
                            {...field}
                            placeholder="Enter product description"
                            className="bg-background border-0 flex-1 min-h-25"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Right Column Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Stock
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter product stock"
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Product Availability
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-muted">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(AVAILABILITY_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Product Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-muted">
                              <SelectValue placeholder="Select product type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(TYPE_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Vendor
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-muted">
                              <SelectValue placeholder="Select vendor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FMC">FMC</SelectItem>
                            <SelectItem value="Other Vendor">
                              Other Vendor
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Categories
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-muted">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(CATEGORY_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          SKU
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter SKU"
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Product Images */}
                <div className="space-y-3">
                  <FormLabel className="text-sm font-semibold block">
                    Product Images
                  </FormLabel>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <AnimatePresence>
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative shrink-0"
                        >
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Product ${index + 1}`}
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeProductImage(index)}
                            className="absolute -top-2 -right-2"
                          >
                            <Trash2
                              size={20}
                              className="text-destructive"
                              fill="currentColor"
                            />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <label className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground hover:bg-muted/50 shrink-0">
                      <div className="flex flex-col items-center text-xs text-center">
                        <div className="border border-primary p-2 rounded-lg mb-2">
                          <Upload
                            size={20}
                            className="text-primary"
                            strokeWidth={1.5}
                          />
                        </div>
                        <span className="px-2">Click to upload</span>
                      </div>
                      <input
                        ref={imagesInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleProductImagesSelect}
                      />
                    </label>
                  </div>
                </div>

                {/* Extra Information Repeater */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-semibold">
                      Extra Information
                    </FormLabel>
                    <Button
                      type="button"
                      onClick={() => append({ key: "", value: "" })}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Add Field
                    </Button>
                  </div>

                  <AnimatePresence>
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-2 items-end"
                      >
                        <FormField
                          control={form.control}
                          name={`information.${index}.key`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Key (e.g., Weight)"
                                  className="bg-muted"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`information.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Value (e.g., 500g)"
                                  className="bg-muted"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t gap-4">
                  <div />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleViewProduct}
                      variant="outline"
                      className="rounded-full px-8 bg-transparent"
                    >
                      View
                    </Button>
                    <Button
                      type="submit"
                      disabled={createProductMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                    >
                      {createProductMutation.isPending
                        ? "Saving..."
                        : "Save Product"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      {/* View Product Dialog */}
      <AnimatePresence>
        {viewingProduct && (
          <Dialog
            open={!!viewingProduct}
            onOpenChange={() => setViewingProduct(null)}
          >
            <DialogContent className="max-w-xl  max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Product Details
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-12 mt-6">
                {/* Image Gallery */}
                <div>
                  <div className="relative bg-muted rounded-xl overflow-hidden aspect-square mb-4">
                    {allImages.length > 0 && (
                      <>
                        <motion.img
                          key={currentImageIndex}
                          src={allImages[currentImageIndex] as string}
                          alt="Product"
                          className="w-full h-full object-contain p-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                            >
                              <ChevronLeft size={24} />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                            >
                              <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/50 text-background text-xs px-3 py-1 rounded-full">
                              {currentImageIndex + 1} / {allImages.length}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            currentImageIndex === index
                              ? "border-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          <img
                            src={(img as string) || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {viewingProduct.title}
                    </h2>
                    <p className="text-2xl font-semibold text-primary">
                      {currencySymbol}
                      {viewingProduct.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      By {viewingProduct.vendor} • SKU:{" "}
                      {viewingProduct.sku || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {viewingProduct.description}
                    </p>
                  </div>

                  {viewingProduct.information.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">
                        Specifications
                      </h3>
                      <div className="space-y-2">
                        {viewingProduct.information.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {item.key}:
                            </span>
                            <span className="font-medium text-foreground">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Quantity:</strong> {viewingProduct.stock}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Availability:</strong>{" "}
                      {viewingProduct.availability}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
