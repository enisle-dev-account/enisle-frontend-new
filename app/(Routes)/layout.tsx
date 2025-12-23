import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import type { UserRole } from "@/lib/sidebar-config"

// For demo purposes, we're using a default role
function getCurrentUserRole(): UserRole {
  // TODO: Replace with actual auth logic
  // Example: const session = await getServerSession()
  // return session.user.role
  return "doctor"
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userRole = getCurrentUserRole()

  return (
    <SidebarProvider>
      <AppSidebar role={userRole} />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 pt-5 px-8  bg-accent">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
