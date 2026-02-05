import { z } from "zod";

export const surgerySchema = z.object({
  procedure: z.string().min(1, "Procedure is required"),
  cpt_code: z.string().optional(),
  anesthesia_type: z.string().optional(),
  operative_site: z.string().optional(),
  description: z.string().min(1, "Procedure description is required"),
  recovery_notes: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  concentration: z.string().optional(),
  route: z.string().optional(),
  site: z.string().optional(),
  quantity: z.string().optional(),
  surgery_date: z.date().optional(),
  additional_fields: z.record(z.string()).optional(),
});

export type SurgeryFormValues = z.infer<typeof surgerySchema>;