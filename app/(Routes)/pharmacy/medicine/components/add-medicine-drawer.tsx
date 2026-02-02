"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { request, useApiQuery } from "@/hooks/api";
import type { MedicinesData, ProductInformationItem } from "@/types";
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
  MEDICINE_TYPE_LABELS,
  MEDICINE_CATEGORY_LABELS,
  CURRENCY_LABELS,
  CURRENCY_SYMBOLS,
  createMedicineSchema,
} from "../schemas/medicine.schems";
import { toBase64 } from "@/lib/utils";
import { shimmer } from "@/components/image-shimmer";
import Image from "next/image";
import { FormSkeleton } from "@/app/(Routes)/store/product/components/skeletons/form-skeleton";

type CreateMedicineFormType = z.infer<typeof createMedicineSchema>;

interface AddMedicineDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  editingMedicineId?: string | null;
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

export function AddMedicineDrawer({
  open,
  onOpenChange,
  onSuccess,
  editingMedicineId,
}: AddMedicineDrawerProps) {
  const [coverImage, setCoverImage] = useState<ImageType | null>(null);
  const [productImages, setProductImages] = useState<ImageType[]>([]);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!editingMedicineId;

  // Fetch medicine data if editing
  const {
    data: existingMedicine,
    isLoading: isMedicineLoading,
    refetch,
  } = useApiQuery<MedicinesData>(
    ["medicine", editingMedicineId || ""],
    `/pharmacy/products/list/${editingMedicineId}`,
    {
      queryKey: [editingMedicineId],
      enabled: isEditMode && !!editingMedicineId,
    },
  );

  const form = useForm<CreateMedicineFormType>({
    resolver: zodResolver(createMedicineSchema),
    defaultValues: {
      title: "",
      generic_name: "",
      weight: "",
      category: "",
      description: "",
      price: 0,
      currency: "NGN",
      quantity: 0,
      availability: "available",
      type: "medicine",
      vendor: "",
      vendor_price: 0,
      expiry_date: "",
      popularity_rating: 0,
      information: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "information",
  });

  const selectedCurrency = form.watch("currency");
  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency] || "₦";

  // Populate form when editing
  useEffect(() => {
    if (existingMedicine && isEditMode) {
      form.reset({
        title: existingMedicine.title,
        generic_name: existingMedicine.generic_name || "",
        weight: existingMedicine.weight,
        category: existingMedicine.category || "",
        description: existingMedicine.description || "",
        price: existingMedicine.price,
        currency: existingMedicine.currency as any,
        quantity: existingMedicine.quantity,
        availability: existingMedicine.availability as any,
        type: existingMedicine.type as any,
        vendor: existingMedicine.vendor,
        vendor_price: existingMedicine.vendor_price || 0,
        expiry_date: existingMedicine.expiry_date,
        popularity_rating: existingMedicine.popularity_rating || 0,
        information: Object.entries(existingMedicine.information || {}).map(
          ([key, value]) => ({ key, value }),
        ),
      });

      // Set existing images
      if (existingMedicine.cover_image) {
        setCoverImage({
          id: existingMedicine.cover_image.id,
          file: existingMedicine.cover_image.file,
          isExisting: true,
        });
      }

      if (existingMedicine.product_images) {
        setProductImages(
          existingMedicine.product_images.map((img) => ({
            id: img.id,
            file: img.file,
            isExisting: true,
          })),
        );
      }
    } else {
      form.reset({
        title: "",
        generic_name: "",
        weight: "",
        category: "",
        description: "",
        price: 0,
        currency: "NGN",
        quantity: 0,
        availability: "available",
        type: "medicine",
        vendor: "",
        vendor_price: 0,
        expiry_date: "",
        popularity_rating: 0,
        information: [],
      });

      setCoverImage(null);
      setProductImages([]);
    }
  }, [existingMedicine, isEditMode, form]);

  const createMedicineMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const endpoint = isEditMode
        ? `/pharmacy/product/update/${editingMedicineId}/`
        : "/pharmacy/product/create/";

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
          ? "Medicine updated successfully!"
          : "Medicine created successfully!",
      );
      handleReset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error("Medicine operation failed:", error);
      alert(error.message || "Failed to save medicine. Please try again.");
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

  const handleReset = () => {
    form.reset();
    setCoverImage(null);
    setProductImages([]);
  };

  const onSubmit = async (formData: CreateMedicineFormType) => {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("weight", formData.weight);
    data.append("price", String(formData.price));
    data.append("currency", formData.currency);
    data.append("quantity", String(formData.quantity));
    data.append("availability", formData.availability);
    data.append("type", formData.type);
    data.append("vendor", formData.vendor);
    data.append("expiry_date", formData.expiry_date);
    data.append("is_active", "true");

    if (existingMedicine && formData.quantity !== existingMedicine?.quantity) {
      data.append("starting_stock", String(formData.quantity));
      data.append("current_stock", String(formData.quantity));
    } else {
      data.append("starting_stock", String(formData.quantity));
      data.append("current_stock", String(formData.quantity));
    }

    if (formData.generic_name)
      data.append("generic_name", formData.generic_name);
    if (formData.category) data.append("category", formData.category);
    if (formData.description) data.append("description", formData.description);
    if (formData.vendor_price)
      data.append("vendor_price", String(formData.vendor_price));
    if (formData.popularity_rating)
      data.append("popularity_rating", String(formData.popularity_rating));

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

    createMedicineMutation.mutate(data);
  };

  const getImageUrl = (img: ImageType) => {
    return img.isExisting ? img.file : img.preview;
  };

  const showLoader = isEditMode && isMedicineLoading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:min-w-xl max-w-3xl p-0 overflow-y-auto"
      >
        <div className="p-6 bg-background">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isEditMode ? "Edit medicine" : "Add new medicine"}
            </h2>
          </div>
          {showLoader ? (
            <FormSkeleton />
          ) : (
            <Form {...form}>
              <div className="space-y-6">
                {/* Title and Generic Name Row */}
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
                    name="generic_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Generic Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter generic name"
                            className="bg-[#F5F5F5] border-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Weight and Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Weight
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 500mg"
                            className="bg-[#F5F5F5] border-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Currency
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#F5F5F5] w-full border-0">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(CURRENCY_LABELS).map(
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

                {/* Quantity, Availability, Type, Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Quantity
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter quantity"
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
                          Availability
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
                            {Object.entries(MEDICINE_TYPE_LABELS).map(
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Category
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter category"
                            className="bg-[#F5F5F5] border-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Vendor, Vendor Price, Currency Row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Vendor
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter vendor name"
                            className="bg-[#F5F5F5] border-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendor_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Vendor Price ({currencySymbol})
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="Enter vendor price"
                            className="bg-[#F5F5F5] border-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Expiry Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
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
                                  placeholder="Key (e.g., Dosage)"
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
                                  placeholder="Value (e.g., 2 tablets daily)"
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
                <div className="flex justify-end items-center pt-6 border-t gap-4">
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={createMedicineMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                  >
                    {createMedicineMutation.isPending
                      ? "Saving..."
                      : isEditMode
                        ? "Update Medicine"
                        : "Save Medicine"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
