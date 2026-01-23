"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getMenuByRole,  type MenuGroup } from "@/lib/sidebar-config"
import { Icon } from "./icon"
import { UserRole } from "@/types"

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: UserRole
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const menuGroups = getMenuByRole(role)

const ROLE_DASHBOARD_MAP: Record<string, string> = {
    admin: "/admin",
    doctor: "/doctor",
    surgery: "/surgery",
    reception: "/reception",
    laboratory: "/laboratory",
    radiology: "/radiology",
    store: "/store",
    pharmacy: "/pharmacy",
    nurse: "/nurse",
    cashier: "/cashier",
}

const isActive = (url: string) => {
    const roleDashboard = ROLE_DASHBOARD_MAP[role]
    if (roleDashboard && url === roleDashboard) {
        return pathname === roleDashboard || pathname === "/"
    }
    return pathname.startsWith(url)
}

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Icon name="logo" size={80} className="scale-150 ml-6" />
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group: MenuGroup, index: number) => (
          <SidebarGroup key={index} className="px-0">
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu className="gap-y-6">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title} className="data-active:bg-[#1b1930] pl-8 h-10 data-active:text-white data-active:border-primary border-r-5 border-transparent rounded-none hover:bg-[#1b1930] hover:text-white">
                      <Link href={item.url}>
                        <Icon name={item.icon} className=" fill-none scale-150" size={60} />
                        <span className="font-semibold  ml-2">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
