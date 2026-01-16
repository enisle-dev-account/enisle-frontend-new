import React from "react";
import { cn } from "@/lib/utils";

import {
  Star as LucideStar,
  Heart as LucideHeart,
  User as LucideUser,
  Search as LucideSearch,
  Settings as LucideSettings,
  Home as LucideHome,
  Plus as LucidePlus,
  X as LucideX,
} from "lucide-react";

import {
  Analytics,
  Add,
  Logo,
  TestIcon,
  Bed,
  Cart,
  Clippad,
  Clipboard2,
  Communication,
  Dashboard,
  File,
  Finance,
  HelpSupport,
  Settings,
  Surgery,
  User1,
  Users3,
  Card,
  Product,
  Syringe,
  SearchNormal,
  Notification,
  Sms,
  UserAdd,
  People,
} from "@/lib/assets/icons-compiled";

// Icon registry - now all components work the same way
const iconRegistry = {
  // Custom SVG components (pre-compiled)
  "test-icon": TestIcon,
  logo: Logo,
    dashboard: Dashboard,
    analytics: Analytics,
    add: Add,
    bed: Bed,
    cart: Cart,
    clippad: Clippad,
    clipboard2: Clipboard2,
    communication: Communication,
    file: File,
    finance: Finance,
    "help-support": HelpSupport,
    settings: Settings,
    surgery: Surgery,
    user1: User1,
    users3: Users3,
    card: Card,
    product: Product,
    syringe: Syringe,
    "search-normal": SearchNormal,
    notification: Notification,
    sms: Sms,
    "user-add": UserAdd,
    people: People,

  // Lucide icons
  "lucide-star": LucideStar,
  "lucide-heart": LucideHeart,
  "lucide-user": LucideUser,
  "lucide-search": LucideSearch,
  "lucide-settings": LucideSettings,
  "lucide-home": LucideHome,
  "lucide-plus": LucidePlus,
  "lucide-x": LucideX,
} as const;

type IconName = keyof typeof iconRegistry;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 16, className, ...props }, ref) => {
    const IconComponent = iconRegistry[name];

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in registry`);
      return null;
    }

    return (
      <IconComponent
        ref={ref}
        width={size}
        height={size}
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";

export { iconRegistry };
export type { IconName };
