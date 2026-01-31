/**
 * Exploration API Route
 * POST /api/exploration
 *
 * Handles land exploration using turn-based system with automatic unit assignment
 * Uses updated formula: [(UnitsAuto × Factor) / Current Land] × Turns
 * Where UnitsAuto = 20% of Current Land
 */

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { calculateExploration } from "@/lib/game-formulas"
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
    const { turnsToExplore } = body

    if (!turnsToExplore || turnsToExplore <= 0) {
      return NextResponse.json({ error: "Must invest at least 1 turn to explore" }, { status: 400 })
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

    const result = calculateExploration(
      turnsToExplore,
      provinceData.land,
      userData.class as ClassType,
      userData.faction as FactionType,
      userData.alignment as AlignmentType,
    )

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    // Check if user has enough resources
    if (provinceData.gold < result.goldCost) {
      return NextResponse.json({ error: "Insufficient gold" }, { status: 400 })
    }

    if (provinceData.turns < result.turnsCost) {
      return NextResponse.json({ error: "Insufficient turns" }, { status: 400 })
    }

    const { data: updatedProvince, error: updateError } = await supabase
      .from("provinces")
      .update({
        land: provinceData.land + result.landFound,
        gold: provinceData.gold - result.goldCost,
        turns: provinceData.turns - result.turnsCost,
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
      message: result.message,
      data: {
        landFound: result.landFound,
        goldSpent: result.goldCost,
        turnsSpent: result.turnsCost,
        province: updatedProvince,
      },
    })
  } catch (error) {
    console.error("Exploration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
