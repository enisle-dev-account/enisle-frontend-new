import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole =
  | "admin"
  | "doctor"
  | "surgery"
  | "reception"
  | "laboratory"
  | "radiology"
  | "store"
  | "pharmacy"
  | "nurse"
  | "cashier";

const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
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
};

const PUBLIC_ROUTES = ["/", "/about", "/contact", "/privacy"];
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/staff-signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value as UserRole | undefined;
  const isAuthenticated = !!token && !!userRole;

  // --- 2. LOGIC: AUTH ROUTES (Login/Register) ---
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const destination = ROLE_DASHBOARD_MAP[userRole!] || "/";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // --- 3. LOGIC: PUBLIC ROUTES ---
  if (PUBLIC_ROUTES.some((route) => route === pathname)) {
    return NextResponse.next();
  }

  // --- 4. LOGIC: ROLE-BASED ACCESS CONTROL (RBAC) ---
  const requiredRole = Object.entries(ROLE_DASHBOARD_MAP).find(([role, path]) =>
    pathname.startsWith(path)
  );

  if (requiredRole) {
    const [roleName, rolePath] = requiredRole;

    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== roleName && userRole !== "admin") {
      const defaultDashboard = ROLE_DASHBOARD_MAP[userRole!] || "/";
      return NextResponse.redirect(new URL(defaultDashboard, request.url));
    }
  }

  // --- 5. FALLBACK: Catch-all for other private routes ---
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};