import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { envConfig } from "./lib/envVar";

// Convert your secret to Uint8Array for 'jose'
const SECRET = new TextEncoder().encode(envConfig.REFRESH_SECRET);

export async function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Path Groups
  const authPaths = ["/login", "/register", "/forgot-password", "/verify-otp"];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // /dashboard is shared, but /dashboard/admin is restricted
  const isAdminPath = pathname.startsWith("/dashboard/admin");
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  // 2. Logic: If user is logged in, verify their role
  let userRole = null;
  if (refreshToken) {
    try {
      const { payload } = await jwtVerify(refreshToken, SECRET);
      userRole = payload.role; // Extract role from JWT
    } catch (err) {
      // If token is invalid/expired, treat as unauthenticated
      console.error("JWT verify failed in proxy", err);
    }
  }

  // 3. Rule: Logged-in users shouldn't see /login or /register
  if (refreshToken && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Rule: Non-logged-in users shouldn't see protected paths
  if (!refreshToken && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 5. RBAC Rule: Only Admins can enter /dashboard/admin
  if (isAdminPath && userRole !== "admin") {
    // Redirect non-admins to their general dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
  ],
};
