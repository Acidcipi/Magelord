/**
 * Construction API Route
 * POST /api/construction
 *
 * Handles building construction using game formulas
 */

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { validateConstruction, BUILDING_COSTS } from "@/lib/game-formulas"
import type { ClassType, AlignmentType, FactionType } from "@/lib/game-formulas"

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
      return NextResponse.json({ error: "Invalid building type or quantity" }, { status: 400 })
    }

    // Validate building type exists
    if (!BUILDING_COSTS[buildingType]) {
      return NextResponse.json({ error: "Invalid building type" }, { status: 400 })
    }

    // Get user data from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, faction, class, alignment")
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

    // Get current buildings count
    const { data: buildingsData } = await supabase.from("buildings").select("*").eq("user_id", userData.id)

    const totalBuildings = buildingsData?.reduce((sum, b) => sum + (b.level || 1), 0) || 0

    // Validate construction using game formulas
    const result = validateConstruction(
      buildingType,
      quantity,
      provinceData.gold,
      provinceData.turns,
      provinceData.land,
      totalBuildings,
      userData.faction as FactionType,
      userData.class as ClassType,
      userData.alignment as AlignmentType,
    )

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    // Deduct resources from province
    const { error: updateProvinceError } = await supabase
      .from("provinces")
      .update({
        gold: provinceData.gold - result.goldCost,
        turns: provinceData.turns - result.turnsCost,
        last_update: new Date().toISOString(),
      })
      .eq("id", provinceData.id)

    if (updateProvinceError) {
      return NextResponse.json({ error: "Failed to update province resources" }, { status: 500 })
    }

    // Add or update building
    const { data: existingBuilding } = await supabase
      .from("buildings")
      .select("*")
      .eq("user_id", userData.id)
      .eq("building_type", buildingType)
      .single()

    if (existingBuilding) {
      // Update existing building
      await supabase
        .from("buildings")
        .update({
          level: existingBuilding.level + quantity,
        })
        .eq("id", existingBuilding.id)
    } else {
      // Insert new building
      await supabase.from("buildings").insert({
        user_id: userData.id,
        building_type: buildingType,
        level: quantity,
      })
    }

    // Get updated province
    const { data: updatedProvince } = await supabase.from("provinces").select("*").eq("user_id", userData.id).single()

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        buildingType,
        quantity,
        goldSpent: result.goldCost,
        turnsSpent: result.turnsCost,
        landUsed: result.landUsed,
        province: updatedProvince,
      },
    })
  } catch (error) {
    console.error("Construction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
