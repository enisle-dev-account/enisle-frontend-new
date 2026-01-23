"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types";

interface PatientProfileTabsProps {
  userRole: UserRole;
  consultationId: string;
}

// Define which roles can see which tabs
const TAB_ACCESS: Record<string, UserRole[]> = {
  vitals: ["nurse", "doctor", "surgeon", "admin"],
  medication: ["nurse", "doctor", "surgeon", "admin"],
  encounter_notes: ["doctor", "surgeon", "admin"],
  labs: ["doctor", "surgeon", "admin"],
  scan: ["doctor", "surgeon", "admin"],
  surgery: ["doctor", "surgeon", "admin"],
  receipt: ["doctor", "surgeon", "admin"],
};

const TAB_CONFIG = [
  { id: "vitals", label: "Vitals", href: "vitals" },
  { id: "medication", label: "Medication", href: "medication" },
  { id: "encounter_notes", label: "Encounter Notes", href: "encounter-notes" },
  { id: "labs", label: "Labs", href: "labs" },
  { id: "scan", label: "Scan", href: "scan" },
  { id: "surgery", label: "Surgery", href: "surgery" },
  { id: "receipt", label: "Receipt", href: "receipt" },
];

export function PatientProfileTabs({
  userRole,
  consultationId,
}: PatientProfileTabsProps) {
  const pathname = usePathname();

  // Get accessible tabs for current user role
  const accessibleTabs = TAB_CONFIG.filter((tab) =>
    TAB_ACCESS[tab.id].includes(userRole as UserRole)
  );

  // Determine active tab from pathname
  const activeTab = accessibleTabs.find((tab) =>
    pathname.includes(`/${tab.href}`)
  )?.id;

  return (
    <div className="border-b border-border">
      <nav className="flex gap-8 px-6 py-0">
        {accessibleTabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/patient/${consultationId}/${tab.href}`}
            className={`py-3 px-0 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
