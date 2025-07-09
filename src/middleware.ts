import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, AUTH_ROUTES, ROUTE } from "@/constants/route";

const AUTH_COOKIE_NAME = "_guard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(AUTH_COOKIE_NAME);

  if (hasSession && AUTH_ROUTES.some((route) => pathname.startsWith(route)))
    return NextResponse.redirect(new URL(ROUTE.HOME, request.url));

  if (
    !hasSession &&
    PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  )
    return NextResponse.redirect(new URL(ROUTE.LOGIN, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
