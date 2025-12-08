import { type NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES, PRIVATE_ROUTES, ROUTE } from "@/constants/route";
import { CookieName } from "@/constants/client";

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function getPathWithoutLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);
  return pathname.replace(localePattern, "") || "/";
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const hasSession = request.cookies.has(CookieName.AUTH_GUARD);

  if (
    hasSession &&
    AUTH_ROUTES.some((route) => pathWithoutLocale.startsWith(route))
  ) {
    return NextResponse.redirect(new URL(ROUTE.HOME, request.url));
  }

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => {
    if (route.includes("*")) {
      const routePattern = route.replace("*", "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathWithoutLocale);
    }
    return (
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    );
  });

  if (!hasSession && isPrivateRoute)
    return NextResponse.redirect(new URL(ROUTE.LOGIN, request.url));

  return intlMiddleware(request);
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
