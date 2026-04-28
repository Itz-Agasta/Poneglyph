import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes that require the user to be authenticated.
 * Any path that starts with one of these prefixes will be guarded.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/discover",
  "/research",
  "/survey",
  "/messages",
  "/csv",
  "/excel",
  "/pdf",
];

/**
 * Auth routes — authenticated users should not be able to access these.
 * They get redirected to /dashboard instead.
 */
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

/**
 * The cookie name better-auth uses for the session token.
 * Source: better-auth internals (better-auth.session_token).
 */
const SESSION_COOKIE = "better-auth.session_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Optimistic check — presence of the session cookie is enough for routing.
  // The actual session validity is enforced server-side by the Hono backend.
  const hasSession = request.cookies.has(SESSION_COOKIE);

  // Unauthenticated user trying to access a protected route → redirect to sign-in
  if (isProtected && !hasSession) {
    const signIn = new URL("/sign-in", request.url);
    // Preserve the intended destination so we can redirect back after login
    signIn.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signIn);
  }

  // Authenticated user trying to access sign-in or sign-up → redirect to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all paths except:
     * - _next/static  (Next.js build assets)
     * - _next/image   (image optimisation)
     * - api/proxy     (our own internal proxy route handlers)
     * - favicon, images, fonts, public assets
     */
    "/((?!_next/static|_next/image|api/proxy|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf)).*)",
  ],
};
