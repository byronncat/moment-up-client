import { type NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES, PRIVATE_ROUTES, ROUTE } from "@/constants/route";
import { CookieName } from "@/constants/client";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(CookieName.AUTH_GUARD);

  if (hasSession && AUTH_ROUTES.some((route) => pathname.startsWith(route)))
    return NextResponse.redirect(new URL(ROUTE.HOME, request.url));

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => {
    if (route.includes("*")) {
      const routePattern = route.replace("*", "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (!hasSession && isPrivateRoute)
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
