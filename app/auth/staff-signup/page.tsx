import { Suspense } from "react"
import { BrandingCarousel } from "@/components/branding-carousel"
import { StaffSignupForm } from "./components/staff-signup-form"

function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white md:rounded-l-[32px] overflow-hidden">
      <div className="w-full max-w-md text-gray-500">Loading...</div>
    </div>
  )
}

export default function StaffSignupPage() {
  return (
    <div className="min-h-screen flex bg-secondary">
      <BrandingCarousel />
      <Suspense fallback={<Loading />}>
        <StaffSignupForm />
      </Suspense>
    </div>
  )
}
