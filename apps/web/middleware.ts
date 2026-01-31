import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const publicRoutes = [...authRoutes, "/api/auth"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session token cookie
  // Better Auth uses 'better-auth.session_token' by default
  const sessionToken = request.cookies.get("better-auth.session_token");

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If user is on an auth route and has a session, redirect to home
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is on a protected route and has no session, redirect to login
  if (!isPublicRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (internal API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
