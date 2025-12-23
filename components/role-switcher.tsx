"use client"

import * as React from "react"
import type { UserRole } from "@/lib/sidebar-config"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function RoleSwitcher() {
  const [currentRole, setCurrentRole] = React.useState<UserRole>("doctor")

  const roles: { value: UserRole; label: string }[] = [
    { value: "doctor", label: "Doctor" },
    { value: "nurse", label: "Nurse" },
    { value: "cashier", label: "Cashier" },
    { value: "receptionist", label: "Receptionist" },
    { value: "pharmacist", label: "Pharmacist" },
    { value: "admin", label: "Administrator" },
  ]

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role)
    // In a real app, this would update the user's session or trigger a re-render
    // For now, we'll just reload the page to see the new sidebar
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <span className="text-sm">{roles.find((r) => r.value === currentRole)?.label}</span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            className={currentRole === role.value ? "bg-accent" : ""}
          >
            {role.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
