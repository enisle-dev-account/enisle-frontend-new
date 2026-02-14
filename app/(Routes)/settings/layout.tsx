"use client"

import React from "react"

import { useAuth } from "@/providers/auth-provider"
import { getAccessibleSettings } from "@/lib/settings-config"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) {
    return <div>Loading...</div>
  }

  const accessibleSettings = getAccessibleSettings(user.role)
  const currentPath = pathname.replace("/settings", "").replace("/", "") || "information"

  return (
    <main className="rounded-t-2xl bg-background  h-full">
      <div className="flex gap-6 p-6 h-full">
        {/* Settings Sidebar */}
        <aside className="w-64 sticky top-20 h-fit border-r border-border pr-4">
          <nav className="flex flex-col gap-2">
            {accessibleSettings.map((item) => {
              const isActive = currentPath === item.id
              const Icon = item.icon

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`flex items-center hover:bg-accent  gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white hover:text-muted-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto px-1">
          {children}
        </div>
      </div>
    </main>
  )
}
