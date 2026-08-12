import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const MEMBER_PATHS = ["/dashboard", "/change-password", "/checkout"];
const ADMIN_PREFIX = "/admin";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith(ADMIN_PREFIX);
  const isMemberPath = MEMBER_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!isAdminPath && !isMemberPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    session.mustChangePassword &&
    pathname !== "/change-password" &&
    (isMemberPath || isAdminPath)
  ) {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/change-password", "/admin/:path*", "/checkout/:path*"],
};
