// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  // Skip static and API routes
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Get stored tokens
  const accessCookie = request.cookies.get("access_token")?.value;
  const refreshCookie = request.cookies.get("refresh_token")?.value;

  // Check if any valid token exists
  const hasValidToken = !!accessCookie || !!refreshCookie;

  // Authentication route paths
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Admin routes
  const isAdminRoute = pathname.startsWith("/dashboard");

  // User routes
  const isUserRoute = pathname.startsWith("/landing-page");

  // If on auth route but already logged in, redirect to appropriate page
  if (isAuthRoute && hasValidToken) {
    // Try to determine user role from access token if available
    let isAdmin = false;
    if (accessCookie) {
      try {
        const decoded = jwtDecode(accessCookie);
        isAdmin = decoded?.is_admin === true;
      } catch (e) {
        // Invalid token, but we still have the refresh token
      }
    }

    // Redirect to appropriate dashboard based on role
    return NextResponse.redirect(
      new URL(isAdmin ? "/dashboard" : "/landing-page", request.url)
    );
  }

  // If not logged in and trying to access protected route, redirect to login
  if (!isAuthRoute && !hasValidToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access admin route while not an admin, redirect to user landing page
  if (isAdminRoute && accessCookie) {
    try {
      const decoded = jwtDecode(accessCookie);
      if (decoded?.is_admin !== true) {
        return NextResponse.redirect(new URL("/landing-page", request.url));
      }
    } catch (e) {
      // If token can't be decoded, still allow request as the auth guard will handle it
    }
  }

  // If trying to access user route while being an admin, redirect to admin dashboard
  if (isUserRoute && accessCookie) {
    try {
      const decoded = jwtDecode(accessCookie);
      if (decoded?.is_admin === true) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (e) {
      // If token can't be decoded, still allow request as the auth guard will handle it
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
