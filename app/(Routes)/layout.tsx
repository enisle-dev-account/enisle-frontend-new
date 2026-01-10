import { cookies } from "next/headers";
import { AuthProvider } from "@/providers/auth-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import type { UserRole } from "@/lib/sidebar-config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const role = (cookieStore.get("user_role")?.value as UserRole) || "doctor";
  const hospitalId = cookieStore.get("hospital_id")?.value;
  const hospitalName = cookieStore.get("hospital_name")?.value;
  const hospitalType = cookieStore.get("hospital_type")?.value;

  const firstName = cookieStore.get("first_name")?.value;
  const lastName = cookieStore.get("last_name")?.value;
  const profilePicture = cookieStore.get("profile_picture")?.value;
  const email = cookieStore.get("email")?.value;
  const mobile = cookieStore.get("mobile")?.value;
  const countryCode = cookieStore.get("country_code")?.value;
  const address = cookieStore.get("address")?.value;
  const speciality = cookieStore.get("speciality")?.value;

  const initialUser = {
    role,
    firstName,
    lastName,
    profilePicture: (profilePicture !== undefined && profilePicture !== "null") ? profilePicture : undefined,
    email,
    mobile,
    countryCode,
    address,
    speciality,
    hospitalId,
    hospitalName,
    hospitalType,
  };

  return (
    <AuthProvider initialUser={initialUser}>
      <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col gap-4 pt-7 px-8 bg-accent">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
