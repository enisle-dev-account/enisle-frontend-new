import type React from "react"
import {
  User,
  Lock,
  Bell,
  Shield,
  Zap,
  Building2,
  Info,
  ShieldCheck,
  RectangleEllipsis,
  Blocks,
} from "lucide-react"
import { UserRole } from "@/types"

export type SettingMenuItem = {
  id: string
  title: string
  description: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

export const SETTINGS_MENU: SettingMenuItem[] = [
  {
    id: "information",
    title: "General Information",
    description: "Update your personal information",
    url: "/settings/information",
    icon: Info,
    roles: ["admin", "doctor", "nurse", "cashier", "pharmacy", "reception", "store", "radiology", "laboratory", "surgeon"],
  },
  {
    id: "security",
    title: "Security",
    description: "Change password and security settings",
    url: "/settings/security",
    icon: ShieldCheck,
    roles: ["admin", "doctor", "nurse", "cashier", "pharmacy", "reception", "store", "radiology", "laboratory", "surgeon"],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage notification preferences",
    url: "/settings/notifications",
    icon: Bell,
    roles: ["admin", "doctor", "nurse", "cashier", "pharmacy", "reception", "store", "radiology", "laboratory", "surgeon"],
  },
  {
    id: "permissions",
    title: "Permissions",
    description: "Manage user permissions",
    url: "/settings/permissions",
    icon: RectangleEllipsis,
    roles: ["admin"],
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect external services",
    url: "/settings/integrations",
    icon: Zap,
    roles: ["admin", "doctor", "nurse", "cashier", "pharmacy", "reception", "store", "radiology", "laboratory", "surgeon"],
  },
  {
    id: "hospital-setup",
    title: "Hospital Setup",
    description: "Set up your hospital infrastructure",
    url: "/settings/hospital-setup",
    icon: Blocks,
    roles: ["admin"],
  },
  {
    id: "configurations",
    title: "Hospital Configurations",
    description: "Configure your hospital",
    url: "/settings/configurations",
    icon: Blocks,
    roles: ["admin"],
  },
]

export const getAccessibleSettings = (userRole: UserRole): SettingMenuItem[] => {
  return SETTINGS_MENU.filter((item) => item.roles.includes(userRole))
}
