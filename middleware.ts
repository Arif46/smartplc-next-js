import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is handled client-side via Zustand + page-level guards.
// Middleware only adds no-cache headers for protected routes.
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") || path.startsWith("/customer")) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};
