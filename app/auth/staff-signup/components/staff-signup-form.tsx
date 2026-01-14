"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Lock, AlertCircle, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@/components/icon"
import { useStaffRegister } from "@/hooks/api"

const STAFF_TYPES_WITH_LICENSE = ["doctor", "nurse", "surgeon", "pharmacist", "laboratory", "radiology"]

const POSITIONS = [
  { value: "chief_administrator", label: "Chief Administrator" },
  { value: "senior_nurse", label: "Senior Nurse" },
  { value: "physician", label: "Physician" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "surgeon", label: "Surgeon" },
  { value: "lead", label: "Lead" },
]

const SPECIALTIES = [
  { value: "cardiologist", label: "Cardiologist" },
  { value: "neurologist", label: "Neurologist" },
  { value: "pediatrician", label: "Pediatrician" },
  { value: "orthopedic", label: "Orthopedic" },
  { value: "surgeon", label: "Surgeon" },
  { value: "anesthesiologist", label: "Anesthesiologist" },
  { value: "dermatologist", label: "Dermatologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
]

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    licenseNumber: z.string().optional(),
    position: z.string().optional(),
    speciality: z.string().optional(),
    mobile: z.string().optional(),
    address: z.string().optional(),
    country: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export function StaffSignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const hospital = searchParams.get("hospital")
  const role = searchParams.get("role")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      licenseNumber: "",
      position: "",
      speciality: "",
      mobile: "",
      address: "",
      country: "",
    },
  })

  const registerMutation = useStaffRegister({
    onSuccess: () => router.push("/admin"),
    onError: (error) => {
      setErrorMessage(error.message || "Registration failed.")
      window.scrollTo(0, 0)
    },
  })

  useEffect(() => {
    if (!token || !email || !role) {
      setErrorMessage("Invalid invitation link. Please check your email for the correct link.")
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }, [token, email, role])

  const onSubmit = async (values: FormValues) => {
    if (!token) return

    setErrorMessage(null)
    const { confirmPassword, ...payload } = values

    const requestData: any = {
      token,
      first_name: payload.firstName,
      last_name: payload.lastName,
      password: payload.password,
    }

    if (payload.mobile) requestData.mobile = payload.mobile
    if (payload.address) requestData.address = payload.address
    if (payload.country) requestData.country = payload.country
    if (payload.speciality) requestData.speciality = payload.speciality
    if (payload.position) requestData.position = payload.position

    if (STAFF_TYPES_WITH_LICENSE.includes(role || "")) {
      if (!payload.licenseNumber) {
        setErrorMessage("License number is required for your position")
        return
      }
      requestData.license_number = payload.licenseNumber
    }

    registerMutation.mutate(requestData)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-white md:rounded-l-[32px] overflow-hidden">
        <div className="w-full max-w-md">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white md:rounded-l-[32px] overflow-hidden">
      <div className="w-full max-w-md space-y-6">
        <div className="lg:hidden mb-8">
          <Icon name="logo" size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-sm text-gray-500">
            Welcome to <span className="font-semibold text-gray-700">{hospital}</span>
          </p>
        </div>

        {errorMessage && (
          <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="rounded-lg border border-slate-100 p-3 bg-slate-50/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900 capitalize">{role}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" {...field} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type={showPassword ? "text" : "password"} className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {STAFF_TYPES_WITH_LICENSE.includes(role || "") && (
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your license number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col gap-4">
              {/* <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POSITIONS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPECIALTIES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="+234 801 000 0000" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Enter your address" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#2271FE] h-11 font-semibold"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Completing Registration..." : "Complete Registration"}
            </Button>
          </form>
        </Form>

        <p className="text-xs text-center text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
