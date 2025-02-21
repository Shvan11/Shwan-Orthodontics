//"C:\shwan-orthodontics\src\middleware.ts"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ONLY redirect if we're at the exact root path
  if (pathname === '/') {
    const url = new URL("/en", request.url);
    return NextResponse.redirect(url);
  }
  
  // For everything else, do nothing
  return NextResponse.next();
}

// CRITICAL: Only run this middleware on the exact root path
export const config = {
  matcher: ['/'],
};