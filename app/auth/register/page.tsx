"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, User, Mail, Building2, Stethoscope, FileText, Briefcase, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@/components/icon"
import { BrandingCarousel } from "@/components/branding-carousel"

const USER_TYPES: { value: string; label: string; fields: string[] }[] = [
  { value: "admin", label: "Admin", fields: [] },
  { value: "cashier", label: "Cashier", fields: [] },
  { value: "doctor", label: "Doctor", fields: ["specialty", "medicalLicense"] },
  { value: "laboratory", label: "Laboratory", fields: ["department"] },
  { value: "nurse", label: "Nurse", fields: ["department"] },
  { value: "pharmacy", label: "Pharmacy", fields: ["licenseNumber"] },
  { value: "radiology", label: "Radiology", fields: ["department"] },
  { value: "reception", label: "Reception", fields: [] },
  { value: "store", label: "Store", fields: [] },
  { value: "surgery", label: "Surgery", fields: ["specialty"] },
]

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email address"),
  hospitalClinic: z.string().min(2, "Hospital/Clinic name is required"),
  userType: z.string().min(1, "Please select a user type"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  position: z.string().optional(),
  specialty: z.string().optional(),
  medicalLicense: z.string().optional(),
  department: z.string().optional(),
  licenseNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if ((data.userType === "doctor" || data.userType === "surgery") && !data.specialty) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Specialty is required", path: ["specialty"] });
  }
  if (data.userType === "doctor" && !data.medicalLicense) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Medical License is required", path: ["medicalLicense"] });
  }
  if (["laboratory", "nurse", "radiology"].includes(data.userType) && !data.department) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Department is required", path: ["department"] });
  }
  if (data.userType === "pharmacy" && !data.licenseNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "License Number is required", path: ["licenseNumber"] });
  }
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      hospitalClinic: "",
      userType: "",
      position: "",
      password: "",
      specialty: "",
      medicalLicense: "",
      department: "",
      licenseNumber: "",
    },
  })

  const selectedUserType = form.watch("userType");

  const onSubmit = (values: FormValues) => {
    console.log(values)
  }

  const shouldShowField = (fieldName: string) => {
    const userTypeConfig = USER_TYPES.find((type) => type.value === selectedUserType)
    return userTypeConfig?.fields.includes(fieldName as any)
  }

  return (
    <div className="min-h-screen flex bg-secondary">
      <BrandingCarousel />

      <div className="flex-1 flex items-center justify-center p-8 bg-white md:rounded-l-[1.5rem] overflow-hidden ">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden gap-3 mb-8">
            <Icon name="logo" size={78} className="mb-12 bg-black scale-180 ml-7 z-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome to Enisle</h2>
            <p className="text-sm text-gray-500">Enter your details to create an account on Enisle</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="Enter your first name" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="Enter your last name" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Email Address (work)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input type="email" placeholder="Enter your work email address" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hospital/Clinic */}
              <FormField
                control={form.control}
                name="hospitalClinic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Hospital/Clinic</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="Enter your hospital name" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User Type */}
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Fields */}
              {/* Specialty - for Doctor and Surgery */}
              {shouldShowField("specialty") && (
                <FormField
                  control={form.control}
                  name={"specialty" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Specialty</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="Enter your specialty" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Medical License Number - for Doctor only */}
              {shouldShowField("medicalLicense") && (
                <FormField
                  control={form.control}
                  name={"medicalLicense" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Medical License Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="Enter your medical license number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Department - for Laboratory, Nurse, Radiology */}
              {shouldShowField("department") && (
                <FormField
                  control={form.control}
                  name={"department" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Department</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="Enter your department" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* License Number - for Pharmacy */}
              {shouldShowField("licenseNumber") && (
                <FormField
                  control={form.control}
                  name={"licenseNumber" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">License Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="Enter your license number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Position - Optional for all */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Position (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="Enter your position" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-[#2271FE] hover:bg-blue-500 text-white">
                Sign up
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-400 hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
