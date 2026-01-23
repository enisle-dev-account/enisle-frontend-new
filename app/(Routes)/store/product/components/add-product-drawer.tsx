"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { request, useApiQuery } from "@/hooks/api";
import type { Product, ProductInformationItem } from "@/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
import { Upload, Trash2, Plus } from "lucide-react";
import {
  AVAILABILITY_LABELS,
  CATEGORY_LABELS,
  createProductSchema,
  TYPE_LABELS,
} from "../schemas/product.schema";
import { ProductDetailsDrawer } from "./products-details-drawer";
import { FormSkeleton } from "./skeletons/form-skeleton";
import { toBase64 } from "@/lib/utils";
import { shimmer } from "@/components/image-shimmer";
import Image from "next/image";

type CreateProductFormType = z.infer<typeof createProductSchema>;

interface AddProductDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  currencySymbol?: string;
  editingProductId?: string | null;
}

interface ExistingImage {
  id: string | number;
  file: string;
  isExisting: true;
}

interface NewImage {
  file: File;
  preview: string;
  isExisting: false;
}

type ImageType = ExistingImage | NewImage;

export function AddProductDrawer({
  open,
  onOpenChange,
  onSuccess,
  currencySymbol = "₦",
  editingProductId,
}: AddProductDrawerProps) {
  const [coverImage, setCoverImage] = useState<ImageType | null>(null);
  const [productImages, setProductImages] = useState<ImageType[]>([]);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!editingProductId;

  // Fetch product data if editing
  const { data: existingProduct, isLoading: isProductLoading } =
    useApiQuery<Product>(
      ["product", editingProductId ? editingProductId : ""],
      `/store/list/${editingProductId}/`,
      {
        queryKey: ["product", editingProductId ? editingProductId : ""],
        enabled: isEditMode && !!editingProductId,
      },
    );

  const form = useForm<CreateProductFormType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      vendor: "",
      sku: "",
      availability: "available",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "information",
  });

  // Populate form when editing
  useEffect(() => {
    if (existingProduct && isEditMode) {
      form.reset({
        title: existingProduct.title,
        description: existingProduct.description,
        price: existingProduct.price,
        stock: existingProduct.stock,
        vendor: existingProduct.vendor,
        sku: existingProduct.sku || "",
        availability: existingProduct.availability as any,
        type: existingProduct.type as any,
        categories: existingProduct.categories as any,
        information: Object.entries(existingProduct.information || {}).map(
          ([key, value]) => ({ key, value }),
        ),
      });

      // Set existing images
      if (existingProduct.cover_image) {
        setCoverImage({
          id: existingProduct.cover_image.id,
          file: existingProduct.cover_image.file,
          isExisting: true,
        });
      }

      if (existingProduct.product_images) {
        setProductImages(
          existingProduct.product_images.map((img) => ({
            id: img.id,
            file: img.file,
            isExisting: true,
          })),
        );
      }
    } else {
      form.reset({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        vendor: "",
        sku: "",
        information: [],
        availability: "available",
      });

      setCoverImage(null);
      setProductImages([]);
    }
  }, [existingProduct, isEditMode, form]);

  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const endpoint = isEditMode
        ? `/store/product/update/${editingProductId}/`
        : "/store/product/create/";

      const method = isEditMode ? "PATCH" : "POST";

      const response = await request(endpoint, {
        method,
        body: data,
      });
      return response;
    },
    onSuccess: () => {
      onSuccess(
        isEditMode
          ? "Product updated successfully!"
          : "Product created successfully!",
      );
      handleReset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error("Product operation failed:", error);
      alert(error.message || "Failed to save product. Please try again.");
    },
  });

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage({
          file,
          preview: reader.result as string,
          isExisting: false,
        });
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

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImages((prev) => [
            ...prev,
            {
              file,
              preview: reader.result as string,
              isExisting: false,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const removeProductImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleViewProduct = () => {
    const values = form.getValues();
    if (!values.title || !values.description) {
      alert("Please fill in at least title and description to preview");
      return;
    }

    const viewData: Product = {
      id: editingProductId || "preview",
      title: values.title,
      price: Number(values.price),
      description: values.description,
      stock: Number(values.stock),
      availability: values.availability,
      type: values.type,
      vendor: values.vendor,
      sku: values.sku,
      currency: currencySymbol,
      cover_image: coverImage
        ? {
            id: coverImage.isExisting ? coverImage.id : "preview",
            file: coverImage.isExisting ? coverImage.file : coverImage.preview,
            file_type: "cover_image",
            is_active: true,
          }
        : (null as any),
      product_images: productImages.map((img, idx) => ({
        id: img.isExisting ? img.id : `preview-${idx}`,
        file: img.isExisting ? img.file : img.preview,
        file_type: "product_image",
        is_active: true,
      })),
      information: (values.information || []).reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      is_active: true,
      hospital: "",
      created_by: "",
      categories: values.categories,
    };

    setViewingProduct(viewData);
  };

  const handleReset = () => {
    form.reset();
    setCoverImage(null);
    setProductImages([]);
    setViewingProduct(null);
  };

  const onSubmit = async (formData: CreateProductFormType) => {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", String(formData.price));
    data.append("stock", String(formData.stock));
    data.append("availability", formData.availability);
    data.append("type", formData.type);
    data.append("vendor", formData.vendor);
    data.append("is_active", "true");
    data.append("currency", currencySymbol);

    if (formData.categories) data.append("categories", formData.categories);
    if (formData.sku) data.append("sku", formData.sku);

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

    const keepImageIds: (string | number)[] = [];

    if (coverImage) {
      if (coverImage.isExisting) {
        keepImageIds.push(coverImage.id);
      } else {
        data.append("cover_image", coverImage.file);
      }
    }

    productImages.forEach((img) => {
      if (img.isExisting) {
        keepImageIds.push(img.id);
      } else {
        data.append("product_images", img.file);
      }
    });

    data.append("keep_images", JSON.stringify(keepImageIds));

    createProductMutation.mutate(data);
  };

  const getImageUrl = (img: ImageType) => {
    return img.isExisting ? img.file : img.preview;
  };
  const showLoader = isEditMode && isProductLoading;
  return (
    <>
      {/* Add/Edit Product Sheet */}
      <Sheet open={open && !viewingProduct} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:min-w-xl max-w-3xl p-0 overflow-y-auto"
        >
          <div className="p-6 bg-background">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {isEditMode ? "Edit product" : "Add new product"}
              </h2>
            </div>
            {showLoader ? (
              <FormSkeleton />
            ) : (
              <Form {...form}>
                <div className="space-y-6">
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
                              className="bg-[#F5F5F5] border-0"
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
                              className="bg-[#F5F5F5] border-0"
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
                          <div className="flex gap-3 bg-[#F5F5F5] border-0 p-4 rounded-lg">
                            {coverImage ? (
                              <div className="relative shrink-0">
                                <Image
                                  src={getImageUrl(coverImage)}
                                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                                  width={96}
                                  height={96}
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
                              <label className="cursor-pointer flex items-center justify-center w-24 h-24 border-2 border-dashed border-muted-foreground rounded-lg shrink-0 hover:bg-[#F5F5F5] border-0/50">
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
                              className="bg-[#F5F5F5] border-0"
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F5F5F5] w-full border-0">
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F5F5F5] w-full border-0">
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F5F5F5 w-full border-0">
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#F5F5F5] w-full border-0">
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
                              className="bg-[#F5F5F5] border-0"
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
                        {productImages.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative shrink-0"
                          >
                            <Image
                              src={getImageUrl(image)}
                              placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                              width={123}
                              height={123}
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

                      <label className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground hover:bg-[#F5F5F5] border-0/50 shrink-0">
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
                                    className="bg-[#F5F5F5] border-0"
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
                                    className="bg-[#F5F5F5] border-0"
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
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={createProductMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                      >
                        {createProductMutation.isPending
                          ? "Saving..."
                          : isEditMode
                            ? "Update Product"
                            : "Save Product"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Preview Drawer */}
      {viewingProduct && (
        <ProductDetailsDrawer
          productId={viewingProduct.id}
          open={!!viewingProduct}
          onOpenChange={(open) => !open && setViewingProduct(null)}
          onRefetch={() => {}}
          previewData={viewingProduct}
        />
      )}
    </>
  );
}
