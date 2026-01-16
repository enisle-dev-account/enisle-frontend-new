"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const patientDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  gender: z.string().min(1, "Gender is required"),
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  dob: z.string().min(1, "Date of birth is required"),
  marital_status: z.string().optional(),
  occupation: z.string().optional(),
  religion: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  country_code: z.string().min(1, "Country code is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  next_of_kin_first_name: z.string().min(1, "Next of kin first name is required"),
  next_of_kin_surname: z.string().min(1, "Next of kin surname is required"),
  next_of_kin_relationship: z.string().min(1, "Relationship is required"),
  next_of_kin_country_code: z.string().min(1, "Country code is required"),
  next_of_kin_phone: z.string().min(1, "Next of kin phone is required"),
  next_of_kin_address: z.string().min(1, "Next of kin address is required"),
  insurance_hmo: z.string().optional(),
  policy_holder: z.string().optional(),
  is_vip: z.boolean().default(false).optional(),
  nurse: z.string().min(1, "Nurse assignment is required"),
  specialty: z.string().min(1, "Specialty is required"),
  doctor: z.string().min(1, "Doctor assignment is required"),
})

export type PatientFormData = z.infer<typeof patientDetailsSchema>

interface PatientFormContextType {
  form: UseFormReturn<PatientFormData>
  currentStep: number
}

const PatientFormContext = createContext<PatientFormContextType | undefined>(undefined)

export function usePatientForm() {
  const context = useContext(PatientFormContext)
  if (!context) {
    throw new Error("usePatientForm must be used within PatientFormProvider")
  }
  return context
}

interface PatientFormProviderProps {
  children: React.ReactNode
  currentStep: number
}

export function PatientFormProvider({ children, currentStep }: PatientFormProviderProps) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: {
      title: "",
      gender: "",
      first_name: "",
      middle_name: "",
      surname: "",
      dob: "",
      marital_status: "",
      occupation: "",
      religion: "",
      phone: "",
      country_code: "ng",
      email: "",
      address: "",
      next_of_kin_first_name: "",
      next_of_kin_surname: "",
      next_of_kin_relationship: "",
      next_of_kin_country_code: "ng",
      next_of_kin_phone: "",
      next_of_kin_address: "",
      insurance_hmo: "",
      policy_holder: "",
      is_vip: false,
      nurse: "",
      specialty: "",
      doctor: "",
    },
  })

  return <PatientFormContext.Provider value={{ form, currentStep }}>{children}</PatientFormContext.Provider>
}
