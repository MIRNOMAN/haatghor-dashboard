import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TUser } from "./types";
import { verifyJWT } from "./utils/verifyJWT";

const adminRoles = ["ADMIN", "SUPERADMIN"] as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Publicly accessible: /login and all children
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    );
  }

  try {
    const user = verifyJWT(token) as TUser;

    // If admin → allow all routes
    if (
      user?.role &&
      adminRoles.includes(user.role as (typeof adminRoles)[number])
    ) {
      return NextResponse.next();
    }

    // If not admin → restrict to /login only
    return NextResponse.redirect(new URL("/login", request.url));
  } catch {
    // Invalid token → force login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // protect everything except static files
  ],
};
