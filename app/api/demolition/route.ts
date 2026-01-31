/**
 * Demolition API Route
 * POST /api/demolition
 *
 * Handles building demolition to free up land for strategic reconfiguration
 */

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    // Get authorization token
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Verify token and get user
    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authData.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { buildingType, quantity } = body

    if (!buildingType || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid demolition parameters" }, { status: 400 })
    }

    // Get user data from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", authData.user.email)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get province data
    const { data: provinceData, error: provinceError } = await supabase
      .from("provinces")
      .select("*")
      .eq("user_id", userData.id)
      .single()

    if (provinceError || !provinceData) {
      return NextResponse.json({ error: "Province not found" }, { status: 404 })
    }

    const { data: buildingsData, error: buildingsError } = await supabase
      .from("buildings")
      .select("*")
      .eq("province_id", provinceData.id)
      .single()

    if (buildingsError || !buildingsData) {
      return NextResponse.json({ error: "Buildings not found" }, { status: 404 })
    }

    const currentQuantity = buildingsData[buildingType] || 0
    if (currentQuantity < quantity) {
      return NextResponse.json(
        {
          error: `Not enough ${buildingType}. You have ${currentQuantity} but tried to demolish ${quantity}`,
        },
        { status: 400 },
      )
    }

    // Calculate demolition cost (1 turn per building)
    const turnsCost = quantity

    // Check if user has enough turns
    if (provinceData.turns < turnsCost) {
      return NextResponse.json({ error: "Insufficient turns" }, { status: 400 })
    }

    const { error: updateBuildingsError } = await supabase
      .from("buildings")
      .update({
        [buildingType]: currentQuantity - quantity,
      })
      .eq("province_id", provinceData.id)

    if (updateBuildingsError) {
      return NextResponse.json({ error: "Failed to demolish buildings" }, { status: 500 })
    }

    // Update province: deduct turns, update timestamp
    const { data: updatedProvince, error: updateError } = await supabase
      .from("provinces")
      .update({
        turns: provinceData.turns - turnsCost,
        last_update: new Date().toISOString(),
      })
      .eq("id", provinceData.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Failed to update province" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully demolished ${quantity} ${buildingType}. ${quantity} acre(s) freed.`,
      data: {
        buildingsDestroyed: quantity,
        turnsSpent: turnsCost,
        landFreed: quantity,
        province: updatedProvince,
      },
    })
  } catch (error) {
    console.error("Demolition error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
