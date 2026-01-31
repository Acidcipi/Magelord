/**
 * Faction system - Complete Archmage factions with locked content
 */

export type Faction =
  | "infernal"
  | "celestial"
  | "sangre"
  | "destruccion"
  | "ultratumba"
  | "escama"
  | "asuryan"
  | "hierro"

export interface FactionData {
  name: string
  icon: string
  color: string
  description: string
  buildings: string[]
  units: string[]
  spells: string[]
}

export const FACTIONS: Record<Faction, FactionData> = {
  infernal: {
    name: "Legiones Infernales",
    icon: "🔥",
    color: "#ff4500",
    description: "+15% Oro en ataques con éxito. Ataque: Mayor daño infligido, pero sus unidades mueren más rápido.",
    buildings: ["torre_infernal", "forja_demoniaca", "portal_abismo", "altar_sacrificio"],
    units: ["golem_fuego", "demonio_menor", "demonio_mayor", "senor_infierno", "imp"],
    spells: ["bola_fuego", "lluvia_fuego", "inferno", "invocar_demonio", "pacto_oscuro"],
  },
  celestial: {
    name: "Cónclave Celestial",
    icon: "✨",
    color: "#ffd700",
    description: "-10% Coste de Maná en hechizos. Defensa: Bonus de supervivencia en Fuertes y Murallas.",
    buildings: ["torre_luz", "templo_celestial", "santuario", "catedral"],
    units: ["angel_guardian", "paladin", "clerigo", "arcangel", "serafin"],
    spells: ["luz_sagrada", "escudo_divino", "curacion_masiva", "bendicion", "resurrecion"],
  },
  sangre: {
    name: "Corte de la Sangre",
    icon: "🩸",
    color: "#8b0000",
    description:
      "Regeneración: Recuperan un 5% de bajas tras cada batalla. Especial: No les afecta la moral baja, pero sus unidades son las más caras.",
    buildings: ["castillo_sangre", "cripta", "laboratorio_sangre", "salon_trono"],
    units: ["vampiro", "nosferatu", "vampiro_antiguo", "murcielago_gigante", "gul"],
    spells: ["drenar_vida", "niebla_sangre", "vampirismo", "dominar_mente", "sed_sangre"],
  },
  destruccion: {
    name: "Hordas de la Destrucción",
    icon: "⚔️",
    color: "#228b22",
    description: "+20% Producción de comida (Granjas). Cantidad: Reclutamiento un 15% más barato.",
    buildings: ["campamento_orco", "forja_guerra", "foso_lobos", "totem_guerra"],
    units: ["goblin", "orco_guerrero", "orco_berserker", "troll", "jinete_lobo"],
    spells: ["furia_batalla", "berserker", "invocar_horda", "rompe_murallas", "grito_guerra"],
  },
  ultratumba: {
    name: "Reinos de Ultratumba",
    icon: "💀",
    color: "#4b0082",
    description:
      "Consumo Cero: No consumen comida (solo Oro). Exploración: Inmunes a penalizaciones de terreno baldío.",
    buildings: ["necropolis", "osario", "tumba_antigua", "torre_nigromante"],
    units: ["esqueleto", "zombie", "espectro", "lich", "caballero_muerte"],
    spells: ["animar_muertos", "plaga", "maldicion", "ejercito_muertos", "drenaje_vida"],
  },
  escama: {
    name: "Guardianes de la Escama",
    icon: "🐉",
    color: "#ff6347",
    description: "+10% Producción de Oro (Minas). Tanque: Reducción de daño físico recibido en un 10%.",
    buildings: ["nido_dragon", "forja_escamas", "volcan", "caverna_ancestral"],
    units: ["draconido", "wyvern", "dragon_joven", "dragon_antiguo", "draco"],
    spells: ["aliento_fuego", "escamas_hierro", "vuelo_dragon", "furia_dragon", "invocar_wyvern"],
  },
  asuryan: {
    name: "Altos Magos de Asuryan",
    icon: "🌟",
    color: "#00ced1",
    description: "+25% Generación de Maná (Torres). Magia: Mayor probabilidad de éxito en hechizos y espionaje.",
    buildings: ["torre_arcana", "biblioteca_eterna", "jardin_mana", "observatorio"],
    units: ["mago_elfo", "arquero_lunar", "guardian_bosque", "hechicero_alto", "centinela"],
    spells: ["tormenta_arcana", "invisibilidad", "teletransporte", "contrahechizo", "explosion_mana"],
  },
  hierro: {
    name: "Ingenios de Hierro",
    icon: "🛠️",
    color: "#708090",
    description: "Construcción: -15% Coste de Oro en edificios. Fortaleza: Sus Murallas son un 20% más efectivas.",
    buildings: ["forja_enana", "mina_profunda", "taller_ingeniero", "gran_muralla"],
    units: ["guerrero_enano", "ingeniero", "ballesta_pesada", "tanque_vapor", "golem_hierro"],
    spells: ["fortificar", "reparar", "explosion_mina", "maquina_guerra", "escudo_hierro"],
  },
}
