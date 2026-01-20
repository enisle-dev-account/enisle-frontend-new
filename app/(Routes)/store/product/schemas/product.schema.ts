import z from "zod";

const productInformationSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
})
export const AvailabilityEnum = z.enum([
  "available",
  "out_of_stock",
]);

export const ProductCategoryEnum = z.enum([
  "protective_products",
  "electronic_devices",
  "surgical_products",
  "other",
]);
export const ProductTypeEnum = z.enum([
  "store",
  "pharmarcy",
]);


export const createProductSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().nonnegative("Quantity must be non-negative"),
  availability: AvailabilityEnum,
  type: ProductTypeEnum,
  vendor: z.string().min(1, "Vendor is required"),
  categories: ProductCategoryEnum,
  sku: z.string().optional(),
  information: z.array(productInformationSchema).optional(),
})


export const AVAILABILITY_LABELS: Record<
  z.infer<typeof AvailabilityEnum>,
  string
> = {
  available: "Available",
  out_of_stock: "Out of Stock",
};
export const TYPE_LABELS: Record<
  z.infer<typeof ProductTypeEnum>,
  string
> = {
  store: "Store",
  pharmarcy: "Pharmacy",
};




export const CATEGORY_LABELS: Record<
  z.infer<typeof ProductCategoryEnum>,
  string
> = {
  protective_products: "Protective Products",
  electronic_devices: "Electronic Devices",
  surgical_products: "Surgical Products",
  other: "Other",
};
