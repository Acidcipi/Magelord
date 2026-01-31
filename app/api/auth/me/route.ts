/**
 * Get Current User Route
 * GET /api/auth/me
 *
 * Protected route that returns the current authenticated user's data.
 * Requires a valid Supabase session token in the Authorization header.
 * IMPORTANT: Looks up user by email since Supabase Auth UUID != users table INTEGER id
 *
 * Expected header:
 * Authorization: Bearer <access_token>
 */

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(request: Request) {
  try {
    // Extract authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    // Extract token from header
    const token = authHeader.split(" ")[1]

    // Step 1: Verify the session and get Supabase Auth user
    console.log("Verifying user session")
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !authUser) {
      console.log("Authentication error:", authError)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const email = authUser.email
    console.log("User authenticated, email:", email)

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

    console.log("User data fetched successfully for:", userData.username)

    // Step 4: Return success response with user and province data
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: userData.id,
            email: email,
            username: userData.username,
            faction: userData.faction,
            bio: userData.bio,
            status: userData.status,
            roles: userData.roles || ["player"], // Include roles from database
            created_at: userData.created_at,
          },
          province: provinceData,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
