"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { BrandingCarousel } from "@/components/branding-carousel"
import { Icon } from "@/components/icon"
import { useLogin } from "@/hooks/api"
import { ApiError } from "@/lib/aux-classes"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useLogin({
    onSuccess: () => {
      router.push("/admin")
    },
    onError: (error) => {
        if (error instanceof ApiError) {
          if (error.data.non_field_errors) {
            toast.error(error.data.non_field_errors[0], {
                position: "top-right",
            })
            form.setError("email", { message: error.data.non_field_errors[0] })
            form.setError("password", { message: error.data.non_field_errors[0] })
          }
        }
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    })
  }

  return (
    <div className="min-h-screen flex bg-secondary">
      <BrandingCarousel />

      <div className="flex-1 flex items-center justify-center p-8 bg-white md:rounded-l-[32px] overflow-hidden">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden mb-8">
            <Icon name="logo" size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your Enisle account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input type="email" placeholder="admin@hospital.com" className="pl-10 h-11" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold text-gray-700">Password</FormLabel>
                      <a href="/auth/forgot-password" className="text-sm text-[#2271FE] hover:underline">
                        Forgot?
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-11"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#2271FE] hover:bg-[#1a5ad8] h-11 font-semibold text-base"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 border-2 border-[#2271FE] text-[#2271FE] hover:bg-blue-50 bg-transparent"
            onClick={() => router.push("/auth/register")}
          >
            Set up your hospital
          </Button>

          <p className="text-center text-xs text-gray-400">
            Protected by industry-leading security. Your data is always encrypted.
          </p>
        </div>
      </div>
    </div>
  )
}
