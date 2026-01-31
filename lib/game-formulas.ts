/**
 * MageLord - Game Formulas & Business Logic
 * All game calculations including buffs/debuffs, exploration, construction, and recruitment
 */

export type ClassType = "paladin" | "warrior" | "mage" | "hunter" | "rogue"
export type AlignmentType = "light" | "darkness" | "neutral"
export type FactionType =
  | "infernal"
  | "celestial"
  | "sangre"
  | "destruccion"
  | "ultratumba"
  | "escama"
  | "asuryan"
  | "hierro"

// ============================================
// SYSTEM OF BUFFS/DEBUFFS (Modifiers)
// ============================================

interface Modifiers {
  attack: number
  defense: number
  magic: number
  exploration: number
  espionage: number
  goldProduction: number
  manaGeneration: number
  populationProduction: number
  constructionCost: number
  turnCost: number
  foodConsumption: number
}

const DEFAULT_MODIFIERS: Modifiers = {
  attack: 1.0,
  defense: 1.0,
  magic: 1.0,
  exploration: 1.0,
  espionage: 1.0,
  goldProduction: 1.0,
  manaGeneration: 1.0,
  populationProduction: 1.0,
  constructionCost: 1.0,
  turnCost: 1.0,
  foodConsumption: 1.0,
}

/**
 * Calculate all active modifiers for a user based on faction, class, and alignment
 */
export function calculateModifiers(faction: FactionType, userClass: ClassType, alignment: AlignmentType): Modifiers {
  const modifiers = { ...DEFAULT_MODIFIERS }

  // ===== FACTION MODIFIERS =====
  switch (faction) {
    case "destruccion": // Orcs
      modifiers.attack *= 1.2
      modifiers.magic *= 0.8
      break
    case "asuryan": // Elves
      modifiers.exploration *= 1.1
      modifiers.magic *= 1.1
      modifiers.defense *= 0.9
      break
    case "ultratumba": // Undead
      modifiers.foodConsumption = 0 // No food consumption
      break
    case "hierro": // Dwarves
      modifiers.goldProduction *= 1.15
      modifiers.constructionCost *= 0.9
      break
    case "celestial": // Angels
      modifiers.defense *= 1.15
      modifiers.magic *= 1.1
      break
    case "infernal": // Demons
      modifiers.attack *= 1.25
      modifiers.defense *= 0.85
      break
    case "sangre": // Vampires
      modifiers.attack *= 1.15
      modifiers.manaGeneration *= 1.1
      break
    case "escama": // Dragons
      modifiers.defense *= 1.2
      modifiers.populationProduction *= 0.8
      break
  }

  // ===== CLASS MODIFIERS =====
  switch (userClass) {
    case "warrior":
      modifiers.attack *= 1.15
      break
    case "mage":
      modifiers.manaGeneration *= 1.25
      break
    case "hunter":
      modifiers.exploration *= 1.2
      break
    case "rogue":
      modifiers.espionage *= 1.3
      break
    case "paladin":
      modifiers.defense *= 1.2
      break
  }

  // ===== ALIGNMENT MODIFIERS =====
  switch (alignment) {
    case "light":
      modifiers.populationProduction *= 1.1
      break
    case "darkness":
      modifiers.attack *= 1.1
      modifiers.populationProduction *= 0.9
      break
    case "neutral":
      modifiers.turnCost *= 0.9
      break
  }

  return modifiers
}

// ============================================
// EXPLORATION FORMULA (Acquire Land)
// ============================================

export interface ExplorationResult {
  success: boolean
  landFound: number
  goldCost: number
  turnsCost: number
  message: string
}

/**
 * Calculate exploration results using MageLord's turn-based system with updated formula
 * Formula: New Land = [(UnitsAuto × Factor) / Current Land] × Turns
 * Where UnitsAuto = 20% of Current Land
 */
export function calculateExploration(
  turnsInvested: number,
  currentLand: number,
  userClass: ClassType,
  faction: FactionType,
  alignment: AlignmentType,
): ExplorationResult {
  const goldCostPerTurn = 100
  const factor = 500 // Balance constant

  if (turnsInvested <= 0) {
    return {
      success: false,
      landFound: 0,
      goldCost: 0,
      turnsCost: 0,
      message: "Must invest at least 1 turn to explore",
    }
  }

  const unitsAuto = Math.floor(currentLand * 0.2)

  // Get modifiers for this user
  const modifiers = calculateModifiers(faction, userClass, alignment)

  const baseLand = (unitsAuto * factor) / Math.max(1, currentLand)
  let landFound = baseLand * turnsInvested

  // Apply exploration buff from class (Hunter +20%)
  landFound *= modifiers.exploration

  const luck = Math.random() * (1.2 - 0.8) + 0.8
  landFound *= luck

  // Round down
  landFound = Math.floor(landFound)

  // Minimum 1 land if successful
  if (landFound < 1) {
    landFound = 1
  }

  const goldCost = goldCostPerTurn * turnsInvested

  return {
    success: true,
    landFound,
    goldCost,
    turnsCost: turnsInvested,
    message: `Exploration successful! Found ${landFound} acres of land.`,
  }
}

// ============================================
// CONSTRUCTION LOGIC
// ============================================

export interface BuildingCost {
  gold: number
  turns: number
  landRequired: number
}

export const BUILDING_COSTS: Record<string, BuildingCost> = {
  farm: { gold: 50, turns: 1, landRequired: 1 },
  mine: { gold: 100, turns: 1, landRequired: 1 },
  barracks: { gold: 125, turns: 2, landRequired: 1 },
  mage_tower: { gold: 200, turns: 2, landRequired: 1 },
  fort: { gold: 250, turns: 3, landRequired: 2 },
  wall: { gold: 500, turns: 4, landRequired: 2 },
}

export interface ConstructionResult {
  success: boolean
  goldCost: number
  turnsCost: number
  landUsed: number
  message: string
}

/**
 * Calculate construction capacity per turn based on population and technology
 * Formula: Buildings per Turn = (Population × 0.05) / 10 + (TechLevel × 2)
 */
export function calculateConstructionCapacity(population: number, techLevel = 0): number {
  const baseCap = (population * 0.05) / 10
  const techBonus = techLevel * 2
  return Math.floor(baseCap + techBonus)
}

/**
 * Validate and calculate construction costs
 * @param buildingType - Type of building to construct
 * @param turnsInvested - Number of turns to invest in construction
 * @param currentGold - Player's current gold
 * @param currentTurns - Player's current turns
 * @param currentLand - Total land owned
 * @param currentBuildings - Total buildings already constructed
 * @param population - Total population available
 * @param faction - User's faction
 * @param userClass - User's class
 * @param alignment - User's alignment
 */
export function validateConstruction(
  buildingType: string,
  turnsInvested: number,
  currentGold: number,
  currentTurns: number,
  currentLand: number,
  currentBuildings: number,
  population: number,
  faction: FactionType,
  userClass: ClassType,
  alignment: AlignmentType,
): ConstructionResult {
  // Get building costs
  const baseCost = BUILDING_COSTS[buildingType]
  if (!baseCost) {
    return {
      success: false,
      goldCost: 0,
      turnsCost: 0,
      landUsed: 0,
      message: "Invalid building type",
    }
  }

  if (turnsInvested <= 0) {
    return {
      success: false,
      goldCost: 0,
      turnsCost: 0,
      landUsed: 0,
      message: "Must invest at least 1 turn to construct",
    }
  }

  const buildingsPerTurn = calculateConstructionCapacity(population)
  const totalBuildings = buildingsPerTurn * turnsInvested

  // Get modifiers
  const modifiers = calculateModifiers(faction, userClass, alignment)

  // Calculate actual costs with modifiers
  const goldCost = Math.floor(baseCost.gold * totalBuildings * modifiers.constructionCost)
  const turnsCost = turnsInvested
  const landUsed = baseCost.landRequired * totalBuildings

  // Validation 1: Check gold
  if (goldCost > currentGold) {
    return {
      success: false,
      goldCost,
      turnsCost,
      landUsed,
      message: `Insufficient gold. Required: ${goldCost}, Available: ${currentGold}`,
    }
  }

  // Validation 2: Check turns
  if (turnsCost > currentTurns) {
    return {
      success: false,
      goldCost,
      turnsCost,
      landUsed,
      message: `Insufficient turns. Required: ${turnsCost}, Available: ${currentTurns}`,
    }
  }

  // Validation 3: Check available land
  const freeLand = currentLand - currentBuildings
  if (landUsed > freeLand) {
    return {
      success: false,
      goldCost,
      turnsCost,
      landUsed,
      message: `Insufficient free land. Required: ${landUsed}, Available: ${freeLand}`,
    }
  }

  return {
    success: true,
    goldCost,
    turnsCost,
    landUsed,
    message: `Construction successful! Built ${totalBuildings} ${buildingType}(s) using ${turnsInvested} turn(s)`,
  }
}

// ============================================
// RECRUITMENT FORMULA (Military System)
// ============================================

export interface RecruitmentResult {
  success: boolean
  troopsRecruited: number
  goldCost: number
  manaCost: number
  turnsCost: number
  message: string
}

/**
 * Calculate recruitment results using turn-based system
 * Formula: Troops per Turn = Barracks × FactorTier
 * FactorTier: T1=50, T2=20, T3=10, T4=2
 */
export function calculateRecruitment(
  turnsInvested: number,
  barracks: number,
  unitTier: number,
  unitBaseCost: number,
  unitManaCost: number,
  currentGold: number,
  currentMana: number,
  currentTurns: number,
  freeCitizens: number,
  faction: FactionType,
): RecruitmentResult {
  if (turnsInvested <= 0) {
    return {
      success: false,
      troopsRecruited: 0,
      goldCost: 0,
      manaCost: 0,
      turnsCost: 0,
      message: "Must invest at least 1 turn to recruit",
    }
  }

  let troopsPerTurn = 0
  switch (unitTier) {
    case 1:
      troopsPerTurn = barracks * 50
      break
    case 2:
      troopsPerTurn = barracks * 20
      break
    case 3:
      troopsPerTurn = barracks * 10
      break
    case 4:
      troopsPerTurn = barracks * 2
      break
    default:
      troopsPerTurn = barracks * 50
  }

  const totalTroops = troopsPerTurn * turnsInvested

  const factionMultiplier = faction === "destruccion" ? 0.85 : 1.0

  const goldCost = Math.floor(unitBaseCost * totalTroops * factionMultiplier)
  const manaCost = Math.floor(unitManaCost * totalTroops)

  // Validations
  if (goldCost > currentGold) {
    return {
      success: false,
      troopsRecruited: 0,
      goldCost,
      manaCost,
      turnsCost: turnsInvested,
      message: `Insufficient gold. Required: ${goldCost}, Available: ${currentGold}`,
    }
  }

  if (manaCost > currentMana) {
    return {
      success: false,
      troopsRecruited: 0,
      goldCost,
      manaCost,
      turnsCost: turnsInvested,
      message: `Insufficient mana. Required: ${manaCost}, Available: ${currentMana}`,
    }
  }

  if (turnsInvested > currentTurns) {
    return {
      success: false,
      troopsRecruited: 0,
      goldCost,
      manaCost,
      turnsCost: turnsInvested,
      message: `Insufficient turns. Required: ${turnsInvested}, Available: ${currentTurns}`,
    }
  }

  if (totalTroops > freeCitizens) {
    return {
      success: false,
      troopsRecruited: 0,
      goldCost,
      manaCost,
      turnsCost: turnsInvested,
      message: `Insufficient free citizens. Required: ${totalTroops}, Available: ${freeCitizens}`,
    }
  }

  return {
    success: true,
    troopsRecruited: totalTroops,
    goldCost,
    manaCost,
    turnsCost: turnsInvested,
    message: `Training successful! Recruited ${totalTroops} troops using ${turnsInvested} turn(s)`,
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all active buffs for display in UI
 */
export function getActiveBuffs(faction: FactionType, userClass: ClassType, alignment: AlignmentType): string[] {
  const buffs: string[] = []
  const modifiers = calculateModifiers(faction, userClass, alignment)

  // Faction buffs
  if (modifiers.attack > 1.0) buffs.push(`+${Math.round((modifiers.attack - 1) * 100)}% Attack`)
  if (modifiers.defense > 1.0) buffs.push(`+${Math.round((modifiers.defense - 1) * 100)}% Defense`)
  if (modifiers.magic > 1.0) buffs.push(`+${Math.round((modifiers.magic - 1) * 100)}% Magic`)
  if (modifiers.exploration > 1.0) buffs.push(`+${Math.round((modifiers.exploration - 1) * 100)}% Exploration`)
  if (modifiers.espionage > 1.0) buffs.push(`+${Math.round((modifiers.espionage - 1) * 100)}% Espionage`)
  if (modifiers.goldProduction > 1.0)
    buffs.push(`+${Math.round((modifiers.goldProduction - 1) * 100)}% Gold Production`)
  if (modifiers.manaGeneration > 1.0)
    buffs.push(`+${Math.round((modifiers.manaGeneration - 1) * 100)}% Mana Generation`)
  if (modifiers.populationProduction > 1.0)
    buffs.push(`+${Math.round((modifiers.populationProduction - 1) * 100)}% Population Growth`)
  if (modifiers.constructionCost < 1.0)
    buffs.push(`-${Math.round((1 - modifiers.constructionCost) * 100)}% Construction Cost`)
  if (modifiers.turnCost < 1.0) buffs.push(`-${Math.round((1 - modifiers.turnCost) * 100)}% Turn Cost`)
  if (modifiers.foodConsumption === 0) buffs.push(`No Food Consumption`)

  // Debuffs
  if (modifiers.attack < 1.0) buffs.push(`${Math.round((modifiers.attack - 1) * 100)}% Attack`)
  if (modifiers.defense < 1.0) buffs.push(`${Math.round((modifiers.defense - 1) * 100)}% Defense`)
  if (modifiers.magic < 1.0) buffs.push(`${Math.round((modifiers.magic - 1) * 100)}% Magic`)
  if (modifiers.populationProduction < 1.0)
    buffs.push(`${Math.round((modifiers.populationProduction - 1) * 100)}% Population Growth`)

  return buffs
}

/**
 * Calculate total guild networth (sum of all members)
 */
export function calculateGuildNetworth(members: Array<{ networth: number }>): number {
  return members.reduce((acc, member) => acc + member.networth, 0)
}

/**
 * Check if guild has synergy bonus (70% same faction)
 */
export function hasGuildSynergyBonus(members: Array<{ faction: FactionType }>): { has: boolean; bonus: string } {
  if (members.length === 0) return { has: false, bonus: "" }

  const factionCounts: Record<string, number> = {}
  members.forEach((member) => {
    factionCounts[member.faction] = (factionCounts[member.faction] || 0) + 1
  })

  const totalMembers = members.length
  for (const [faction, count] of Object.entries(factionCounts)) {
    if (count / totalMembers >= 0.7) {
      // 70% threshold for bonus
      switch (faction as FactionType) {
        case "infernal":
          return { has: true, bonus: "+10% Tier 1 recruitment speed" }
        case "hierro":
          return { has: true, bonus: "+10% Construction speed" }
        case "destruccion":
          return { has: true, bonus: "+10% Attack damage" }
        case "celestial":
          return { has: true, bonus: "+10% Defense" }
        case "asuryan":
          return { has: true, bonus: "+10% Exploration efficiency" }
        case "ultratumba":
          return { has: true, bonus: "+10% Espionage success" }
        case "sangre":
          return { has: true, bonus: "+10% Mana generation" }
        case "escama":
          return { has: true, bonus: "+10% Territory defense" }
      }
    }
  }

  return { has: false, bonus: "" }
}
