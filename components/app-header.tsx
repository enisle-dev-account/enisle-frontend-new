"use client";

import type * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "./ui/input";
import { Icon } from "./icon";
import ProfileDropDown from "./profile-dropdown";
import { useAuth } from "@/providers/auth-provider";
import { capitalizeNames } from "@/lib/utils";

export type PageConfig = {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
};

export interface AppHeaderProps {
  pageConfig?: PageConfig;
  children?: React.ReactNode;
}

const defaultPageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/patients": "Patients",
  "/bed-occupancy": "Bed Occupancy",
  "/appointments": "Appointments",
  "/doctors": "Doctors",
  "/pharmacy": "Pharmacy",
  "/departments": "Departments",
  "/store": "Store",
  "/store/product": "Products",
  "/store/product/csv": "Import Products",
  "/finance": "Finance",
  "/communication": "Communication",
  "/nurse/patients": "Patient Management",
  "/nurse/bed-management": "Bed Management",
  "/nurse/appointments": "Appointments",
  "/nurse/vital-signs": "Vital Signs",
  "/nurse/medications": "Medications",
  "/nurse/lab-results": "Lab Results",
  "/cashier/billing": "Billing",
  "/cashier/patients": "Patient Records",
  "/cashier/invoices": "Invoices",
  "/cashier/payments": "Payments",
  "/cashier/appointments": "Appointment Billing",
  "/cashier/reports": "Financial Reports",
  "/reception/check-in": "Patient Check-in",
  "/reception/register": "Register New Patient",
  "/reception/appointments": "Schedule Appointments",
  "/reception/patients": "Patient Directory",
  "/reception/waiting-room": "Waiting Room",
  "/reception/doctors": "Doctor Availability",
  "/pharmacy/prescriptions": "Prescriptions",
  "/pharmacy/inventory": "Inventory Management",
  "/pharmacy/medications": "Medications",
  "/pharmacy/patients": "Patient Records",
  "/pharmacy/sales": "Sales",
  "/pharmacy/reports": "Reports",
  "/admin/staff": "Staff Management",
  "/admin/billing": "Billing Overview",
};

function getPageTitle(pathname: string): string {
  // Check exact match first
  if (defaultPageTitles[pathname]) {
    return defaultPageTitles[pathname];
  }

  // Check for dynamic routes (e.g., /patients/123)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 1) {
    const baseRoute = `/${segments.slice(0, -1).join("/")}`;
    if (defaultPageTitles[baseRoute]) {
      // For detail pages, append "Details"
      return `${defaultPageTitles[baseRoute]} Details`;
    }
  }

  // Fallback: capitalize first segment
  return segments[0]
    ? segments[0].charAt(0).toUpperCase() +
        segments[0].slice(1).replace(/-/g, " ")
    : "Dashboard";
}

function shouldShowBackButton(pathname: string): boolean {
  // Don't show back button on main dashboard
  if (pathname === "/" || pathname === "/dashboard") {
    return false;
  }

  // Show back button on detail pages (more than 2 segments)
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 2;
}

function getBackUrl(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) {
    return "/dashboard";
  }
  // Go back one level
  return `/${segments.slice(0, -1).join("/")}`;
}

export function AppHeader({ pageConfig, children }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth()

  const title = pageConfig?.title || getPageTitle(pathname);
  const showBackButton =
    pageConfig?.showBackButton ?? shouldShowBackButton(pathname);
  const backUrl = pageConfig?.backUrl || getBackUrl(pathname);

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        {showBackButton && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
          </>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
        {children && (
          <>
            <div className="ml-auto flex items-center gap-2">{children}</div>
          </>
        )}
      </div>

      <div className="flex gap-x-22">
        <div className="flex items-center gap-2">
            <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-muted-foreground pointer-events-none">
                    <Icon name="search-normal" className="h-4 w-4 fill-none" />
                </span>
                <Input
                    type="search"
                    placeholder="Search for anything"
                    aria-label="Search"
                    className="pl-10 max-w-xs bg-transparent"
                />
            </div>
        </div>

        <div className="flex gap-x-5 items-center">
            <div className="flex items-center justify-center border rounded-full size-10 hover:bg-muted">
                <Icon name="sms" size={20} className="fill-none" />
            </div>
            <div className="flex items-center justify-center border rounded-full size-10 hover:bg-muted">
                <Icon name="notification" size={20} className="fill-none" />
            </div>

            <Separator orientation="vertical" className="h-6 mt-2" />
            <ProfileDropDown fullName={capitalizeNames(user?.firstName, user?.lastName)} imageUrl={user?.profilePicture || undefined} />
        </div>
      </div>
    </header>
  );
}
