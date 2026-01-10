"use client"

import React, { createContext, useContext, useState } from "react"
import { UserRole } from "@/lib/sidebar-config"

interface User {
  role: UserRole
  hospitalId?: string
  hospitalName?: string
  hospitalType?: string
  firstName?: string
  lastName?: string
  profilePicture?: string
  email?: string
  mobile?: string
  countryCode?: string
  address?: string
  speciality?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode, 
  initialUser: User | null 
}) {
  const [user, setUser] = useState<User | null>(initialUser)

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}