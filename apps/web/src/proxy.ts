import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Proxy (Next.js 16 equivalent of middleware).
 *
 * Uses cookie-only check for fast redirects — this is NOT a security check.
 * Actual auth validation happens server-side in each protected route/component.
 *
 * NOTE: We cannot call auth.api.getSession() here because auth lives on the
 * separate Hono server, not in this Next.js app.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!sessionCookie) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/research") ||
      pathname.startsWith("/messages") ||
      pathname.startsWith("/discover") ||
      pathname.startsWith("/datasets")
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (sessionCookie) {
    if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/research/:path*",
    "/messages/:path*",
    "/discover/:path*",
    "/datasets/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
