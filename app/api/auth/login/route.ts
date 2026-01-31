/**
 * Login Route
 * POST /api/auth/login
 *
 * Handles user authentication with Supabase Auth.
 * Returns session data along with user profile and province information.
 * IMPORTANT: Looks up user by email since Supabase Auth UUID != users table INTEGER id
 *
 * Expected body:
 * {
 *   email: string,
 *   password: string
 * }
 */

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields: email and password" }, { status: 400 })
    }

    // Step 1: Authenticate with Supabase Auth
    console.log("Attempting to sign in user with email:", email)
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.log("Sign in error:", signInError)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    console.log("User authenticated with Supabase Auth")

    console.log("Fetching user profile by email")
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("email", email).single()

    if (userError || !userData) {
      console.log("User profile fetch error:", userError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    const userId = userData.id // INTEGER id from users table
    console.log("User profile found with id:", userId)

    // Step 3: Fetch user's province from "provinces" table
    console.log("Fetching user province")
    const { data: provinceData, error: provinceError } = await supabase
      .from("provinces")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (provinceError || !provinceData) {
      console.log("Province fetch error:", provinceError)
      return NextResponse.json({ error: "Failed to fetch province data" }, { status: 500 })
    }

    console.log("Login successful for user:", userData.username)

    // Step 4: Return success response with session, user, and province data
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          session: {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_at: authData.session.expires_at,
          },
          user: {
            id: userData.id,
            email: authData.user.email,
            username: userData.username,
            faction: userData.faction,
            bio: userData.bio,
            status: userData.status,
            roles: userData.roles || ["player"], // Include roles from database
          },
          province: provinceData,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error during login" }, { status: 500 })
  }
}
