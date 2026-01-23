import type React from "react";
import { IconName } from "@/components/icon";
import { UserRole } from "@/types";

export type MenuItem = {
  title: string;
  url: string;
  icon: IconName;
  badge?: string | number;
};

export type MenuGroup = {
  label?: string;
  items: MenuItem[];
};


const doctorMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/doctor",
        icon: "dashboard",
      },
      {
        title: "Consultation",
        url: "/doctor/consultation",
        icon: "clipboard2",
      },
      {
        title: "Patients",
        url: "/doctor/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/doctor/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/doctor/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/doctor/communication",
        icon: "communication",
      },
    ],
  },
];

const nurseMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/nurse",
        icon: "dashboard",
      },
      {
        title: "Vitals",
        url: "/nurse/vitals",
        icon: "add",
      },
      {
        title: "Patients",
        url: "/nurse/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/nurse/appointments",
        icon: "file",
      },
      {
        title: "Bed Occupancy",
        url: "/nurse/bed-occupancy",
        icon: "bed",
      },
      {
        title: "Analytics",
        url: "/nurse/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/nurse/communication",
        icon: "communication",
      },
    ],
  },
];

const cashierMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/cashier",
        icon: "dashboard",
      },
      {
        title: "Transactions",
        url: "/cashier/transactions",
        icon: "card",
      },
      {
        title: "Appointments",
        url: "/cashier/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/cashier/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/cashier/communication",
        icon: "communication",
      },
    ],
  },
];

const receptionistMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/reception",
        icon: "dashboard",
      },
      {
        title: "New Registration",
        url: "/reception/new-registration",
        icon: "add",
      },
      {
        title: "Patients Check-In",
        url: "/reception/check-in",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/reception/appointments",
        icon: "file",
      },
      {
        title: "Doctors",
        url: "/reception/doctors",
        icon: "user1",
      },
      {
        title: "Nurses",
        url: "/reception/nurses",
        icon: "user1",
      },
      {
        title: "Analytics",
        url: "/reception/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/reception/communication",
        icon: "communication",
      },
    ],
  },
];

const pharmacistMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/pharmacy",
        icon: "dashboard",
      },
      {
        title: "Vitals",
        url: "/pharmacy/vitals",
        icon: "add",
      },
      {
        title: "Patients",
        url: "/pharmacy/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/pharmacy/appointments",
        icon: "file",
      },
      {
        title: "Bed Occupancy",
        url: "/pharmacy/bed-occupancy",
        icon: "bed",
      },
      {
        title: "Analytics",
        url: "/pharmacy/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/pharmacy/communication",
        icon: "communication",
      },
    ],
  },
];

const adminMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/admin",
        icon: "dashboard",
      },
      {
        title: "Patients",
        url: "/admin/patients",
        icon: "users3",
      },
      {
        title: "Bed Occupancy",
        url: "/admin/bed-occupancy",
        icon: "bed",
      },
      {
        title: "Appointments",
        url: "/admin/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: "analytics",
      },
      {
        title: "Doctors",
        url: "/admin/doctors",
        icon: "user1",
      },
      {
        title: "Pharmacy",
        url: "/admin/pharmacy",
        icon: "cart",
      },
      {
        title: "Departments",
        url: "/admin/departments",
        icon: "clippad",
      },
      {
        title: "Store",
        url: "/admin/store",
        icon: "cart",
      },
      {
        title: "Finance",
        url: "/admin/finance",
        icon: "finance",
      },
      {
        title: "Communication",
        url: "/admin/communication",
        icon: "communication",
      },
    ],
  },
];

// This is left here as an example to ref when i want to use the group labels again
// const adminMenu: MenuGroup[] = [
//   {
//     label: "Dashboard",
//     items: [
//       {
//         title: "Overview",
//         url: "",
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
        url: "/surgery",
        icon: "dashboard",
      },
      {
        title: "Surgery",
        url: "/surgery",
        icon: "surgery",
      },
      {
        title: "Patients",
        url: "/surgery/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/surgery/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/surgery/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/surgery/communication",
        icon: "communication",
      },
    ],
  },
];

const storeMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/store",
        icon: "dashboard",
      },
      {
        title: "Product",
        url: "/store/product",
        icon: "product",
      },
      {
        title: "Appointments",
        url: "/store/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/store/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/store/communication",
        icon: "communication",
      },
    ],
  },
];

const laboratoryMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/laboratory",
        icon: "dashboard",
      },
      {
        title: "Perform Test",
        url: "/laboratory/lab-tests",
        icon: "syringe",
      },
      {
        title: "Patients",
        url: "/laboratory/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/laboratory/appointments",
        icon: "file",
      },
      {
        title: "Analytics",
        url: "/laboratory/analytics",
        icon: "analytics",
      },
      {
        title: "Communication",
        url: "/laboratory/communication",
        icon: "communication",
      },
    ],
  },
];

const radiologyMenu: MenuGroup[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/radiology",
        icon: "dashboard",
      },
      {
        title: "Patients",
        url: "/radiology/patients",
        icon: "users3",
      },
      {
        title: "Appointments",
        url: "/radiology/appointments",
        icon: "file",
      },
      {
        title: "Communication",
        url: "/radiology/communication",
        icon: "communication",
      },
    ],
  },
];

export const sidebarMenuConfig: Record<UserRole, MenuGroup[]> = {
  doctor: doctorMenu,
  nurse: nurseMenu,
  cashier: cashierMenu,
  admin: adminMenu,
  pharmacist: pharmacistMenu,
  reception: receptionistMenu,
  surgeon: surgeonMenu,
  store: storeMenu,
  laboratory: laboratoryMenu,
  radiology: radiologyMenu,
};

export function getMenuByRole(role: UserRole): MenuGroup[] {
  return sidebarMenuConfig[role] || doctorMenu;
}
