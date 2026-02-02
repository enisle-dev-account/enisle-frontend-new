import z from "zod";

const medicineInformationSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

export const AvailabilityEnum = z.enum(["available", "out_of_stock"]);

export const MedicineTypeEnum = z.enum([
  "medicine",
  "health_and_wellness",
  "personal_care",
  "first_aid",
  "medical_equipment",
]);

export const MedicineCategoryEnum = z.enum([
  "antibiotics",
  "pain_relief",
  "cardiovascular",
  "diabetes",
  "respiratory",
  "gastrointestinal",
  "dermatology",
  "vitamins_supplements",
  "mental_health",
  "other",
]);

export const CurrencyEnum = z.enum(["NGN", "USD", "GBP"]);

export const createMedicineSchema = z.object({
  title: z
    .string()
    .min(1, "Product title is required")
    .max(255, "Title cannot be more than 255 characters"),
  generic_name: z.string().optional(),
  weight: z.string().min(1, "Weight is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  currency: CurrencyEnum,
  quantity: z.coerce.number().nonnegative("Quantity must be non-negative"),
  availability: AvailabilityEnum,
  type: MedicineTypeEnum,
  vendor: z.string().min(1, "Vendor is required"),
  vendor_price: z.coerce.number().nonnegative("Vendor price must be non-negative").optional(),
  expiry_date: z.string().min(1, "Expiry date is required"),
  popularity_rating: z.coerce.number().min(0).max(5).optional(),
  information: z.array(medicineInformationSchema).optional(),
});

export const AVAILABILITY_LABELS: Record<
  z.infer<typeof AvailabilityEnum>,
  string
> = {
  available: "Available",
  out_of_stock: "Out of Stock",
};

export const MEDICINE_TYPE_LABELS: Record<
  z.infer<typeof MedicineTypeEnum>,
  string
> = {
  medicine: "Medicine",
  health_and_wellness: "Health and Wellness",
  personal_care: "Personal Care",
  first_aid: "First Aid",
  medical_equipment: "Medical Equipment",
};

export const MEDICINE_CATEGORY_LABELS: Record<
  z.infer<typeof MedicineCategoryEnum>,
  string
> = {
  antibiotics: "Antibiotics",
  pain_relief: "Pain Relief",
  cardiovascular: "Cardiovascular",
  diabetes: "Diabetes",
  respiratory: "Respiratory",
  gastrointestinal: "Gastrointestinal",
  dermatology: "Dermatology",
  vitamins_supplements: "Vitamins & Supplements",
  mental_health: "Mental Health",
  other: "Other",
};

export const CURRENCY_LABELS: Record<z.infer<typeof CurrencyEnum>, string> = {
  NGN: "₦ Nigerian Naira",
  USD: "$ US Dollar",
  GBP: "£ British Pound",
};

export const CURRENCY_SYMBOLS: Record<z.infer<typeof CurrencyEnum>, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
};