import { z } from "zod";

export const frequencyOptions = [
  { label: "Once Daily", value: "once_daily" },
  { label: "Twice Daily", value: "twice_daily" },
  { label: "Three Times Daily", value: "three_times_daily" },
  { label: "Four Times Daily", value: "four_times_daily" },
  { label: "Every 4 Hours", value: "every_4_hours" },
  { label: "Every 6 Hours", value: "every_6_hours" },
  { label: "Every 8 Hours", value: "every_8_hours" },
  { label: "Every 12 Hours", value: "every_12_hours" },
  { label: "As Needed", value: "as_needed" },
  { label: "Before Meals", value: "before_meals" },
  { label: "After Meals", value: "after_meals" },
  { label: "At Bedtime", value: "at_bedtime" },
  { label: "Custom", value: "custom" },
] as const;

export const medicineTypeOptions = [
  { label: "Tablet", value: "tablet" },
  { label: "Capsule", value: "capsule" },
  { label: "Syrup", value: "syrup" },
  { label: "Injection", value: "injection" },
  { label: "Cream", value: "cream" },
  { label: "Ointment", value: "ointment" },
  { label: "Drops", value: "drops" },
  { label: "Inhaler", value: "inhaler" },
  { label: "Patch", value: "patch" },
  { label: "Suppository", value: "suppository" },
  { label: "Solution", value: "solution" },
  { label: "Suspension", value: "suspension" },
  { label: "Powder", value: "powder" },
  { label: "Other", value: "other" },
] as const;

export const singleMedicationSchema = z.object({
  medicine: z.string().min(1, "Medicine is required"),
  quantity: z.string().min(1, "Quantity is required"),
  medicine_type: z.string().optional(),
  dosage: z.string().min(1, "Dosage is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  frequency: z.string().min(1, "Frequency is required"),
  custom_frequency: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.end_date && data.start_date) {
    return data.end_date >= data.start_date;
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["end_date"],
}).refine((data) => {
  if (data.frequency === "custom") {
    return !!data.custom_frequency && data.custom_frequency.trim().length > 0;
  }
  return true;
}, {
  message: "Custom frequency is required when 'Custom' is selected",
  path: ["custom_frequency"],
});

export const prescribeMedicationSchema = z.object({
  medications: z.array(singleMedicationSchema).min(1, "At least one medication is required"),
});

export const surgicalRequestSchema = z.object({
  procedure: z.string().min(1, "Procedure is required"),
  reason: z.string().min(1, "Reason for referral is required"),
  notes: z.string().optional(),
  surgery_date: z.date().optional()
});

export const investigationRequestSchema = z.object({
  investigation_type: z
    .array(z.string())
    .min(1, "Please select at least one test"),
});

export const assignPatientSchema = z.object({
  department: z.string().min(1, "Department is required"),
  doctor: z.string().min(1, "Doctor/Staff is required"),
});

export const encounterNoteSchema = z.object({
  main_complaints: z.string().min(1, "Main complaints are required"),
  present_illness_history: z.string().min(1, "History of present illness is required"),
  past_medical_history: z.string().optional(),
  previous_operations: z.string().optional(),
  received_medication: z.string().optional(),
  impressions: z.string().optional(),
  recommendation: z.string().optional(),
  start_timestamp: z.string().optional(),
  end_timestamp: z.string().optional(),
  additional_notes: z.record(z.string(), z.any()).optional(),
});

export type SingleMedicationFormValues = z.infer<typeof singleMedicationSchema>;
export type PrescribeMedicationFormValues = z.infer<typeof prescribeMedicationSchema>;
export type SurgicalRequestFormValues = z.infer<typeof surgicalRequestSchema>;
export type InvestigationRequestFormValues = z.infer<typeof investigationRequestSchema>;
export type AssignPatientFormValues = z.infer<typeof assignPatientSchema>;
export type EncounterNoteFormValues = z.infer<typeof encounterNoteSchema>;