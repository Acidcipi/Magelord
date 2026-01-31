/**
 * User Settings API Route
 * POST /api/user/settings
 * Save user preferences including language
 */

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !authUser) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const email = authUser.email
    const body = await request.json()
    const { preferred_language, auto_load_language, email_notifications, auto_turns } = body

    // Update user settings in database
    const { error: updateError } = await supabase
      .from("users")
      .update({
        preferred_language,
        auto_load_language,
        email_notifications,
        auto_turns,
      })
      .eq("email", email)

    if (updateError) {
      console.error("Error updating user settings:", updateError)
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in settings update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
