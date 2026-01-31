/**
 * Logout Route
 * POST /api/auth/logout
 *
 * Securely logs out the user by invalidating their Supabase session
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Ignore errors during logout
            }
          },
        },
      },
    )

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      console.log("[v0] 🔐 Logging out user:", session.user.id)
    }

    // Sign out the user from Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("[v0] ❌ Logout error:", error)
      return NextResponse.json({ error: "Failed to logout", details: error.message }, { status: 500 })
    }

    console.log("[v0] ✅ User logged out successfully")

    // Return success response
    return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] ❌ Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
