import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  const isAuthPath =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPath = pathname.startsWith("/dashboard");

  const adminOnlyPaths = ["/dashboard/users", "/dashboard/category"];
  const isAdminPath = adminOnlyPaths.some((path) => pathname.startsWith(path));

  if (isDashboardPath && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPath && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminPath) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
