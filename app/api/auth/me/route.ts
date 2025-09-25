import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
