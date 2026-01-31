import { NextResponse, NextRequest } from "next/server";

// Match your backend constants
export const USER_TYPES = ["CUSTOMER", "SELLER", "ADMIN"] as const;
type UserRole = (typeof USER_TYPES)[number];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userRole = request.cookies.get("userRole")?.value as
    | UserRole
    | undefined;

  const isAuthPath =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPath = pathname.startsWith("/dashboard");

  if (isDashboardPath && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isAuthPath && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isDashboardPath) {
    const allowedRoles: UserRole[] = ["ADMIN", "SELLER"];

    if (userRole && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
