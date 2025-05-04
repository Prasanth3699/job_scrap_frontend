import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-middleware that guards pages on the server.
 * Accepts either the helper `access_token` cookie or the http-only
 * `refresh_token` cookie as proof of an authenticated session.
 */
export function middleware(request: NextRequest) {
  const accessCookie = request.cookies.get("access_token")?.value;
  const refreshCookie = request.cookies.get("refresh_token")?.value;
  const isLoggedIn = !!accessCookie || !!refreshCookie;

  const { pathname } = request.nextUrl;

  /* ignore Next.js internals and public assets */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  /* already logged-in user should not see the login / register pages */
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  /* protected route and user NOT logged-in → send to /login */
  if (!isAuthRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /* protect everything that is not a static file */
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
