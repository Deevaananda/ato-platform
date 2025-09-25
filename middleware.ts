import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is accessing dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      // Validate session (basic check)
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

      // Check if session is expired
      if (Date.now() > sessionData.exp) {
        const response = NextResponse.redirect(new URL("/", request.url))
        response.cookies.delete("session")
        return response
      }
    } catch {
      // Invalid session, redirect to login
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("session")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
