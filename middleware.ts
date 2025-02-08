import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "./lib/auth";
import { redirect } from "next/navigation";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = ["/auth/login", "/auth/register", "/auth/new-verification", "/auth/reset", "/auth/new-password"].includes(path);

  const user = await getUser(request);

  if (isPublicPath && user && path !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !user && path !== "/auth/login") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/organizer/:path*"],
};
