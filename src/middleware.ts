import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for auth cookie (HttpOnly)
  const token = request.cookies.get("auth_token")?.value;

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isRegisterPage = request.nextUrl.pathname.startsWith("/register");

  // 1. Protect Dashboard
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Redirect logged-in users away from Login/Register pages
  if ((isLoginPage || isRegisterPage) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

