"use client";

import type { UserRole } from "@/types";

interface PatientProfileTabsProps {
  userRole: UserRole;
  activeTab: string;
  id:string
  onTabChange: (tab: string) => void;
}

const TAB_ACCESS: Record<string, UserRole[]> = {
  vitals: ["nurse", "doctor", "surgery", "admin"],
  medication: ["nurse", "doctor", "surgery", "admin"],
  encounter_notes: ["doctor", "surgery", "admin"],
  labs: ["doctor", "surgery", "admin"],
  scan: ["doctor", "surgery", "admin"],
  all: ["doctor", "surgery", "admin"],
  surgery: ["doctor", "surgery", "admin"],
};

const TAB_CONFIG = [
  { id: "all", label: "All" },
  { id: "vitals", label: "Vitals" },
  { id: "medication", label: "Medication" },
  { id: "encounter_notes", label: "Encounter Notes" },
  { id: "labs", label: "Labs" },
  { id: "scan", label: "Scan" },
  { id: "surgery", label: "Surgery" },
];

export function PatientProfileTabs({
  userRole,
  activeTab,
  onTabChange,
}: PatientProfileTabsProps) {
  const accessibleTabs = TAB_CONFIG.filter((tab) =>
    TAB_ACCESS[tab.id].includes(userRole as UserRole)
  );

  return (
    <div className="bg-background rounded-xl">
      <nav className="flex gap-8 px-6 py-0">
        {accessibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-0 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}