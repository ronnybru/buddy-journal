import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register")

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return null
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/", "/login", "/register", "/journal/:path*", "/profile/:path*"]
}
