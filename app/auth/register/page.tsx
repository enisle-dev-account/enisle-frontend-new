"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, User, Mail, Building2, MapPin, Lock, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrandingCarousel } from "@/components/branding-carousel"
import { Icon } from "@/components/icon"
import { useAdminRegister, useApiMutation } from "@/hooks/api"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const HOSPITAL_TYPES = [
  { value: "general_hospital", label: "General Hospital" },
  { value: "specialty_hospital", label: "Specialty Hospital" },
  { value: "clinic", label: "Clinic" },
  { value: "diagnostic_center", label: "Diagnostic Center" },
  { value: "nursing_home", label: "Nursing Home" },
  { value: "optical_clinic", label: "Optical Clinic" },
  { value: "dental_clinic", label: "Dental Clinic" },
  { value: "maternity_center", label: "Maternity Center" },
]

const COUNTRIES = [
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "ke", label: "Kenya" },
  { value: "za", label: "South Africa" },
]

const STATES_BY_COUNTRY: Record<string, { value: string; label: string }[]> = {
  ng: [
    { value: "abia", label: "Abia" },
    { value: "adamawa", label: "Adamawa" },
    { value: "akwa_ibom", label: "Akwa Ibom" },
    { value: "anambra", label: "Anambra" },
    { value: "bauchi", label: "Bauchi" },
    { value: "bayelsa", label: "Bayelsa" },
    { value: "benue", label: "Benue" },
    { value: "borno", label: "Borno" },
    { value: "cross_river", label: "Cross River" },
    { value: "delta", label: "Delta" },
    { value: "ebonyi", label: "Ebonyi" },
    { value: "edo", label: "Edo" },
    { value: "ekiti", label: "Ekiti" },
    { value: "enugu", label: "Enugu" },
    { value: "fct", label: "FCT" },
    { value: "gombe", label: "Gombe" },
    { value: "imo", label: "Imo" },
    { value: "jigawa", label: "Jigawa" },
    { value: "kaduna", label: "Kaduna" },
    { value: "kano", label: "Kano" },
    { value: "katsina", label: "Katsina" },
    { value: "kebbi", label: "Kebbi" },
    { value: "kogi", label: "Kogi" },
    { value: "kwara", label: "Kwara" },
    { value: "lagos", label: "Lagos" },
    { value: "nasarawa", label: "Nasarawa" },
    { value: "niger", label: "Niger" },
    { value: "ogun", label: "Ogun" },
    { value: "ondo", label: "Ondo" },
    { value: "osun", label: "Osun" },
    { value: "oyo", label: "Oyo" },
    { value: "plateau", label: "Plateau" },
    { value: "rivers", label: "Rivers" },
    { value: "sokoto", label: "Sokoto" },
    { value: "taraba", label: "Taraba" },
    { value: "yobe", label: "Yobe" },
    { value: "zamfara", label: "Zamfara" },
  ],
  gh: [
    { value: "ashanti", label: "Ashanti" },
    { value: "accra", label: "Accra" },
    { value: "eastern", label: "Eastern" },
    { value: "western", label: "Western" },
  ],
  ke: [
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
    { value: "kisumu", label: "Kisumu" },
  ],
  za: [
    { value: "gauteng", label: "Gauteng" },
    { value: "western_cape", label: "Western Cape" },
    { value: "kwazulu_natal", label: "KwaZulu-Natal" },
  ],
}

const formSchema = z.object({
  // Step 1: Organization
  hospitalName: z.string().min(2, "Hospital name is required"),
  hospitalType: z.string().min(1, "Please select a hospital type"),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "City is required"),
  // Step 2: Admin
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  otp: z.string().length(6, "Verification code must be 6 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormValues = z.infer<typeof formSchema>

export default function AdminRegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", otp: "", hospitalName: "",
      hospitalType: "", country: "", state: "", city: "", password: "", confirmPassword: "",
    },
  })

  const registerMutation = useAdminRegister({
    onSuccess: () => router.push("/admin"),
    onError: (error) => setErrorMessage(error.message || "Registration failed."),
  })

  const sendVerification = useApiMutation<any>("POST", "/auth/send-verification-email/", {
      onSuccess: () => {
      },
      onError: (error: any) => {
        console.log("[v0] Invite error:", error)
      },
    })

  const selectedCountry = form.watch("country")
  const states = selectedCountry ? STATES_BY_COUNTRY[selectedCountry] || [] : []

  const handleVerifyEmail = async () => {
    const email = form.getValues("email")
    const isValidEmail = await form.trigger("email")
    
    if (isValidEmail) {
      setIsVerifyingEmail(true)
      console.log("Sending verification code to:", email)
      sendVerification.mutate({ email })
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ["hospitalName", "hospitalType", "country", "state", "city"] 
      : ["firstName", "lastName", "email", "otp", "password", "confirmPassword"];
    
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep((s) => s + 1);
  }

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(null)
    // Strip confirmPassword before sending to API
    const { confirmPassword, ...payload } = values
    registerMutation.mutate({
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      password: payload.password,
      hospital_name: payload.hospitalName,
      hospital_type: payload.hospitalType,
      country: payload.country,
      state: payload.state,
      city: payload.city,
      verification_code: payload.otp,
    })
  }

  return (
    <div className="min-h-screen flex bg-secondary">
      <BrandingCarousel />

      <div className="flex-1 flex items-center justify-center p-8 bg-white md:rounded-l-[32px] overflow-hidden">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden mb-8"><Icon name="logo" size={32} /></div>

          <div className="space-y-2 w-full">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Organization Profile" : "Administrator Details"}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 1 ? "Tell us about your healthcare facility" : "Complete your admin security profile"}
            </p>
            <div className="flex items-center gap-2 mb-1 w-full pt-2">
               <span className={`h-1.5 w-full rounded-full transition-all ${step >= 1 ? 'bg-[#2271FE]' : 'bg-gray-200'}`} />
               <span className={`h-1.5 w-full rounded-full transition-all ${step === 2 ? 'bg-[#2271FE]' : 'bg-gray-200'}`} />
            </div>
          </div>

          {errorMessage && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <FormField control={form.control} name="hospitalName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="e.g. St. Mary's Clinic" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="hospitalType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>{HOSPITAL_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="flex flex-col gap-4">
                    <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Country" /></SelectTrigger></FormControl>
                          <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCountry}>
                          <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="State" /></SelectTrigger></FormControl>
                          <SelectContent>{states.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="Enter city" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="button" onClick={nextStep} className="w-full bg-[#2271FE] h-11">
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input placeholder="John" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="space-y-4 rounded-lg border border-slate-100 p-3 bg-slate-50/50">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Admin Email Address</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="email" placeholder="admin@hospital.com" className="pl-10 pr-20" {...field} />
                            <button 
                                type="button"
                                onClick={handleVerifyEmail}
                                className="absolute right-2 top-1.5 px-3 py-1.5 text-xs font-semibold text-[#2271FE] hover:bg-blue-50 rounded-md transition-colors"
                            >
                                {( sendVerification.isPending) ? "Sending..." : "Send Code"}
                            </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="otp" render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-gray-500 font-bold">Verification Code</FormLabel>
                        <FormControl>
                            <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup className="w-full justify-between gap-2">
                                <InputOTPSlot index={0} className="flex-1" />
                                <InputOTPSlot index={1} className="flex-1" />
                                <InputOTPSlot index={2} className="flex-1" />
                                <InputOTPSlot index={3} className="flex-1" />
                                <InputOTPSlot index={4} className="flex-1" />
                                <InputOTPSlot index={5} className="flex-1" />
                            </InputOTPGroup>
                            </InputOTP>
                        </FormControl>
                        <FormDescription>Enter the 6-digit code sent to your email.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Create Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" {...field} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
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
                    )} />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" className="flex-[2] bg-[#2271FE] h-11 font-semibold" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? "Setting up..." : "Complete Registration"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>

          <p className="text-center text-sm text-gray-500">
            Already have an account? <a href="/auth/login" className="text-[#2271FE] font-bold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
