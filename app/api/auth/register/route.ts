/**
 * Registration Route
 * POST /api/auth/register
 *
 * Handles new user registration with Supabase Auth and creates initial game data.
 * IMPORTANT: A database trigger (trg_new_user_setup) automatically creates the province
 * when a user is inserted. We only need to UPDATE the province name after.
 *
 * Expected body:
 * {
 *   email: string,
 *   password: string,
 *   username: string,
 *   faction: string,
 *   class: string,
 *   alignment: string,
 *   provinceName: string,
 *   bio?: string
 * }
 */

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password, username, faction, class: userClass, alignment, provinceName, bio } = body

    const safeClass = (userClass || "guerrero").toLowerCase().trim()
    const safeAlignment = (alignment || "neutral").toLowerCase().trim()

    const validAlignments = ["luz", "oscuridad", "neutral"]
    const finalAlignment = validAlignments.includes(safeAlignment) ? safeAlignment : "neutral"

    const validClasses = ["guerrero", "mago", "cazador", "paladin", "picaro"]
    const finalClass = validClasses.includes(safeClass) ? safeClass : "guerrero"

    // Validate required fields
    if (!email || !password || !username || !faction || !provinceName) {
      return NextResponse.json(
        {
          error: "Missing required fields: email, password, username, faction, provinceName",
        },
        { status: 400 },
      )
    }

    // Step 1: Sign up with Supabase Auth
    console.log("Attempting to sign up user with email:", email)
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      console.log("Sign up error:", signUpError)
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "User creation failed" }, { status: 500 })
    }

    const authUuid = authData.user.id
    console.log("User created in Supabase Auth with UUID:", authUuid)

    // Step 2: Create user profile in database (this will trigger province creation via SQL trigger)
    console.log("Creating user profile in database")
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        username,
        faction,
        class: finalClass, // Using sanitized value
        alignment: finalAlignment, // Using validated value
        bio: bio || null,
        email: email,
        auth_uuid: authUuid,
      })
      .select()
      .single()

    if (userError) {
      console.log("User profile creation error:", userError)
      return NextResponse.json({ error: `Failed to create user profile: ${userError.message}` }, { status: 500 })
    }

    const userId = userData.id
    console.log("User profile created with INTEGER id:", userId)

    // Step 3: Update the province name (trigger created it with default name)
    console.log("Updating province name for user")
    const { error: provinceUpdateError } = await supabase
      .from("provinces")
      .update({ name: provinceName })
      .eq("user_id", userId)

    if (provinceUpdateError) {
      console.log("Province name update error:", provinceUpdateError)
      // Not critical - province was created, just name wasn't updated
      console.warn("Failed to update province name, but continuing with registration")
    }

    // Step 4: Fetch the created province to return in response
    const { data: provinceData, error: provinceFetchError } = await supabase
      .from("provinces")
      .select()
      .eq("user_id", userId)
      .single()

    if (provinceFetchError) {
      console.log("Province fetch error:", provinceFetchError)
      // Still return success since user was created
    }

    console.log("Registration successful for user:", username)

    // Step 5: Return success response with basic data
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! Please check your email to verify your account.",
        data: {
          user: {
            id: userId,
            email: authData.user.email,
            username,
            faction,
            class: finalClass, // Return sanitized value
            alignment: finalAlignment, // Return validated value
          },
          province: provinceData || null,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error during registration" }, { status: 500 })
  }
}
