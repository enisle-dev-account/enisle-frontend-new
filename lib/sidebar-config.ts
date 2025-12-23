import type React from "react"
import {
  LayoutDashboard,
  Users,
  BedDouble,
  Calendar,
  UserCog,
  Pill,
  Building2,
  Store,
  LineChart,
  MessageSquare,
  ClipboardList,
  FileText,
  DollarSign,
  Clock,
  UserCheck,
  UserPlus,
  Stethoscope,
  Activity,
  FlaskConical,
  Syringe,
} from "lucide-react"
import { IconName } from "@/components/icon"

export type MenuItem = {
  title: string
  url: string
  icon: IconName
  badge?: string | number
}

export type MenuGroup = {
  label?: string
  items: MenuItem[]
}

export type UserRole = "doctor" | "nurse" | "cashier" | "admin" | "pharmacist" | "receptionist" | "surgeon" | "receptionist" | "store" | "laboratory" | "radiology"

const doctorMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Consultation",
        url: "/consultation",
        icon: "clipboard2",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const nurseMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Vitals",
        url: "/vitals",
        icon: "add",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Bed Occupancy",
        url: "/bed-occupancy",
        icon: "bed",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const cashierMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: "card",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const receptionistMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Vitals",
        url: "/vitals",
        icon: "add",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Bed Occupancy",
        url: "/bed-occupancy",
        icon: "bed",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const pharmacistMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Vitals",
        url: "/vitals",
        icon: "add",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Bed Occupancy",
        url: "/bed-occupancy",
        icon: "bed",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const adminMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Bed Occupancy",
        url: "/bed-occupancy",
        icon: "bed",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Doctors",
        url: "/doctors",
        icon: "user1",
      },
      {
        title: "Pharmacy",
        url: "/pharmacy",
        icon: "cart",
      },
      {
        title: "Departments",
        url: "/departments",
        icon: "clippad",
      },
      {
        title: "Store",
        url: "/store",
        icon: "cart",
      },
      {
        title: "Finance",
        url: "/finance",
        icon: "finance",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

// This is left here as an example to ref when i want to use the group labels again
// const adminMenu: MenuGroup[] = [
//   {
//     label: "Dashboard",
//     items: [
//       {
//         title: "Overview",
//         url: "/dashboard",
//         icon: LayoutDashboard,
//       },
//     ],
//   },
//   {
//     label: "Management",
//     items: [
//       {
//         title: "Patients",
//         url: "/patients",
//         icon: Users,
//       },
//       {
//         title: "Staff",
//         url: "/admin/staff",
//         icon: UserCog,
//       },
//       {
//         title: "Departments",
//         url: "/departments",
//         icon: Building2,
//       },
//       {
//         title: "Bed Occupancy",
//         url: "/bed-occupancy",
//         icon: BedDouble,
//       },
//     ],
//   },
//   {
//     label: "Operations",
//     items: [
//       {
//         title: "Appointments",
//         url: "/appointments",
//         icon: Calendar,
//       },
//       {
//         title: "Pharmacy",
//         url: "/pharmacy",
//         icon: Pill,
//       },
//       {
//         title: "Store",
//         url: "/store",
//         icon: Store,
//       },
//     ],
//   },
//   {
//     label: "Finance",
//     items: [
//       {
//         title: "Finance",
//         url: "/finance",
//         icon: LineChart,
//       },
//       {
//         title: "Billing",
//         url: "/admin/billing",
//         icon: DollarSign,
//       },
//     ],
//   },
//   {
//     label: "Communication",
//     items: [
//       {
//         title: "Communication",
//         url: "/communication",
//         icon: MessageSquare,
//       },
//     ],
//   },
// ]

const surgeonMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Surgery",
        url: "/surgery",
        icon: "surgery",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const storeMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Product",
        url: "/product",
        icon: "product",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const laboratoryMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Perform Test",
        url: "/lab-tests",
        icon: "syringe",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

const radiologyMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: "file",
      },
      {
        title: "Communication",
        url: "/communication",
        icon: "communication",
      },
    ],
  },
]

export const sidebarMenuConfig: Record<UserRole, MenuGroup[]> = {
  doctor: doctorMenu,
  nurse: nurseMenu,
  cashier: cashierMenu,
  admin: adminMenu,
  pharmacist: pharmacistMenu,
  receptionist: receptionistMenu,
    surgeon: surgeonMenu,
    store: storeMenu,
    laboratory: laboratoryMenu,
    radiology: radiologyMenu,
}

export function getMenuByRole(role: UserRole): MenuGroup[] {
  return sidebarMenuConfig[role] || doctorMenu
}
