/**
 * Game State Management
 * Fetches complete game state from Supabase tables
 * Manually joins users, provinces, buildings, and guilds
 */

import { supabase } from "@/lib/supabaseClient"

export type UserRole = "player" | "forum_admin" | "web_admin" | "admin" | "owner"

export interface GameState {
  // User data
  user_id: string
  email: string
  username: string
  role: UserRole
  bio: string | null
  last_login: string
  guild_id: number | null
  guild_name: string | null

  // Province data
  province_id: string
  province_name: string
  faction: string
  class_type: string
  alignment: string
  acres: number
  networth: number
  gold: number
  mana: number
  food: number
  turns: number
  max_turns: number
  last_update: string
  population: number
  health: number
  morale: number
  tax_rate: number
  next_turn_at: string
  protection_expires: string

  population_civilians: number
  population_military: number
  population_unemployed: number
  population_total: number

  land: number
  magic_level: number
  academy_level: number
  name: string
  class: string
  tier1_units: number
  tier2_units: number
  tier3_units: number
  tier4_units: number
  free_acres: number
  buildings_total: number
  fortresses: number
  attack: number
  defense: number

  // Additional fields for units and buildings
  units?: any[]
  buildings?: {
    homes: number
    farms: number
    mines: number
    towers: number
    barracks: number
    walls: number
    fortresses: number
  }
}

export interface MilitaryUnit {
  unit_id: number
  unit_name: string
  quantity: number
  attack: number
  defense: number
  upkeep: number
  abilities: string[] | null
  tier: number
  faction_restriction: string | null
}

export interface MasterUnit {
  id: number
  name: string
  faction_restriction: string
  tier: number
  attack: number
  defense: number
  accuracy: number
  unit_type: string
  maintenance_gold: number
  maintenance_mana: number
  image_url: string | null
  is_black_market_item: boolean
  gold_cost?: number
  mana_cost?: number
  turn_cost?: number
  description?: string
}

export interface ProvinceUnit {
  unit_id: number
  quantity: number
  unit: MasterUnit
}

/**
 * Fetches complete game state by querying tables directly
 * @param userId - UUID from auth.users (also stored in users.id)
 * @returns GameState or null if not found
 */
export async function fetchGameState(userId: string): Promise<GameState | null> {
  try {
    console.log("[v0] ðŸ” Fetching game state for user_id:", userId)

    const userIdString = String(userId)

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, username, role, bio, last_login, faction, class, alignment")
      .eq("id", userIdString)
      .single()

    if (userError || !userData) {
      console.error("[v0] âŒ User not found:", userError?.message)
      return null
    }

    console.log("[v0] âœ… User data loaded:", {
      username: userData.username,
      role: userData.role,
      faction: userData.faction,
      class: userData.class,
      alignment: userData.alignment,
    })

    console.log("[v0] âœ… User found:", userData.username, "| Role:", userData.role)

    const { data: provinceData, error: provinceError } = await supabase
      .from("provinces")
      .select(
        "id, name, networth, land, gold, mana, food, turns, max_turns, last_update, population, health, morale, magic_level, tax_rate, next_turn_at, protection_expires",
      )
      .eq("user_id", userData.id)
      .single()

    if (provinceError || !provinceData) {
      console.error("[v0] âŒ Province not found:", provinceError?.message)
      return null
    }

    console.log("[v0] ðŸ° Province found:", provinceData.name)

    const provinceIdString = String(provinceData.id)

    const { data: buildingsData, error: buildingsError } = await supabase
      .from("buildings")
      .select("homes, farms, mines, towers, barracks, walls, fortresses")
      .eq("province_id", provinceIdString)
      .maybeSingle()

    const buildingsMap = {
      homes: buildingsData?.homes || 0,
      farms: buildingsData?.farms || 0,
      mines: buildingsData?.mines || 0,
      towers: buildingsData?.towers || 0,
      barracks: buildingsData?.barracks || 0,
      walls: buildingsData?.walls || 0,
      fortresses: buildingsData?.fortresses || 0,
    }

    if (buildingsData) {
      console.log("[v0] ðŸ—ï¸ Buildings loaded:", buildingsMap)
    } else {
      console.warn("[v0] âš ï¸ Buildings not found, using defaults")
    }

    let totalAttack = 0
    let totalDefense = 0

    console.log("[v0] ID BUSCADO:", provinceIdString)

    console.log("[v0] ðŸ” Fetching province_units with province_id:", provinceIdString)
    const { data: provinceUnitsData } = await supabase
      .from("province_units")
      .select("unit_id, quantity, defense_assignment_pct")
      .eq("province_id", provinceIdString)

    console.log("[v0] ðŸ“¦ Province units data:", provinceUnitsData)

    if (!provinceUnitsData || provinceUnitsData.length === 0) {
      console.warn("[v0] âš ï¸ No se encontraron filas en la DB para este ID:", provinceIdString)
    }

    const processedUnits: any[] = []

    if (provinceUnitsData && provinceUnitsData.length > 0) {
      const unitIds = provinceUnitsData.map((pu: any) => pu.unit_id)

      console.log("[v0] ðŸ” Fetching master_units for specific IDs:", unitIds.length)
      const { data: masterUnitsData } = await supabase
        .from("master_units")
        .select("id, name, attack, defense, tier")
        .in("id", unitIds)

      console.log("[v0] ðŸ“š Master units data:", masterUnitsData?.length, "units")

      if (masterUnitsData && masterUnitsData.length > 0) {
        provinceUnitsData.forEach((provinceUnit: any) => {
          const unitId = String(provinceUnit.unit_id)
          const quantity = provinceUnit.quantity || 0
          const defenseAssignmentPct = provinceUnit.defense_assignment_pct || 50

          const masterUnit = masterUnitsData.find((mu: any) => String(mu.id) === unitId)

          if (masterUnit) {
            const attack = masterUnit.attack || 0
            const defense = masterUnit.defense || 0

            totalAttack += attack * quantity
            totalDefense += defense * quantity

            processedUnits.push({
              unit_id: unitId,
              quantity: quantity,
              defense_assignment_pct: defenseAssignmentPct,
              master_units: {
                name: masterUnit.name,
                attack: attack,
                defense: defense,
                tier: masterUnit.tier,
              },
              id: unitId,
              name: masterUnit.name,
              attack: attack,
              defense: defense,
              tier: masterUnit.tier,
            })

            console.log(`[v0] âš”ï¸ Unit ${masterUnit.name}: ${quantity}x (Atk: ${attack}, Def: ${defense})`)
          } else {
            console.warn(`[v0] âš ï¸ Master unit not found for unit_id: ${unitId}`)
          }
        })
        console.log("[v0] âš”ï¸ Total Attack:", totalAttack, "| Total Defense:", totalDefense)
      }
    } else {
      console.log("[v0] ðŸ“­ No units found")
    }

    const totalPopulation = provinceData.population || 0
    const populationCivilians = Math.floor(totalPopulation * 0.7)
    const populationMilitary = Math.floor(totalPopulation * 0.2)
    const populationUnemployed = totalPopulation - populationCivilians - populationMilitary

    const buildingsTotal =
      buildingsMap.homes +
      buildingsMap.farms +
      buildingsMap.mines +
      buildingsMap.towers +
      buildingsMap.barracks +
      buildingsMap.walls +
      buildingsMap.fortresses

    const guildName = null
    const guildId = null

    const gameState: GameState = {
      user_id: userData.id,
      email: userData.email,
      username: userData.username,
      role: userData.role as UserRole,
      bio: userData.bio,
      last_login: userData.last_login,
      guild_id: guildId,
      guild_name: guildName,

      province_id: provinceData.id,
      province_name: provinceData.name,
      name: provinceData.name,
      faction: userData.faction || "unknown",
      class_type: userData.class || "unknown",
      class: userData.class || "unknown",
      alignment: userData.alignment || "neutral",
      acres: provinceData.land || 0,
      land: provinceData.land || 0,
      networth: provinceData.networth || 0,
      gold: provinceData.gold || 0,
      mana: provinceData.mana || 0,
      food: provinceData.food || 0,
      turns: provinceData.turns || 0,
      max_turns: provinceData.max_turns || 150,
      last_update: provinceData.last_update,
      population: totalPopulation,
      population_total: totalPopulation,
      population_civilians: populationCivilians,
      population_military: populationMilitary,
      population_unemployed: populationUnemployed,
      health: provinceData.health || 100,
      morale: provinceData.morale || 100,
      magic_level: provinceData.magic_level || 1,
      academy_level: 1, // Default value since column doesn't exist in DB
      tax_rate: provinceData.tax_rate || 15,
      next_turn_at: provinceData.next_turn_at || new Date().toISOString(),
      protection_expires: provinceData.protection_expires || new Date().toISOString(),

      tier1_units: 0,
      tier2_units: 0,
      tier3_units: 0,
      tier4_units: 0,

      homes: buildingsMap.homes,
      farms: buildingsMap.farms,
      mines: buildingsMap.mines,
      towers: buildingsMap.towers,
      barracks: buildingsMap.barracks,
      walls: buildingsMap.walls,
      fortresses: buildingsMap.fortresses,

      buildings_total: buildingsTotal,
      free_acres: (provinceData.land || 0) - buildingsTotal,

      attack: totalAttack,
      defense: totalDefense,

      units: processedUnits,
      buildings: buildingsMap,
    }

    console.log("[v0] âœ… Game state loaded successfully")
    console.log("[v0] ðŸ‘‘ Acceso concedido como:", gameState.role)

    return gameState
  } catch (error: any) {
    console.error("[v0] ðŸ’¥ Critical error in fetchGameState:", error)
    return null
  }
}

/**
 * Fetches military units by joining province_units with master_units
 * @param provinceId - Province ID (UUID)
 * @returns Array of military units with full details
 */
export async function fetchMilitaryState(provinceId: string): Promise<MilitaryUnit[]> {
  try {
    console.log("[v0] ðŸ—¡ï¸ Fetching military state for province_id:", provinceId)

    const provinceIdString = String(provinceId)

    const { data, error } = await supabase
      .from("province_units")
      .select(`
        quantity,
        master_units (
          id,
          name,
          attack,
          defense,
          upkeep,
          tier,
          faction_restriction
        )
      `)
      .eq("province_id", provinceIdString)

    if (error) {
      console.error("[v0] âŒ Error fetching military state:", error.message)
      return []
    }

    if (!data || data.length === 0) {
      console.log("[v0] ðŸ“­ No units found for province")
      return []
    }

    const units: MilitaryUnit[] = data.map((item: any) => ({
      unit_id: item.master_units.id,
      unit_name: item.master_units.name,
      quantity: item.quantity,
      attack: item.master_units.attack,
      defense: item.master_units.defense,
      upkeep: item.master_units.upkeep,
      abilities: null, // TODO: Query unit_ability_map for abilities
      tier: item.master_units.tier,
      faction_restriction: item.master_units.faction_restriction,
    }))

    console.log("[v0] âš”ï¸ Loaded", units.length, "unit types")
    return units
  } catch (error: any) {
    console.error("[v0] ðŸ’¥ Critical error in fetchMilitaryState:", error)
    return []
  }
}

/**
 * Updates resource after an action (optimistic update)
 */
export async function updateResource(provinceId: string, resource: string, amount: number): Promise<boolean> {
  try {
    const provinceIdString = String(provinceId)

    const { error } = await supabase
      .from("provinces")
      .update({ [resource]: amount })
      .eq("id", provinceIdString)

    if (error) {
      console.error("[v0] Error updating resource:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Critical error updating resource:", error)
    return false
  }
}

/**
 * Updates the last_update timestamp after turn usage
 */
export async function updateLastUpdate(provinceId: string): Promise<void> {
  try {
    const provinceIdString = String(provinceId)

    await supabase.from("provinces").update({ last_update: new Date().toISOString() }).eq("id", provinceIdString)

    console.log("[v0] Updated last_update timestamp")
  } catch (error) {
    console.error("[v0] Error updating last_update:", error)
  }
}

/**
 * Fetches all master units for a specific faction
 */
export async function fetchMasterUnits(faction: string): Promise<MasterUnit[]> {
  try {
    console.log("[v0] ðŸ“š Fetching master units for faction:", faction)

    const { data, error } = await supabase
      .from("master_units")
      .select("*")
      .eq("faction_restriction", faction)
      .order("tier")

    if (error) {
      console.error("[v0] âŒ Error fetching master units:", error.message)
      return []
    }

    if (!data || data.length === 0) {
      console.warn("[v0] âš ï¸ No master units found for faction:", faction)
      return []
    }

    console.log("[v0] âœ… Loaded", data.length, "master units for faction:", faction)
    return data as MasterUnit[]
  } catch (error: any) {
    console.error("[v0] ðŸ’¥ Critical error fetching master units:", error)
    return []
  }
}

/**
 * Fetches province units joined with master_units data
 */
export async function fetchProvinceUnits(provinceId: string): Promise<ProvinceUnit[]> {
  try {
    console.log("[v0] ðŸ—¡ï¸ Fetching province units for province_id:", provinceId)

    const provinceIdString = String(provinceId)

    const { data, error } = await supabase
      .from("province_units")
      .select(`
        unit_id,
        quantity,
        master_units (*)
      `)
      .eq("province_id", provinceIdString)

    if (error) {
      console.error("[v0] âŒ Error fetching province units:", error.message)
      return []
    }

    if (!data || data.length === 0) {
      console.log("[v0] ðŸ“­ No units found for province")
      return []
    }

    const units: ProvinceUnit[] = data.map((item: any) => ({
      unit_id: item.unit_id,
      quantity: item.quantity,
      unit: item.master_units as MasterUnit,
    }))

    console.log("[v0] âš”ï¸ Loaded", units.length, "unit types")
    return units
  } catch (error: any) {
    console.error("[v0] ðŸ’¥ Critical error fetching province units:", error)
    return []
  }
}

/**
 * Fetches the user's ranking position based on networth
 * @param provinceId - Province ID (UUID) to find ranking for
 * @returns Ranking position (1-based) or null if error
 */
export async function fetchUserRanking(provinceId: string): Promise<number | null> {
  try {
    console.log("[v0] ðŸ“Š Fetching ranking for province_id:", provinceId)

    const provinceIdString = String(provinceId)

    const { data, error } = await supabase
      .from("provinces")
      .select("id, networth")
      .order("networth", { ascending: false })

    if (error) {
      console.error("[v0] âŒ Error fetching rankings:", error.message)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    const position = data.findIndex((p) => String(p.id) === provinceIdString)

    if (position === -1) {
      console.warn("[v0] âš ï¸ Province not found in rankings")
      return null
    }

    const ranking = position + 1 // Convert to 1-based
    console.log("[v0] âœ… User ranking:", ranking, "out of", data.length)
    return ranking
  } catch (error: any) {
    console.error("[v0] ðŸ’¥ Critical error fetching ranking:", error)
    return null
  }
}