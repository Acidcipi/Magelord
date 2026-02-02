"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Clock,
  Users,
  Code,
  BookOpen,
  MessageSquare,
  FileText,
  Github,
  Shield,
  FileWarning,
  Scroll,
  Mail,
  ArrowLeft,
  Coins,
  Swords,
  Sparkles,
  Search,
  ChevronRight,
  Info,
  Home,
  Building,
  ShoppingCart,
  Crown,
} from "lucide-react"
import type { Language } from "@/lib/i18n"

interface FooterContentPageProps {
  language: Language
  section: string
  onBack: () => void
}

type TomeId =
  | "fundamentos"
  | "personajes"
  | "economia"
  | "construccion"
  | "militar"
  | "guerra"
  | "magia"
  | "mercado"
  | "diplomacia"
  | "reglas"
  | null

export function FooterContentPage({ language, section, onBack }: FooterContentPageProps) {
  const [activeTome, setActiveTome] = useState<TomeId>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pinnedSection, setPinnedSection] = useState<string | null>(null)

  if (section === "footer-wiki") {
    const tomes = [
      {
        id: "fundamentos" as TomeId,
        title: language === "es" ? "Tomo I: El Ciclo de la Existencia" : "Tome I: The Cycle of Existence",
        subtitle: language === "es" ? "Fundamentos" : "Fundamentals",
        icon: Home,
        color: "text-blue-400",
        bgColor: "from-blue-900/20 to-cyan-900/20",
        sections: [
          {
            id: "turnos",
            title: language === "es" ? "Gestión del Tiempo (Turnos)" : "Time Management (Turns)",
            content:
              language === "es"
                ? "El corazón de MageLord late en ciclos de 15 minutos. Cada pulsación genera 1 Turno que se acumula en tu reserva hasta un máximo de 150. Los turnos son tu moneda más valiosa: construir, explorar, entrenar tropas, todo requiere invertir este recurso finito."
                : "The heart of MageLord beats in 15-minute cycles. Each pulse generates 1 Turn that accumulates in your reserve up to a maximum of 150. Turns are your most valuable currency: building, exploring, training troops, everything requires investing this finite resource.",
            formula: {
              title: language === "es" ? "Generación de Turnos" : "Turn Generation",
              content: "1 Turno cada 15 minutos | Máximo: 150 turnos",
              note:
                language === "es"
                  ? "Los turnos NO se generan si ya tienes el máximo. Úsalos constantemente para no perder productividad."
                  : "Turns are NOT generated if you already have the maximum. Use them constantly to not lose productivity.",
            },
          },
          {
            id: "networth",
            title: language === "es" ? "El Networth (Σ)" : "Networth (Σ)",
            content:
              language === "es"
                ? "Tu Networth es la sumatoria (Σ) de todo tu poder: tierra, edificios, tropas y oro. Es la métrica que define tu ranking y determina quién puede atacarte. Es el corazón del sistema de poder en MageLord."
                : "Your Networth is the sum (Σ) of all your power: land, buildings, troops and gold. It's the metric that defines your ranking and determines who can attack you. It's the heart of the power system in MageLord.",
            formula: {
              title: language === "es" ? "Cálculo de Networth" : "Networth Calculation",
              content: "NW = (Tierra × 100) + (Edificios × 500) + (Tropas × Valor_Tier) + (Oro / 1000)",
              note:
                language === "es"
                  ? "Un NW alto te protege de jugadores pequeños pero te convierte en objetivo de los grandes imperios. El balance es clave."
                  : "A high NW protects you from small players but makes you a target for large empires. Balance is key.",
            },
          },
          {
            id: "proteccion",
            title: language === "es" ? "Protección de Novato" : "Newbie Protection",
            content:
              language === "es"
                ? "Durante tus primeros 3 días (72 horas), eres intocable. Nadie puede atacarte y tú no puedes atacar a nadie. ADVERTENCIA CRÍTICA: Si lanzas un ataque voluntario, pierdes la protección inmediatamente y para siempre. No hay vuelta atrás."
                : "During your first 3 days (72 hours), you're untouchable. No one can attack you and you cannot attack anyone. CRITICAL WARNING: If you launch a voluntary attack, you lose protection immediately and forever. There's no going back.",
            formula: {
              title: language === "es" ? "Duración de Protección" : "Protection Duration",
              content: "72 horas desde el registro | Se pierde permanentemente al atacar",
              note:
                language === "es"
                  ? "Usa este tiempo sabiamente para construir tu economía, explorar territorio y entrenar tu primer ejército antes de entrar en guerra."
                  : "Use this time wisely to build your economy, explore territory and train your first army before entering war.",
            },
          },
        ],
      },
      {
        id: "personajes" as TomeId,
        title: language === "es" ? "Tomo II: Sendas del Poder" : "Tome II: Paths of Power",
        subtitle: language === "es" ? "Facciones, Clases y Alineamientos" : "Factions, Classes & Alignments",
        icon: Users,
        color: "text-purple-400",
        bgColor: "from-purple-900/20 to-indigo-900/20",
        sections: [
          {
            id: "facciones",
            title: language === "es" ? "Las 8 Facciones del Primer Conflicto" : "The 8 Factions of the First Conflict",
            content:
              language === "es"
                ? "En la era del Primer Conflicto, ocho grandes naciones emergieron de las cenizas del Caos Primordial. Cada una forjada por fuerzas antiguas, cada una destinada a luchar por el dominio absoluto. Tu elección define tu estrategia económica, militar y mágica."
                : "In the age of the First Conflict, eight great nations emerged from the ashes of the Primordial Chaos. Each forged by ancient forces, each destined to fight for absolute dominion. Your choice defines your economic, military and magical strategy.",
            factions: [
              {
                name: language === "es" ? "Legiones Infernales" : "Infernal Legions",
                bonus: "+15% " + (language === "es" ? "Oro en ataques" : "Gold on attacks"),
                style:
                  language === "es"
                    ? "Ataque: Mayor daño, menor supervivencia"
                    : "Attack: Higher damage, lower survival",
                lore:
                  language === "es"
                    ? "Forjadas en las llamas del Abismo, las Legiones Infernales son la encarnación del caos y la destrucción. Sus guerreros demoniacos no conocen el miedo ni la piedad."
                    : "Forged in the flames of the Abyss, the Infernal Legions are the embodiment of chaos and destruction. Their demonic warriors know neither fear nor mercy.",
              },
              {
                name: language === "es" ? "Cónclave Celestial" : "Celestial Conclave",
                bonus: "-10% " + (language === "es" ? "Coste de Maná" : "Mana Cost"),
                style: language === "es" ? "Defensa: Bonus en Fuertes y Murallas" : "Defense: Bonus in Forts and Walls",
                lore:
                  language === "es"
                    ? "Enviados por los Dioses para mantener el equilibrio, el Cónclave representa la luz eterna. Sus ángeles y paladines son guardianes inmortales."
                    : "Sent by the Gods to maintain balance, the Conclave represents eternal light. Their angels and paladins are immortal guardians.",
              },
              {
                name: language === "es" ? "Corte de la Sangre" : "Blood Court",
                bonus: "5% " + (language === "es" ? "Regeneración de bajas" : "Casualty regeneration"),
                style:
                  language === "es" ? "Inmunes a moral baja, tropas caras" : "Immune to low morale, expensive troops",
                lore:
                  language === "es"
                    ? "Los vampiros de la Corte han gobernado desde las sombras durante milenios. Su sed insaciable y su inmortalidad los convierten en una amenaza eterna."
                    : "The vampires of the Court have ruled from the shadows for millennia. Their insatiable thirst and immortality make them an eternal threat.",
              },
              {
                name: language === "es" ? "Hordas de la Destrucción" : "Hordes of Destruction",
                bonus: "+20% " + (language === "es" ? "Producción de comida" : "Food production"),
                style: language === "es" ? "Reclutamiento -15% más barato" : "Recruitment -15% cheaper",
                lore:
                  language === "es"
                    ? "Nacidas del salvajismo primitivo, las Hordas arrasan todo a su paso. Los orcos y goblins compensan su falta de estrategia con números abrumadores."
                    : "Born from primitive savagery, the Hordes devastate everything in their path. Orcs and goblins compensate for their lack of strategy with overwhelming numbers.",
              },
              {
                name: language === "es" ? "Reinos de Ultratumba" : "Realms of the Afterlife",
                bonus: (language === "es" ? "Consumo Cero de comida" : "Zero food consumption") + " (solo Oro)",
                style: language === "es" ? "Inmunes a terreno baldío" : "Immune to wasteland",
                lore:
                  language === "es"
                    ? "La muerte no es el final. Sus nigromantes han dominado el arte de reanimar a los caídos, creando ejércitos eternos que no conocen el cansancio."
                    : "Death is not the end. Their necromancers have mastered the art of reanimating the fallen, creating eternal armies that know no fatigue.",
              },
              {
                name: language === "es" ? "Guardianes de la Escama" : "Scale Guardians",
                bonus: "+10% " + (language === "es" ? "Producción de Oro (Minas)" : "Gold production (Mines)"),
                style: language === "es" ? "Reducción 10% daño físico" : "10% physical damage reduction",
                lore:
                  language === "es"
                    ? "Descendientes de los Dragones Antiguos, combinan inteligencia milenaria con poder devastador. Sus tesoros legendarios financian imperios enteros."
                    : "Descendants of the Ancient Dragons, they combine millennial intelligence with devastating power. Their legendary treasures finance entire empires.",
              },
              {
                name: language === "es" ? "Altos Magos de Asuryan" : "High Mages of Asuryan",
                bonus: "+25% " + (language === "es" ? "Generación de Maná" : "Mana generation"),
                style: language === "es" ? "Mayor probabilidad de éxito en hechizos" : "Higher spell success rate",
                lore:
                  language === "es"
                    ? "Los elfos de Asuryan han perfeccionado las artes arcanas durante eones. Su dominio del maná es inigualable, canalizando las corrientes mágicas del mundo."
                    : "The elves of Asuryan have perfected the arcane arts for eons. Their mastery of mana is unmatched, channeling the world's magical currents.",
              },
              {
                name: language === "es" ? "Ingenios de Hierro" : "Iron Contraptions",
                bonus: "-15% " + (language === "es" ? "Coste de Oro en edificios" : "Gold cost in buildings"),
                style: language === "es" ? "Murallas +20% más efectivas" : "Walls +20% more effective",
                lore:
                  language === "es"
                    ? "Los enanos de las montañas son maestros ingenieros. Sus fortalezas son inexpugnables. Lo que les falta en magia lo compensan con tecnología."
                    : "The dwarves of the mountains are master engineers. Their fortresses are impregnable. What they lack in magic they compensate with technology.",
              },
            ],
          },
          {
            id: "clases",
            title: language === "es" ? "Las 5 Clases Especializadas" : "The 5 Specialized Classes",
            content:
              language === "es"
                ? "El camino del poder se manifiesta de cinco formas. Elige tu especialización con sabiduría, pues definirá tu rol en el gran tablero estratégico."
                : "The path of power manifests in five ways. Choose your specialization wisely, as it will define your role on the great strategic board.",
            classes: [
              {
                name: language === "es" ? "Guerrero" : "Warrior",
                bonus: "+15% " + (language === "es" ? "Ataque" : "Attack"),
                desc:
                  language === "es"
                    ? "Combatiente feroz especializado en daño físico directo."
                    : "Fierce combatant specialized in direct physical damage.",
              },
              {
                name: language === "es" ? "Mago" : "Mage",
                bonus: "+25% " + (language === "es" ? "Maná" : "Mana"),
                desc:
                  language === "es"
                    ? "Maestro arcano con vasto poder mágico y conocimiento de hechizos."
                    : "Arcane master with vast magical power and spell knowledge.",
              },
              {
                name: language === "es" ? "Cazador" : "Hunter",
                bonus: "+20% " + (language === "es" ? "Exploración" : "Exploration"),
                desc:
                  language === "es"
                    ? "Experto en rastreo y expansión territorial rápida."
                    : "Expert in tracking and rapid territorial expansion.",
              },
              {
                name: language === "es" ? "Pícaro" : "Rogue",
                bonus: "+30% " + (language === "es" ? "Espionaje" : "Espionage"),
                desc:
                  language === "es"
                    ? "Maestro del sigilo, infiltración y sabotaje de enemigos."
                    : "Master of stealth, infiltration and enemy sabotage.",
              },
              {
                name: language === "es" ? "Paladín" : "Paladin",
                bonus: "+20% " + (language === "es" ? "Defensa" : "Defense"),
                desc:
                  language === "es"
                    ? "Guardián sagrado con resistencia superior y protección divina."
                    : "Sacred guardian with superior resistance and divine protection.",
              },
            ],
          },
          {
            id: "alineamientos",
            title: language === "es" ? "Los 3 Alineamientos Morales" : "The 3 Moral Alignments",
            content:
              language === "es"
                ? "La moral de tu imperio define su destino y su interacción con las fuerzas del cosmos. Cada camino ofrece poder único y consecuencias eternas."
                : "Your empire's morality defines its destiny and its interaction with cosmic forces. Each path offers unique power and eternal consequences.",
            alignments: [
              {
                name: language === "es" ? "Luz" : "Light",
                bonus: "+10% " + (language === "es" ? "Crecimiento de Población" : "Population growth"),
                path:
                  language === "es" ? "Camino de la pureza y el orden celestial" : "Path of purity and celestial order",
              },
              {
                name: language === "es" ? "Oscuridad" : "Darkness",
                bonus: "+10% " + (language === "es" ? "Ataque" : "Attack"),
                path:
                  language === "es"
                    ? "Camino del caos y la destrucción absoluta"
                    : "Path of chaos and absolute destruction",
              },
              {
                name: language === "es" ? "Neutral" : "Neutral",
                bonus: "-10% " + (language === "es" ? "Coste de Turnos" : "Turn cost"),
                path: language === "es" ? "Camino del equilibrio y la pragmática" : "Path of balance and pragmatism",
              },
            ],
          },
        ],
      },
      {
        id: "economia" as TomeId,
        title: language === "es" ? "Tomo III: Tratado de Prosperidad" : "Tome III: Treaty of Prosperity",
        subtitle: language === "es" ? "Economía y Tierras" : "Economy and Lands",
        icon: Coins,
        color: "text-amber-400",
        bgColor: "from-amber-900/20 to-yellow-900/20",
        sections: [
          {
            id: "produccion",
            title: language === "es" ? "Producción y Mantenimiento" : "Production and Maintenance",
            content:
              language === "es"
                ? "Cada edificio produce recursos cada hora, pero cada tropa consume comida y oro constantemente. El equilibrio entre ingresos y gastos define si tu imperio florece o colapsa en la bancarrota y el hambre."
                : "Each building produces resources every hour, but each troop constantly consumes food and gold. The balance between income and expenses defines whether your empire flourishes or collapses into bankruptcy and starvation.",
            formula: {
              title: language === "es" ? "Balance Económico por Hora" : "Hourly Economic Balance",
              content:
                "Oro/h = (Minas × 500) - (Tropas × Coste_Mantenimiento) | Comida/h = (Fanjas × 50) - (Tropas × Consumo_Comida)",
              note:
                language === "es"
                  ? "CRÍTICO: Si tu balance es negativo, tus tropas automáticamente desertan o mueren de hambre. Mantén siempre un superávit del 20%."
                  : "CRITICAL: If your balance is negative, your troops automatically desert or starve. Always maintain a 20% surplus.",
            },
          },
          {
            id: "exploracion",
            title: language === "es" ? "Exploración y Expansión Territorial" : "Exploration and Territorial Expansion",
            content:
              language === "es"
                ? "Cada acre de tierra puede albergar un edificio. Explorar expande tu provincia automáticamente usando el 20% de tus tropas como fuerza de exploración. A mayor tamaño, menor eficiencia. Eventualmente debes conquistar por la fuerza."
                : "Each acre of land can house one building. Exploring expands your province automatically using 20% of your troops as exploration force. The larger the size, the lower the efficiency. Eventually you must conquer by force.",
            formula: {
              title: language === "es" ? "Fórmula de Exploración" : "Exploration Formula",
              content: "Tierra_Nueva = [(Tropas_Auto × 500) / Tierra_Actual] × Turnos_Invertidos",
              note:
                language === "es"
                  ? "Tropas_Auto = 20% de tu tierra actual. Estas tropas quedan fuera de combate durante la exploración. Planifica con cuidado."
                  : "Auto_Troops = 20% of your current land. These troops are out of combat during exploration. Plan carefully.",
            },
          },
          {
            id: "mercado-global",
            title: language === "es" ? "El Mercado Global (P2P)" : "The Global Market (P2P)",
            content:
              language === "es"
                ? "Sistema de comercio peer-to-peer donde los jugadores publican ofertas de recursos (Oro, Comida, Maná) a cambio de otros. El sistema cobra un impuesto del 5% automático para prevenir transferencias masivas entre cuentas del mismo dueño."
                : "Peer-to-peer trading system where players post resource offers (Gold, Food, Mana) in exchange for others. The system automatically charges a 5% tax to prevent massive transfers between accounts of the same owner.",
            formula: {
              title: language === "es" ? "Impuesto de Comercio" : "Trade Tax",
              content: "Recurso_Recibido = Cantidad_Vendida × 0.95 (el 5% se pierde como tarifa)",
              note:
                language === "es"
                  ? "Publicar o aceptar una oferta consume 1 Turno (representa el tiempo de transporte y negociación entre provincias)."
                  : "Publishing or accepting an offer consumes 1 Turn (represents transport and negotiation time between provinces).",
            },
          },
        ],
      },
      {
        id: "construccion" as TomeId,
        title: language === "es" ? "Tomo IV: Arquitectura y Ingeniería" : "Tome IV: Architecture and Engineering",
        subtitle: language === "es" ? "Construcción y Demolición" : "Construction and Demolition",
        icon: Building,
        color: "text-teal-400",
        bgColor: "from-teal-900/20 to-cyan-900/20",
        sections: [
          {
            id: "construccion-turnos",
            title: language === "es" ? "Sistema de Construcción por Turnos" : "Turn-Based Construction System",
            content:
              language === "es"
                ? "En MageLord no compras edificios instantáneamente. Asignas 'mano de obra' (turnos) durante un tiempo determinado. Cada turno invertido construye una cantidad de edificios basada en tu población y tecnología."
                : "In MageLord you don't buy buildings instantly. You assign 'labor' (turns) for a determined time. Each turn invested builds a number of buildings based on your population and technology.",
            formula: {
              title: language === "es" ? "Capacidad de Construcción" : "Construction Capacity",
              content: "Edificios_por_Turno = [(Población × 0.05) / 10] + (Nivel_Tecnología × 2)",
              note:
                language === "es"
                  ? "A mayor población y nivel tecnológico (rama Arquitectura), más edificios puedes levantar por cada turno invertido."
                  : "The higher the population and technology level (Architecture branch), the more buildings you can raise per turn invested.",
            },
          },
          {
            id: "tipos-edificios",
            title: language === "es" ? "Tipos de Edificios" : "Building Types",
            content:
              language === "es"
                ? "Granjas (producen comida), Minas (producen oro), Torres de Magia (generan maná), Fuertes (bonus defensivo), Barracones (reclutan tropas más rápido)."
                : "Farms (produce food), Mines (produce gold), Magic Towers (generate mana), Forts (defensive bonus), Barracks (recruit troops faster).",
            formula: {
              title: language === "es" ? "Coste de Construcción" : "Construction Cost",
              content: "Oro_Total = Coste_Base_Edificio × Cantidad × (1 - Bonus_Facción)",
              note:
                language === "es"
                  ? "Algunas facciones como Ingenios de Hierro tienen -15% coste de oro en todos los edificios."
                  : "Some factions like Iron Contraptions have -15% gold cost on all buildings.",
            },
          },
          {
            id: "demolicion",
            title: language === "es" ? "Sistema de Demolición Estratégica" : "Strategic Demolition System",
            content:
              language === "es"
                ? "La demolición permite reconfigurar tu estrategia eliminando edificios obsoletos. Al principio necesitas muchas Granjas, pero en el late game prefieres Fuertes o Torres. Demoler cuesta 1 turno por edificio y NO recuperas oro."
                : "Demolition allows you to reconfigure your strategy by removing obsolete buildings. At first you need many Farms, but in late game you prefer Forts or Towers. Demolishing costs 1 turn per building and you do NOT recover gold.",
            formula: {
              title: language === "es" ? "Coste de Demolición" : "Demolition Cost",
              content: "1 Turno por edificio demolido | Recuperación: 0 Oro",
              note:
                language === "es"
                  ? "El acre de tierra vuelve al estado 'Libre' permitiendo construir una estructura diferente. La demolición es una decisión de espacio estratégico, no económico."
                  : "The land acre returns to 'Free' state allowing construction of a different structure. Demolition is a strategic space decision, not economic.",
            },
          },
        ],
      },
      {
        id: "militar" as TomeId,
        title: language === "es" ? "Tomo V: Ciencia de la Guerra" : "Tome V: Science of War",
        subtitle: language === "es" ? "Sistema Militar y Entrenamiento" : "Military System and Training",
        icon: Swords,
        color: "text-red-400",
        bgColor: "from-red-900/20 to-orange-900/20",
        sections: [
          {
            id: "tiers",
            title: language === "es" ? "Tiers de Tropas (T1-T4)" : "Troop Tiers (T1-T4)",
            content:
              language === "es"
                ? "Hay 4 niveles de tropas. Tier 1 son reclutas baratos y débiles. Tier 4 son élites devastadoras pero carísimas. Cada tier superior multiplica el poder por 3× pero también triplica el coste."
                : "There are 4 troop levels. Tier 1 are cheap weak recruits. Tier 4 are devastating elites but extremely expensive. Each higher tier multiplies power by 3× but also triples the cost.",
            formula: {
              title: language === "es" ? "Progresión de Tiers" : "Tier Progression",
              content: "Poder_Tier(N) = Poder_Base × 3^(N-1) | Coste_Tier(N) = Coste_Base × 3^(N-1)",
              note:
                language === "es"
                  ? "Un ejército mixto balanceado (60% T1, 30% T2, 10% T3-T4) suele ser más eficiente que solo T4."
                  : "A balanced mixed army (60% T1, 30% T2, 10% T3-T4) is usually more efficient than only T4.",
            },
          },
          {
            id: "entrenamiento",
            title: language === "es" ? "Sistema de Entrenamiento por Turnos" : "Turn-Based Training System",
            content:
              language === "es"
                ? "El entrenamiento NO es instantáneo. Inviertes turnos y cada turno entrena una cantidad de tropas basada en tu cantidad de Barracones y bonos de facción."
                : "Training is NOT instant. You invest turns and each turn trains a number of troops based on your Barracks count and faction bonuses.",
            formula: {
              title: language === "es" ? "Capacidad de Reclutamiento" : "Recruitment Capacity",
              content: "Tropas_por_Turno = Barracones × Multiplicador_Tier × (1 + Bonus_Facción)",
              note:
                language === "es"
                  ? "Hordas de la Destrucción tienen -15% coste de reclutamiento. Los gremios con sinergia obtienen +10% velocidad."
                  : "Hordes of Destruction have -15% recruitment cost. Guilds with synergy get +10% speed.",
            },
          },
          {
            id: "mantenimiento",
            title: language === "es" ? "Mantenimiento de Ejércitos" : "Army Maintenance",
            content:
              language === "es"
                ? "Cada tropa consume comida y oro cada hora. Un ejército masivo puede arruinarte si no tienes la economía para sostenerlo. Las tropas sin comida desertan automáticamente al 10% por hora."
                : "Each troop consumes food and gold every hour. A massive army can bankrupt you if you don't have the economy to sustain it. Troops without food automatically desert at 10% per hour.",
            formula: {
              title: language === "es" ? "Coste de Mantenimiento Total" : "Total Maintenance Cost",
              content: "Mantenimiento/h = Σ(Tropas_Tier × Coste_Mantenimiento_Tier)",
              note:
                language === "es"
                  ? "Reinos de Ultratumba NO pagan mantenimiento de comida (sus tropas están muertas), solo oro."
                  : "Realms of the Afterlife do NOT pay food maintenance (their troops are dead), only gold.",
            },
          },
        ],
      },
      {
        id: "guerra" as TomeId,
        title: language === "es" ? "Tomo VI: El Arte de la Conquista" : "Tome VI: The Art of Conquest",
        subtitle: language === "es" ? "Combate y Estrategia" : "Combat and Strategy",
        icon: Crown,
        color: "text-orange-400",
        bgColor: "from-orange-900/20 to-red-900/20",
        sections: [
          {
            id: "rangos-ataque",
            title: language === "es" ? "Rangos de Ataque Válidos" : "Valid Attack Ranges",
            content:
              language === "es"
                ? "Solo puedes atacar a jugadores dentro del 80%-120% de tu Networth. Esto previene que imperios gigantes aplasten provincias pequeñas sin defensa. EXCEPCIÓN CRÍTICA: Las represalias rompen todas las reglas de rango durante 48 horas."
                : "You can only attack players within 80%-120% of your Networth. This prevents giant empires from crushing small defenseless provinces. CRITICAL EXCEPTION: Retaliations break all range rules for 48 hours.",
            formula: {
              title: language === "es" ? "Rango Válido" : "Valid Range",
              content: "0.8 × Tu_Networth ≤ Objetivo_Networth ≤ 1.2 × Tu_Networth",
              note:
                language === "es"
                  ? "Si alguien te ataca, puedes vengarte sin restricciones durante 48h. Esto evita que los grandes escondan sus recursos en cuentas pequeñas."
                  : "If someone attacks you, you can retaliate without restrictions for 48h. This prevents large players from hiding resources in small accounts.",
            },
          },
          {
            id: "tipos-ataque",
            title: language === "es" ? "Tres Tipos de Invasión" : "Three Invasion Types",
            content:
              language === "es"
                ? "SAQUEO: Robas hasta el 15% del oro enemigo. INVASIÓN: Conquistas hasta el 10% de su tierra. ASEDIO: Destruyes hasta el 5% de sus edificios. Cada tipo requiere diferentes composiciones de tropas."
                : "PILLAGE: Steal up to 15% of enemy gold. INVASION: Conquer up to 10% of their land. SIEGE: Destroy up to 5% of their buildings. Each type requires different troop compositions.",
            formula: {
              title: language === "es" ? "Botín Máximo" : "Maximum Loot",
              content: "Saqueo: Oro × 0.15 | Invasión: Acres × 0.10 | Asedio: Edificios × 0.05",
              note:
                language === "es"
                  ? "El botín real depende de la victoria. Una victoria parcial (50-70%) reduce el botín proporcionalmente."
                  : "Actual loot depends on victory. A partial victory (50-70%) reduces loot proportionally.",
            },
          },
          {
            id: "represalias",
            title: language === "es" ? "Sistema de Represalias (Retaliation)" : "Retaliation System",
            content:
              language === "es"
                ? "Si alguien te ataca, se abre una 'ventana de venganza' de 48 horas. Durante este tiempo puedes contraatacar ignorando completamente las reglas de rango de Networth. El sistema marca estos enemigos en ROJO PARPADEANTE en tu historial."
                : "If someone attacks you, a 48-hour 'revenge window' opens. During this time you can counter-attack completely ignoring Networth range rules. The system marks these enemies in BLINKING RED in your history.",
            formula: {
              title: language === "es" ? "Ventana de Represalia" : "Retaliation Window",
              content: "48 horas desde el primer ataque recibido | Sin restricción de rango",
              note:
                language === "es"
                  ? "Las represalias son sagradas en MageLord. Los jugadores que no venga sus derrotas son considerados débiles. El honor exige venganza."
                  : "Retaliations are sacred in MageLord. Players who don't avenge their defeats are considered weak. Honor demands vengeance.",
            },
          },
          {
            id: "proteccion-combate",
            title: language === "es" ? "Protecciones Anti-Farming" : "Anti-Farming Protections",
            content:
              language === "es"
                ? "Si alguien te ataca 3+ veces en 24 horas, entras en 'Protección por Acoso' durante 12 horas. Nadie puede atacarte excepto tú. Esto previene que jugadores grandes te 'farmeen' infinitamente."
                : "If someone attacks you 3+ times in 24 hours, you enter 'Harassment Protection' for 12 hours. No one can attack you except you. This prevents large players from 'farming' you infinitely.",
            formula: {
              title: language === "es" ? "Activación de Protección" : "Protection Activation",
              content: "3 ataques del mismo jugador en 24h → 12h de inmunidad",
              note:
                language === "es"
                  ? "Esta protección NO te impide atacar a otros. Solo previene que seas atacado. Úsala para reconstruir tu economía."
                  : "This protection does NOT prevent you from attacking others. It only prevents you from being attacked. Use it to rebuild your economy.",
            },
          },
        ],
      },
      {
        id: "magia" as TomeId,
        title: language === "es" ? "Tomo VII: Grimorio del Archimago" : "Tome VII: Archmage's Grimoire",
        subtitle: language === "es" ? "Magia, Rituales y Artefactos" : "Magic, Rituals and Artifacts",
        icon: Sparkles,
        color: "text-violet-400",
        bgColor: "from-violet-900/20 to-purple-900/20",
        sections: [
          {
            id: "libro-hechizos",
            title: language === "es" ? "Libro de Hechizos Instantáneos" : "Instant Spellbook",
            content:
              language === "es"
                ? "Los hechizos son acciones instantáneas que consumen Maná. Hay dos categorías: Económicos (aumentan producción temporalmente) y Ofensivos (dañan enemigos o ayudan en combate). La probabilidad de éxito aumenta con tu Nivel de Magia."
                : "Spells are instant actions that consume Mana. There are two categories: Economic (temporarily increase production) and Offensive (damage enemies or help in combat). Success probability increases with your Magic Level.",
            formula: {
              title: language === "es" ? "Probabilidad de Éxito de Hechizos" : "Spell Success Probability",
              content: "P(éxito) = 0.50 + (Tu_Nivel_Magia × 0.03)",
              note:
                language === "es"
                  ? "Un mago nivel 10 tiene 80% de éxito. Los Altos Magos de Asuryan tienen mayor probabilidad base por su afinidad arcana."
                  : "A level 10 mage has 80% success. High Mages of Asuryan have higher base probability due to their arcane affinity.",
            },
          },
          {
            id: "rituales",
            title: language === "es" ? "Rituales de Largo Plazo" : "Long-Term Rituals",
            content:
              language === "es"
                ? "Los rituales son proyectos masivos que requieren invertir múltiples turnos y Maná durante varios días. Al completarse, otorgan efectos devastadores que pueden cambiar el equilibrio de poder del servidor completo. Ejemplos: 'Llamada del Vacío' invoca gratis una unidad Tier 4. 'Eclipsar el Sol' reduce producción de comida de todos los enemigos de alineamiento Luz durante 24 horas."
                : "Rituals are massive projects that require investing multiple turns and Mana over several days. When completed, they grant devastating effects that can change the power balance of the entire server. Examples: 'Void Summoning' summons a Tier 4 unit for free. 'Eclipse the Sun' reduces food production of all Light alignment enemies for 24 hours.",
            formula: {
              title: language === "es" ? "Progreso de Ritual" : "Ritual Progress",
              content: "Progreso% = (Turnos_Invertidos / Turnos_Requeridos) × 100",
              note:
                language === "es"
                  ? "Los rituales son específicos de facción. Legiones Infernales tienen rituales de invocación demoníaca, mientras Celestiales tienen bendiciones divinas."
                  : "Rituals are faction-specific. Infernal Legions have demonic summoning rituals, while Celestials have divine blessings.",
            },
          },
          {
            id: "cooldowns",
            title: language === "es" ? "Cooldowns y Limitaciones" : "Cooldowns and Limitations",
            content:
              language === "es"
                ? "Los hechizos poderosos tienen tiempos de espera obligatorios. Hechizos de Élite (como 'Apocalipsis') tienen cooldown de 24-48h. Acciones de Sabotaje (robo de oro mágico) tienen 1-4h. Habilidades Especiales de unidades (invocación de diablillos del Pit Lord) tienen 6-12h."
                : "Powerful spells have mandatory cooldown times. Elite Spells (like 'Apocalypse') have 24-48h cooldown. Sabotage Actions (magical gold theft) have 1-4h. Unit Special Abilities (Pit Lord's imp summoning) have 6-12h.",
            formula: {
              title: language === "es" ? "Cálculo de Cooldown Restante" : "Remaining Cooldown Calculation",
              content: "Tiempo_Restante = (Timestamp_Ejecución + Duración_CD) - Tiempo_Actual",
              note:
                language === "es"
                  ? "La página de Cooldowns muestra una cuenta regresiva en tiempo real. Cuando llega a cero, recibes una notificación en el Correo Arcano."
                  : "The Cooldowns page shows a real-time countdown. When it reaches zero, you receive a notification in the Arcane Mail.",
            },
          },
          {
            id: "mercado-negro",
            title: language === "es" ? "Artefactos del Mercado Negro" : "Black Market Artifacts",
            content:
              language === "es"
                ? "El Mercado Negro subasta artefactos prohibidos cada 4 horas. Patentes (desbloquean unidades de otras facciones), Grimorios (añaden hechizos cruzados con penalización), Artefactos Mágicos (armas/armaduras con bonus pasivos), Mercenarios (tropas instantáneas sin entrenamiento)."
                : "The Black Market auctions forbidden artifacts every 4 hours. Patents (unlock units from other factions), Grimoires (add cross spells with penalty), Magic Artifacts (weapons/armor with passive bonuses), Mercenaries (instant troops without training).",
            formula: {
              title: language === "es" ? "Penalización de Hechizos Cruzados" : "Cross Spell Penalty",
              content: "Coste_Maná = Coste_Base × 1.5 | P(fallo) = P(fallo_base) + 15%",
              note:
                language === "es"
                  ? "Un hechizo que no pertenece a tu facción cuesta +50% maná y tiene +15% probabilidad de fallo. El poder tiene un precio."
                  : "A spell that doesn't belong to your faction costs +50% mana and has +15% fail chance. Power has a price.",
            },
          },
        ],
      },
      {
        id: "mercado" as TomeId,
        title: language === "es" ? "Tomo VIII: Economía Clandestina" : "Tome VIII: Clandestine Economy",
        subtitle: language === "es" ? "Mercados y Comercio" : "Markets and Trade",
        icon: ShoppingCart,
        color: "text-yellow-400",
        bgColor: "from-yellow-900/20 to-amber-900/20",
        sections: [
          {
            id: "mercado-global",
            title: language === "es" ? "Mercado Global P2P" : "Global P2P Market",
            content:
              language === "es"
                ? "Plataforma de comercio entre jugadores. Publica ofertas vendiendo recursos (Oro/Comida/Maná) a cambio de otros. El sistema cobra automáticamente un impuesto del 5% para prevenir transferencias masivas entre multicuentas. Publicar o aceptar una oferta consume 1 Turno representando el tiempo de caravana y negociación."
                : "Player trading platform. Post offers selling resources (Gold/Food/Mana) in exchange for others. The system automatically charges a 5% tax to prevent massive transfers between multi-accounts. Publishing or accepting an offer consumes 1 Turn representing caravan time and negotiation.",
            formula: {
              title: language === "es" ? "Impuesto Automático" : "Automatic Tax",
              content: "Recurso_Recibido = Cantidad_Vendida × 0.95",
              note:
                language === "es"
                  ? "El vendedor SIEMPRE pierde el 5%. Esto mantiene la economía inflacionaria bajo control y penaliza el abuso."
                  : "The seller ALWAYS loses 5%. This keeps the inflationary economy under control and penalizes abuse.",
            },
          },
          {
            id: "mercado-negro-subastas",
            title: language === "es" ? "Mercado Negro: Subastas en Tiempo Real" : "Black Market: Real-Time Auctions",
            content:
              language === "es"
                ? "El epicentro de la economía clandestina. Cada 4 horas aparece un nuevo lote de ítems prohibidos que dura 2-24 horas. Las pujas deben superar la anterior en mínimo 10%. El oro queda bloqueado hasta que otro te supere. Sistema Anti-Snipe: si alguien puja con menos de 2 minutos restantes, el temporizador se reinicia a 2 minutos automáticamente."
                : "The epicenter of the clandestine economy. Every 4 hours a new lot of forbidden items appears lasting 2-24 hours. Bids must exceed the previous by at least 10%. Gold is locked until another outbids you. Anti-Snipe System: if someone bids with less than 2 minutes remaining, the timer automatically resets to 2 minutes.",
            formula: {
              title: language === "es" ? "Puja Mínima Obligatoria" : "Mandatory Minimum Bid",
              content: "Puja_Mínima = Puja_Actual × 1.10",
              note:
                language === "es"
                  ? "Las guerras de pujas pueden volverse feroces. Los jugadores ricos dominan el Mercado Negro adquiriendo ventajas que el dinero no puede comprar... excepto aquí."
                  : "Bidding wars can become fierce. Rich players dominate the Black Market acquiring advantages that money can't buy... except here.",
            },
          },
        ],
      },
      {
        id: "diplomacia" as TomeId,
        title: language === "es" ? "Tomo IX: El Orden Social" : "Tome IX: The Social Order",
        subtitle: language === "es" ? "Diplomacia y Política" : "Diplomacy and Politics",
        icon: Users,
        color: "text-cyan-400",
        bgColor: "from-cyan-900/20 to-blue-900/20",
        sections: [
          {
            id: "mensajeria",
            title: language === "es" ? "Correo Arcano (Mensajería)" : "Arcane Mail (Messaging)",
            content:
              language === "es"
                ? "Sistema de mensajería formal donde los pactos quedan registrados permanentemente. Tres tipos: Mensajes de Jugador (pactos/amenazas), Sistema (notificaciones automáticas de espías/ataques), Represalia (marcados en ROJO cuando provienen de enemigos en ventana de venganza activa)."
                : "Formal messaging system where pacts are permanently recorded. Three types: Player Messages (pacts/threats), System (automatic notifications of spies/attacks), Retaliation (marked in RED when from enemies in active revenge window).",
            formula: {
              title: language === "es" ? "Tipos de Mensaje" : "Message Types",
              content: "Jugador (📜) | Sistema (⚙️) | Represalia (⚔️ ROJO)",
              note:
                language === "es"
                  ? "Los mensajes de represalia parpadean en rojo agresivo. El sistema te recuerda constantemente quién te atacó para que no olvides vengarte."
                  : "Retaliation messages blink in aggressive red. The system constantly reminds you who attacked you so you don't forget to take revenge.",
            },
          },
          {
            id: "gremios",
            title: language === "es" ? "Gremios: La Unidad Política Básica" : "Guilds: The Basic Political Unit",
            content:
              language === "es"
                ? "Alianza formal de 20-25 jugadores máximo. Jerarquía: Líder (control total: disolver, expulsar, diplomacia), Consejeros (invitar miembros y moderar foro interno), Miembros (acceso a foro, defensa coordinada y bonos). El Networth del gremio es la sumatoria (Σ) de todos sus miembros y define su posición en el ranking mundial."
                : "Formal alliance of 20-25 players maximum. Hierarchy: Leader (total control: dissolve, expel, diplomacy), Counselors (invite members and moderate internal forum), Members (forum access, coordinated defense and bonuses). Guild Networth is the sum (Σ) of all its members and defines its world ranking position.",
            formula: {
              title: language === "es" ? "Poder del Gremio" : "Guild Power",
              content: "NW_Gremio = Σ NW_Miembros",
              note:
                language === "es"
                  ? "Si el 70% de los miembros son de la misma facción, el gremio recibe un bono de sinergia (+10% velocidad de reclutamiento de T1)."
                  : "If 70% of members are from the same faction, the guild receives a synergy bonus (+10% T1 recruitment speed).",
            },
          },
          {
            id: "pactos",
            title: language === "es" ? "Pactos de No Agresión (PNA)" : "Non-Aggression Pacts (NAP)",
            content:
              language === "es"
                ? "Los gremios pueden firmar tratados que impiden ataques entre sus miembros automáticamente. El sistema bloquea los ataques de aliados. PENALIZACIÓN POR RUPTURA: Si rompes un pacto antes de su expiración, recibes el debuff 'Deshonor' que reduce tu producción de oro en 20% durante 24 horas. Esta marca queda registrada permanentemente en tu historial diplomático."
                : "Guilds can sign treaties that automatically prevent attacks between their members. The system blocks attacks from allies. BREAK PENALTY: If you break a pact before its expiration, you receive the 'Dishonor' debuff that reduces your gold production by 20% for 24 hours. This mark is permanently recorded in your diplomatic history.",
            formula: {
              title: language === "es" ? "Penalización por Traición" : "Betrayal Penalty",
              content: "Producción_Oro × 0.80 durante 24 horas | Registro permanente",
              note:
                language === "es"
                  ? "Los traidores son marcados. Otros gremios pueden ver tu historial de pactos rotos antes de aliarse contigo. La reputación lo es todo."
                  : "Traitors are marked. Other guilds can see your history of broken pacts before allying with you. Reputation is everything.",
            },
          },
          {
            id: "rankings",
            title: language === "es" ? "El Panteón: Rankings Globales" : "The Pantheon: Global Rankings",
            content:
              language === "es"
                ? "Cinco rankings principales: Poder General (Networth total), Poder Militar (solo tropas), Territorial (acres totales), Tesorería (oro acumulado), Gremios (NW acumulado del gremio). Los Top 3 de cada categoría reciben coronas de Oro/Plata/Bronce. Filtro inteligente 'Objetivos Disponibles' muestra solo jugadores en tu rango de ataque (80-120% de tu NW)."
                : "Five main rankings: General Power (Networth total), Military Power (troops only), Territorial (total acres), Treasury (accumulated gold), Guilds (accumulated guild NW). Top 3 of each category receive Gold/Silver/Bronze crowns. Intelligent filter 'Available Targets' shows only players in your attack range (80-120% of your NW).",
            formula: {
              title: language === "es" ? "Posición en Ranking" : "Ranking Position",
              content: "Ordenado por métrica específica (NW, Tropas, Acres, Oro, NW_Gremio)",
              note:
                language === "es"
                  ? "Tu posición en el Panteón define tu prestigio. Los Top 10 son leyendas vivientes. Los Top 3 son dioses entre mortales."
                  : "Your position in the Pantheon defines your prestige. Top 10 are living legends. Top 3 are gods among mortals.",
            },
          },
        ],
      },
      {
        id: "reglas" as TomeId,
        title: language === "es" ? "Tomo X: Códice de Conducta" : "Tome X: Code of Conduct",
        subtitle: language === "es" ? "Reglas y Soporte" : "Rules and Support",
        icon: Shield,
        color: "text-gray-400",
        bgColor: "from-gray-900/20 to-slate-900/20",
        sections: [
          {
            id: "codigo-honor",
            title: language === "es" ? "Código de Honor del Archimago" : "Archmage Code of Honor",
            content:
              language === "es"
                ? "Bienvenido al Código de Honor de MageLord. Estas leyes no son simples sugerencias; son el tejido mismo que mantiene unido este reino arcano. Cada norma ha sido forjada por la experiencia de las eras pasadas y protege la integridad del juego para todos."
                : "Welcome to MageLord's Code of Honor. These laws are not mere suggestions; they are the very fabric that holds this arcane realm together. Each rule has been forged by the experience of past eras and protects the integrity of the game for all.",
          },
          {
            id: "conducta-respeto",
            title: language === "es" ? "I. Conducta y Respeto" : "I. Conduct and Respect",
            content:
              language === "es"
                ? "La rivalidad debe ser técnica, no personal. El Reino de MageLord se construye sobre competencia justa y respeto mutuo."
                : "Rivalry must be technical, not personal. The Kingdom of MageLord is built on fair competition and mutual respect.",
            formula: {
              title: language === "es" ? "Normas de Convivencia" : "Community Standards",
              content:
                language === "es"
                  ? "• Lenguaje Apropiado: Prohibido insultos, lenguaje despectivo o discurso de odio en Foro y Mensajería\n• Identidad Apropiada: Nombres de provincias y gremios no deben ser ofensivos ni suplantar administradores\n• Privacidad: Prohibido difundir datos personales (doxing) obtenidos fuera del juego\n• Anti-Spam: No saturar canales con mensajes repetitivos o publicidad\n• Acoso: El ataque militar es parte del juego, pero el acoso verbal constante será sancionado"
                  : "• Appropriate Language: Insults, derogatory language or hate speech prohibited in Forum and Messaging\n• Appropriate Identity: Province and guild names must not be offensive or impersonate administrators\n• Privacy: Sharing personal data (doxing) obtained outside the game is prohibited\n• Anti-Spam: Do not saturate channels with repetitive messages or advertising\n• Harassment: Military attack is part of the game, but constant verbal harassment will be sanctioned",
              note:
                language === "es"
                  ? "La guerra es estrategia, no odio. Respeta a tu rival<bos>incluso en la victoria."
                  : "War is strategy, not hate. Respect your rival even in victory.",
            },
          },
          {
            id: "integridad-juego",
            title: language === "es" ? "II. Integridad del Juego (Fair Play)" : "II. Game Integrity (Fair Play)",
            content:
              language === "es"
                ? "La trampa no solo arruina tu experiencia; destruye el equilibrio del servidor entero. Estas prohibiciones son absolutas y su violación conlleva baneo inmediato."
                : "Cheating doesn't just ruin your experience; it destroys the balance of the entire server. These prohibitions are absolute and their violation leads to immediate ban.",
            formula: {
              title: language === "es" ? "Prohibiciones Absolutas" : "Absolute Prohibitions",
              content:
                language === "es"
                  ? "• Multicuenta: Un jugador = Una cuenta. El 'pushing' entre cuentas propias es baneo permanente\n• Scripts y Bots: Prohibido automatizar turnos, ataques o compras. Solo interfaz oficial\n• Explotación de Bugs: Reportar errores en fórmulas es obligatorio. Explotarlos es trampa\n• RMT (Real Money Trading): Venta de recursos, cuentas u objetos por dinero real está prohibida\n• Colusión Masiva: Pactos entre gremios para monopolizar el ranking pueden ser disueltos por administración"
                  : "• Multi-accounting: One player = One account. 'Pushing' between own accounts is permanent ban\n• Scripts and Bots: Automating turns, attacks or purchases prohibited. Only official interface\n• Bug Exploitation: Reporting formula errors is mandatory. Exploiting them is cheating\n• RMT (Real Money Trading): Selling resources, accounts or objects for real money is prohibited\n• Mass Collusion: Pacts between guilds to monopolize ranking can be dissolved by administration",
              note:
                language === "es"
                  ? "El juego limpio es la única forma de juego. No hay excepciones."
                  : "Fair play is the only way to play. There are no exceptions.",
            },
          },
          {
            id: "diplomacia-guerra",
            title: language === "es" ? "III. Diplomacia y Guerra" : "III. Diplomacy and War",
            content:
              language === "es"
                ? "Las reglas del combate y los tratados mantienen el equilibrio entre el caos y el orden. Romper un pacto tiene consecuencias reales."
                : "Combat rules and treaties maintain the balance between chaos and order. Breaking a pact has real consequences.",
            formula: {
              title: language === "es" ? "Reglas del Conflicto" : "Conflict Rules",
              content:
                language === "es"
                  ? "• Ruptura de PNA: Romper un Pacto de No Agresión antes de su vencimiento = Penalización de reputación y pérdida de turnos\n• Ataques Fuera de Rango: Manipular Networth mediante despido masivo para atacar débiles es antideportivo\n• Cuentas Sacrificio: Prohibido crear cuentas solo para lanzar maldiciones sin riesgo\n• Abuso de Protección: No entrar/salir repetidamente de Modo Vacaciones para comerciar sin riesgo\n• Despido Estratégico (NW Suicide): Despedir el 90% de tropas antes de un ataque para quedar fuera de rango es manipulación"
                  : "• PNA Breach: Breaking a Non-Aggression Pact before expiration = Reputation penalty and turn loss\n• Out of Range Attacks: Manipulating Networth through mass dismissal to attack weak players is unsportsmanlike\n• Sacrifice Accounts: Creating accounts solely to cast curses without risk is prohibited\n• Protection Abuse: Not entering/exiting Vacation Mode repeatedly to trade risk-free\n• Strategic Dismissal (NW Suicide): Dismissing 90% of troops before an attack to be out of range is manipulation",
              note:
                language === "es"
                  ? "La guerra tiene reglas. Quien las rompe, pierde honor y protección."
                  : "War has rules. Those who break them lose honor and protection.",
            },
          },
          {
            id: "economia-mercado",
            title: language === "es" ? "IV. Economía y Mercado" : "IV. Economy and Market",
            content:
              language === "es"
                ? "El mercado es el corazón económico del reino. Su manipulación destruye el equilibrio de recursos para todos los jugadores."
                : "The market is the economic heart of the realm. Its manipulation destroys resource balance for all players.",
            formula: {
              title: language === "es" ? "Transparencia Financiera" : "Financial Transparency",
              content:
                language === "es"
                  ? "• Manipulación de Precios: Prohibido coordinar inflación/deflación artificial de recursos\n• Money Laundering: No usar el Mercado para transferir oro a cuentas amigas mediante compras ficticias\n• Préstamos No Registrados: Trasvases entre miembros de gremio deben pasar por canales oficiales\n• Abuso de Puja Mínima: Scripts para pujar 10% mínimo en último segundo de forma sistemática están prohibidos\n• Acaparamiento: Poseer más del 50% de artefactos únicos mediante multicuentas = confiscación\n• Extorsión Comercial: Amenazar a jugadores para que solo vendan a un gremio específico está prohibido"
                  : "• Price Manipulation: Coordinating artificial inflation/deflation of resources is prohibited\n• Money Laundering: Not using the Market to transfer gold to friendly accounts through fictitious purchases\n• Unregistered Loans: Transfers between guild members must go through official channels\n• Minimum Bid Abuse: Scripts to bid minimum 10% in last second systematically are prohibited\n• Hoarding: Possessing more than 50% of unique artifacts through multi-accounts = confiscation\n• Commercial Extortion: Threatening players to sell only to a specific guild is prohibited",
              note:
                language === "es"
                  ? "El mercado libre funciona solo si hay reglas claras. El abuso será castigado."
                  : "The free market only works if there are clear rules. Abuse will be punished.",
            },
          },
          {
            id: "espionaje-sabotaje",
            title: language === "es" ? "V. Espionaje y Sabotaje" : "V. Espionage and Sabotage",
            content:
              language === "es"
                ? "El espionaje es una táctica lícita del juego. Sin embargo, cruzar la línea hacia el acoso real es inaceptable."
                : "Espionage is a legitimate game tactic. However, crossing the line into real harassment is unacceptable.",
            formula: {
              title: language === "es" ? "Límites de la Guerra Fría" : "Cold War Limits",
              content:
                language === "es"
                  ? "• Infiltración: Entrar en gremios enemigos como espía es lícito, pero usar multicuenta para esto está prohibido\n• Falsificación de Informes: Editar capturas de batalla/espionaje para engañar está prohibido\n• Sabotaje Coordinado: 20 jugadores usando hechizos destructivos contra 1 solo sin intención de conquista es acoso\n• Fake Attacks: Enviar ataques con 1 unidad solo para saturar notificaciones está prohibido\n• Revelación de PMs: Difundir mensajes privados en el Foro sin consentimiento para humillar será sancionado"
                  : "• Infiltration: Entering enemy guilds as a spy is legitimate, but using multi-accounts for this is prohibited\n• Report Forgery: Editing battle/espionage screenshots to deceive is prohibited\n• Coordinated Sabotage: 20 players using destructive spells against 1 without conquest intent is harassment\n• Fake Attacks: Sending attacks with 1 unit just to saturate notifications is prohibited\n• PM Disclosure: Spreading private messages on the Forum without consent to humiliate will be sanctioned",
              note:
                language === "es"
                  ? "Espionaje sí. Acoso no. Hay una línea clara entre estrategia y toxicidad."
                  : "Espionage yes. Harassment no. There's a clear line between strategy and toxicity.",
            },
          },
          {
            id: "comunidad-foros",
            title: language === "es" ? "VI. Comunidad y Foros" : "VI. Community and Forums",
            content:
              language === "es"
                ? "El Foro de la Taberna es el lugar de encuentro de todos los Archimagos. Mantener un ambiente constructivo es responsabilidad de todos."
                : "The Tavern Forum is the meeting place for all Archmages. Maintaining a constructive environment is everyone's responsibility.",
            formula: {
              title: language === "es" ? "Códice Social" : "Social Codex",
              content:
                language === "es"
                  ? "• Publicidad No Autorizada: Promocionar otros juegos sin permiso está prohibido\n• Críticas Constructivas: Las críticas al juego son bienvenidas si son respetuosas. El insulto al staff será sancionado\n• Incitación al Abandono: Campañas activas para que jugadores dejen el juego están prohibidas\n• Revelación de Secretos: Difundir Easter Eggs o mecánicas ocultas prematuramente puede ser moderado\n• Firmas Ofensivas: Imágenes/textos en perfil deben seguir estética del juego sin contenido explícito"
                  : "• Unauthorized Advertising: Promoting other games without permission is prohibited\n• Constructive Criticism: Game criticism is welcome if respectful. Staff insults will be sanctioned\n• Abandonment Incitement: Active campaigns for players to leave the game are prohibited\n• Secret Revelation: Prematurely spreading Easter Eggs or hidden mechanics may be moderated\n• Offensive Signatures: Images/texts in profile must follow game aesthetics without explicit content",
              note:
                language === "es"
                  ? "La comunidad es el alma del juego. Trátala con respeto."
                  : "The community is the soul of the game. Treat it with respect.",
            },
          },
          {
            id: "seguridad-tecnica",
            title: language === "es" ? "VII. Seguridad Técnica" : "VII. Technical Security",
            content:
              language === "es"
                ? "La seguridad del reino depende de la integridad técnica del sistema. Los ataques al servidor son ataques a todos los jugadores."
                : "The security of the realm depends on the technical integrity of the system. Attacks on the server are attacks on all players.",
            formula: {
              title: language === "es" ? "Protección del Sistema" : "System Protection",
              content:
                language === "es"
                  ? "• Suplantación de Staff: Hacerse pasar por moderador/admin = Expulsión permanente\n• Ingeniería Inversa: Acceder al código fuente o realizar DDoS está prohibido\n• Reportes Falsos: Uso malintencionado del sistema de reportes para hostigar será penalizado\n• Inyección de Código: Intentar insertar scripts en campos de texto (XSS) = Baneo por IP\n• Uso de Proxies/VPNs: Ocultar identidad para saltarse baneos está prohibido\n• Cooldown Bypass: Manipular reloj del navegador para saltarse tiempos de espera será detectado"
                  : "• Staff Impersonation: Impersonating moderator/admin = Permanent expulsion\n• Reverse Engineering: Accessing source code or performing DDoS is prohibited\n• False Reports: Malicious use of report system to harass will be penalized\n• Code Injection: Attempting to insert scripts in text fields (XSS) = IP ban\n• Proxy/VPN Use: Hiding identity to bypass bans is prohibited\n• Cooldown Bypass: Manipulating browser clock to skip wait times will be detected",
              note:
                language === "es"
                  ? "La seguridad técnica no es negociable. Protegemos al reino de todos los jugadores."
                  : "Technical security is non-negotiable. We protect the realm of all players.",
            },
          },
          {
            id: "sanciones",
            title: language === "es" ? "Sistema de Sanciones" : "Penalty System",
            content:
              language === "es"
                ? "Las leyes sin consecuencias son meras sugerencias. MageLord implementa un sistema de sanciones escalable y automático."
                : "Laws without consequences are mere suggestions. MageLord implements an escalating and automatic penalty system.",
            formula: {
              title: language === "es" ? "Escalabilidad de Castigos" : "Penalty Escalation",
              content:
                language === "es"
                  ? "Nivel 1: Advertencia Arcana\n→ Aviso en perfil privado + Bloqueo de mensajes 24h\n\nNivel 2: Cárcel de Maná\n→ No puede invertir turnos ni atacar durante 48h (pero puede ser atacado)\n\nNivel 3: Exilio Temporal\n→ Suspensión total de cuenta por 7-15 días\n\nNivel 4: Muerte Permanente\n→ Eliminación de provincia + Baneo de IP/Email sin apelación"
                  : "Level 1: Arcane Warning\n→ Private profile notice + 24h message block\n\nLevel 2: Mana Prison\n→ Cannot invest turns or attack for 48h (but can be attacked)\n\nLevel 3: Temporary Exile\n→ Total account suspension for 7-15 days\n\nLevel 4: Permanent Death\n→ Province deletion + IP/Email ban without appeal",
              note:
                language === "es"
                  ? "Las sanciones son automáticas para infracciones claras. Para casos complejos, el Consejo de Administración decide."
                  : "Penalties are automatic for clear violations. For complex cases, the Administration Council decides.",
            },
          },
          {
            id: "etica-final",
            title: language === "es" ? "Ética y Espíritu del Juego" : "Ethics and Game Spirit",
            content:
              language === "es"
                ? "Por encima de la letra pequeña, prevalece el espíritu de competición justa. MageLord no es solo un juego; es una comunidad construida sobre respeto mutuo y pasión por la estrategia."
                : "Above the fine print, the spirit of fair competition prevails. MageLord is not just a game; it's a community built on mutual respect and passion for strategy.",
            formula: {
              title: language === "es" ? "Principios Fundamentales" : "Fundamental Principles",
              content:
                language === "es"
                  ? "• Respeto al Lore: Uso de nombres de eventos sensibles de la vida real no está permitido\n• Responsabilidad del Líder: Los líderes de gremio son responsables de acciones coordinadas de su alianza\n• Cláusula de Sentido Común: Cualquier acción que dañe la experiencia de juego será juzgada aunque no esté escrita aquí\n• Actualización de Leyes: Las reglas se actualizan para cubrir nuevos vacíos legales\n• Espíritu de Fair Play: El desconocimiento de la ley no exime de su cumplimiento"
                  : "• Lore Respect: Using names from sensitive real-life events is not permitted\n• Leader Responsibility: Guild leaders are responsible for coordinated actions of their alliance\n• Common Sense Clause: Any action that damages game experience will be judged even if not written here\n• Law Updates: Rules are updated to cover new legal loopholes\n• Fair Play Spirit: Ignorance of the law does not exempt from compliance",
              note:
                language === "es"
                  ? "MageLord es más que código y reglas. Es una comunidad viva donde cada decisión importa."
                  : "MageLord is more than code and rules. It's a living community where every decision matters.",
            },
          },
          {
            id: "seguridad",
            title: language === "es" ? "Seguridad y Privacidad de Datos" : "Security and Data Privacy",
            content:
              language === "es"
                ? "Tu información está protegida con los más altos estándares de seguridad. Contraseñas hasheadas con bcrypt, cumplimiento total RGPD, y control total sobre tus datos."
                : "Your information is protected with the highest security standards. Passwords hashed with bcrypt, full GDPR compliance, and full control over your data.",
            formula: {
              title: language === "es" ? "Protección de Datos" : "Data Protection",
              content: "Contraseñas: bcrypt | Datos: Exportables/Eliminables | RGPD completo",
              note:
                language === "es"
                  ? "Nunca compartiremos tus datos con terceros. Tu privacidad es sagrada."
                  : "We will never share your data with third parties. Your privacy is sacred.",
            },
          },
          {
            id: "soporte",
            title: language === "es" ? "Soporte Técnico y Contacto" : "Technical Support and Contact",
            content:
              language === "es"
                ? "¿Problemas técnicos? Abre un ticket desde el enlace de Contacto en el pie de página. Tiempo de respuesta: 24-48 horas. Para reportar bugs, incluye: versión del software (visible en el pie de página), pasos para reproducir el error, captura de pantalla si es posible."
                : "Technical problems? Open a ticket from the Contact link in the footer. Response time: 24-48 hours. To report bugs, include: software version (visible in footer), steps to reproduce the error, screenshot if possible.",
            formula: {
              title: language === "es" ? "Contacto" : "Contact",
              content: "support@magelord.com | Tiempo de respuesta: 24-48h",
              note:
                language === "es"
                  ? "Para emergencias críticas (servidor caído, pérdida de datos), contacta inmediatamente al equipo de soporte."
                  : "For critical emergencies (server down, data loss), contact the support team immediately.",
            },
          },
        ],
      },
    ]

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        {/* Header with back button and search */}
        <div className="sticky top-0 z-[200] bg-[#1a1a1a] border-b border-[#d4af37]/30 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "es" ? "Volver" : "Back"}
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  language === "es"
                    ? "Buscar en el Códice (ej: networth, hechizos, gremios...)"
                    : "Search the Codex (e.g.: networth, spells, guilds...)"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-[#d4af37]/30 rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Hero Section */}
          {!activeTome && (
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-[#d4af37] mb-4">
                {language === "es" ? "Guía del Archimago" : "Archmage's Guide"}
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                {language === "es" ? "El Códice Completo de MageLord" : "The Complete Codex of MageLord"}
              </p>
              <p className="text-gray-400 italic">
                {language === "es"
                  ? "Diez tomos de conocimiento ancestral que revelan todos los secretos del dominio arcano"
                  : "Ten tomes of ancestral knowledge revealing all secrets of arcane dominion"}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Tome Index */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#d4af37]/30 p-4 sticky top-24 z-[150]">
                <h2 className="text-xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {language === "es" ? "Índice de Tomos" : "Tome Index"}
                </h2>
                <div className="space-y-2">
                  {tomes.map((tome) => (
                    <button
                      key={tome.id}
                      onClick={() => setActiveTome(tome.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        activeTome === tome.id
                          ? `bg-gradient-to-r ${tome.bgColor} border-2 border-[#d4af37]`
                          : "bg-black/40 border border-[#d4af37]/20 hover:border-[#d4af37] hover:bg-[#d4af37]/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tome.icon className={`h-5 w-5 ${tome.color}`} />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-[#d4af37]">{tome.subtitle}</p>
                          <p className="text-xs text-gray-400">
                            {tome.sections.length} {language === "es" ? "secciones" : "sections"}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Center Panel: Dynamic Content */}
            <div className="lg:col-span-6">
              {activeTome ? (
                <>
                  {tomes
                    .filter((t) => t.id === activeTome)
                    .map((tome) => (
                      <div key={tome.id} className="space-y-6">
                        {/* Tome Header */}
                        <Card className={`bg-gradient-to-r ${tome.bgColor} border-2 border-[#d4af37] p-6`}>
                          <div className="flex items-start gap-4">
                            <tome.icon className={`h-12 w-12 ${tome.color}`} />
                            <div className="flex-1">
                              <h1 className="text-3xl font-bold text-[#d4af37] mb-2">{tome.title}</h1>
                              <p className="text-gray-300">{tome.subtitle}</p>
                            </div>
                          </div>
                        </Card>

                        {/* Sections */}
                        {tome.sections.map((section) => (
                          <Card
                            key={section.id}
                            id={section.id}
                            className="bg-[#1a1a1a] border-2 border-[#d4af37]/30 p-6 scroll-mt-24"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h2 className="text-2xl font-bold text-[#d4af37]">{section.title}</h2>
                              <button
                                onClick={() => setPinnedSection(pinnedSection === section.id ? null : section.id)}
                                className={`p-2 rounded ${
                                  pinnedSection === section.id
                                    ? "bg-[#d4af37]/20 text-[#d4af37]"
                                    : "hover:bg-[#d4af37]/10 text-gray-400"
                                }`}
                                title={language === "es" ? "Fijar sección" : "Pin section"}
                              >
                                <Info className="h-5 w-5" />
                              </button>
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed">{section.content}</p>

                            {/* Display factions if present */}
                            {section.factions && (
                              <div className="space-y-3">
                                {section.factions.map((faction, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 p-4 rounded-lg"
                                  >
                                    <h3 className="font-bold text-[#d4af37] text-lg mb-1">{faction.name}</h3>
                                    <p className="text-green-400 text-sm font-bold mb-1">{faction.bonus}</p>
                                    <p className="text-gray-400 text-sm mb-2">{faction.style}</p>
                                    <p className="text-gray-300 text-xs italic leading-relaxed">{faction.lore}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Display classes if present */}
                            {section.classes && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {section.classes.map((classItem, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 p-3 rounded-lg"
                                  >
                                    <h3 className="font-bold text-[#d4af37] mb-1">{classItem.name}</h3>
                                    <p className="text-green-400 text-sm font-bold mb-1">{classItem.bonus}</p>
                                    <p className="text-gray-300 text-xs">{classItem.desc}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Display alignments if present */}
                            {section.alignments && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {section.alignments.map((alignment, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 p-3 rounded-lg text-center"
                                  >
                                    <h3 className="font-bold text-[#d4af37] mb-1">{alignment.name}</h3>
                                    <p className="text-green-400 text-sm font-bold mb-1">{alignment.bonus}</p>
                                    <p className="text-gray-300 text-xs">{alignment.path}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Formula if present */}
                            {section.formula && (
                              <div className="bg-black/60 border-2 border-[#d4af37]/50 rounded-lg p-4 mt-4">
                                <h3 className="text-lg font-bold text-cyan-400 mb-2">{section.formula.title}</h3>
                                <div className="bg-black/80 p-3 rounded mb-2">
                                  <p className="font-mono text-green-400 text-center">{section.formula.content}</p>
                                </div>
                                <p className="text-xs text-gray-400 italic">{section.formula.note}</p>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    ))}
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tomes.map((tome) => (
                    <Card
                      key={tome.id}
                      onClick={() => setActiveTome(tome.id)}
                      className={`bg-gradient-to-r ${tome.bgColor} border-2 border-[#d4af37]/50 p-6 cursor-pointer hover:border-[#d4af37] hover:scale-105 transition-all`}
                    >
                      <tome.icon className={`h-10 w-10 ${tome.color} mb-3`} />
                      <h3 className="text-xl font-bold text-[#d4af37] mb-2">{tome.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{tome.subtitle}</p>
                      <p className="text-xs text-gray-400">
                        {tome.sections.length} {language === "es" ? "secciones" : "sections"}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar: Quick Navigation & Pinned */}
            {activeTome && (
              <div className="lg:col-span-3">
                <Card className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#d4af37]/30 p-4 sticky top-24 z-[150]">
                  <h2 className="text-lg font-bold text-[#d4af37] mb-4">
                    {language === "es" ? "Navegación Rápida" : "Quick Navigation"}
                  </h2>
                  <div className="space-y-2">
                    {tomes
                      .filter((t) => t.id === activeTome)[0]
                      ?.sections.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="block p-2 rounded text-sm text-gray-300 hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition-colors"
                        >
                          {section.title}
                        </a>
                      ))}
                  </div>

                  {pinnedSection && (
                    <div className="mt-6 pt-6 border-t border-[#d4af37]/30">
                      <h3 className="text-sm font-bold text-[#d4af37] mb-2">
                        {language === "es" ? "Sección Fijada" : "Pinned Section"}
                      </h3>
                      <div className="bg-black/40 p-3 rounded text-xs text-gray-300">
                        {
                          tomes.filter((t) => t.id === activeTome)[0]?.sections.find((s) => s.id === pinnedSection)
                            ?.title
                        }
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Fallback for other sections
  const getContent = () => {
    switch (section) {
      case "footer-server-time":
        return {
          title: "Hora del Servidor",
          icon: <Clock className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <p className="text-[#d4af37]/90 leading-relaxed">
                La hora del servidor es la referencia temporal oficial de MageLord. Todos los eventos, ataques
                coordinados y acciones del juego se basan en esta hora universal.
              </p>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">¿Por qué es importante?</h3>
                <ul className="space-y-3 text-[#d4af37]/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4af37] mt-1">•</span>
                    <span>
                      <strong>Coordinación de Gremios:</strong> Todos los ataques masivos se programan según la hora del
                      servidor (ej: "Ataque al Reino del Norte a las 22:00 hora server")
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4af37] mt-1">•</span>
                    <span>
                      <strong>Eventos Globales:</strong> Las subastas del Mercado Negro, los rituales y los eventos
                      especiales tienen horarios fijos basados en la hora del servidor
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4af37] mt-1">•</span>
                    <span>
                      <strong>Zona Horaria:</strong> El servidor opera en UTC+1 (Hora de Madrid)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-4 rounded border border-amber-700/30">
                <p className="text-amber-300 text-sm">
                  💡 <strong>Consejo:</strong> Sincroniza tu reloj con la hora del servidor para no perder oportunidades
                  estratégicas.
                </p>
              </div>
            </div>
          ),
        }

      case "footer-turn-counter":
        return {
          title: "Contador de Turnos",
          icon: <Clock className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <p className="text-[#d4af37]/90 leading-relaxed">
                Los turnos son el recurso más valioso de MageLord. Se generan automáticamente cada 15 minutos y son
                necesarios para todas las acciones estratégicas.
              </p>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Sistema de Generación de Turnos</h3>
                <ul className="space-y-3 text-[#d4af37]/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4af37] mt-1">•</span>
                    <span>
                      <strong>Frecuencia:</strong> 1 turno cada 15 minutos (4 turnos por hora)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4af37] mt-1">•</span>
                    <span>
                      <strong>Máximo:</strong> 150 turnos acumulados (para evitar ventajas de jugadores inactivos)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4af37] mt-1">•</span>
                    <span>
                      <strong>Generación Pasiva:</strong> Los turnos se generan incluso cuando estás desconectado
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded border border-[#d4af37]/20">
                  <h4 className="text-[#d4af37] font-semibold mb-2">Usos de Turnos</h4>
                  <ul className="space-y-1 text-sm text-[#d4af37]/70">
                    <li>• Exploración (1-20 turnos)</li>
                    <li>• Construcción (variable)</li>
                    <li>• Entrenamiento (variable)</li>
                    <li>• Comercio (1 turno)</li>
                    <li>• Rituales (1-50 turnos)</li>
                  </ul>
                </div>

                <div className="bg-black/30 p-4 rounded border border-[#d4af37]/20">
                  <h4 className="text-[#d4af37] font-semibold mb-2">Estrategia</h4>
                  <p className="text-sm text-[#d4af37]/70">
                    Los jugadores experimentados mantienen siempre una reserva de 30-50 turnos para responder
                    rápidamente a ataques enemigos o aprovechar oportunidades en el Mercado Negro.
                  </p>
                </div>
              </div>
            </div>
          ),
        }

      case "footer-version":
        return {
          title: "Versión del Software",
          icon: <Code className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-black/40 rounded-lg border border-[#d4af37]/30">
                <Code className="h-16 w-16 text-[#d4af37]" />
                <div>
                  <h3 className="text-2xl font-bold text-[#d4af37]">v0.8.4-Alpha</h3>
                  <p className="text-[#d4af37]/70">Lanzamiento: 15 de Enero de 2025</p>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Novedades de esta versión</h3>
                <ul className="space-y-3 text-[#d4af37]/80">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Sistema de Gremios con bonos de sinergia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Mercado Negro con subastas en tiempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Sistema de Represalias y Protecciones mejorado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Nuevos rituales para Legiones Infernales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">⚠</span>
                    <span className="text-yellow-400/80">Balanceo de unidades Tier 4 (reducción de daño en 15%)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 p-4 rounded border border-red-700/30">
                <p className="text-red-300 text-sm">
                  🐛 <strong>Reportar Bugs:</strong> Si encuentras algún error, indica siempre la versión (v0.8.4-Alpha)
                  al reportarlo en el apartado de Soporte.
                </p>
              </div>
            </div>
          ),
        }

      case "footer-population":
        return {
          title: "Estado de Población",
          icon: <Users className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-lg border border-green-700/30">
                  <Users className="h-8 w-8 text-green-400 mb-2" />
                  <div className="text-3xl font-bold text-green-400">1,240</div>
                  <div className="text-sm text-green-300/70">Archimagos Online</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-lg border border-blue-700/30">
                  <Users className="h-8 w-8 text-blue-400 mb-2" />
                  <div className="text-3xl font-bold text-blue-400">8,542</div>
                  <div className="text-sm text-blue-300/70">Jugadores Registrados</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-lg border border-purple-700/30">
                  <Users className="h-8 w-8 text-purple-400 mb-2" />
                  <div className="text-3xl font-bold text-purple-400">142</div>
                  <div className="text-sm text-purple-300/70">Gremios Activos</div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Actividad del Servidor</h3>
                <p className="text-[#d4af37]/80 mb-4">
                  El servidor está experimentando una actividad alta. Este es un momento ideal para:
                </p>
                <ul className="space-y-2 text-[#d4af37]/70">
                  <li>• Buscar aliados en el Foro de la Taberna</li>
                  <li>• Participar en subastas del Mercado Negro</li>
                  <li>• Coordinar ataques con tu Gremio</li>
                  <li>• Comerciar recursos en el Mercado Global</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-4 rounded border border-amber-700/30">
                <p className="text-amber-300 text-sm">
                  📊 <strong>Horario de Máxima Actividad:</strong> Entre las 20:00 y 23:00 hora del servidor
                </p>
              </div>
            </div>
          ),
        }

      case "footer-tavern":
        return {
          title: "Foro de la Taberna",
          icon: <MessageSquare className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <p className="text-[#d4af37]/90 leading-relaxed">
                La Taberna es el corazón social de MageLord. Aquí los Archimagos de todos los reinos comparten
                estrategias, forjan alianzas y discuten las últimas noticias del servidor.
              </p>

              <div className="grid gap-4">
                <div className="bg-black/40 p-5 rounded-lg border border-[#d4af37]/20">
                  <h4 className="text-[#d4af37] font-bold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Secciones del Foro
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                      <span className="text-[#d4af37]/90">💬 Discusión General</span>
                      <span className="text-[#d4af37]/60 text-sm">1,542 hilos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                      <span className="text-[#d4af37]/90">⚔️ Estrategia y Combate</span>
                      <span className="text-[#d4af37]/60 text-sm">823 hilos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                      <span className="text-[#d4af37]/90">🤝 Reclutamiento de Gremios</span>
                      <span className="text-[#d4af37]/60 text-sm">247 hilos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                      <span className="text-[#d4af37]/90">📰 Anuncios y Eventos</span>
                      <span className="text-[#d4af37]/60 text-sm">94 hilos</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 rounded border border-purple-700/30">
                  <h4 className="text-purple-300 font-semibold mb-2">🔥 Hilo Popular de Hoy</h4>
                  <p className="text-purple-200/80 text-sm mb-2">
                    "¿Legiones Infernales necesitan nerf? Debate sobre el balanceo de Tier 4"
                  </p>
                  <p className="text-purple-300/60 text-xs">Publicado por DarkLord_88 • 342 respuestas</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-4 rounded border border-amber-700/30">
                <p className="text-amber-300 text-sm">
                  💡 <strong>Regla de Oro:</strong> Respeta a otros jugadores. La Taberna es un espacio de debate
                  constructivo.
                </p>
              </div>
            </div>
          ),
        }

      case "footer-changelog":
        return {
          title: "Changelog - Registro de Cambios",
          icon: <FileText className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#d4af37] font-bold">v0.8.4-Alpha</h3>
                  <span className="text-[#d4af37]/60 text-sm">15 Enero 2025</span>
                </div>
                <div className="space-y-3 text-[#d4af37]/80">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">✨ Nuevas Características</h4>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>• Sistema de Gremios con límite de 25 miembros</li>
                      <li>• Mercado Negro con subastas en tiempo real</li>
                      <li>• Sistema de Represalias extendido a 48 horas</li>
                      <li>• Nuevos rituales: "Llamada del Vacío" y "Eclipsar el Sol"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">🔧 Mejoras</h4>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>• Optimización del sistema de turnos (ahora cada 15 minutos)</li>
                      <li>• Interfaz de mensajería rediseñada con estética medieval</li>
                      <li>• Rankings ahora muestran Top 3 con coronas especiales</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">⚖️ Balanceo</h4>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>• Dragones (Tier 4): Daño reducido en 15%</li>
                      <li>• Hechizo "Apocalipsis": Cooldown aumentado a 72 horas</li>
                      <li>• Bonus de Guardianes de la Escama ajustado de +25% a +20%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">🐛 Bugs Corregidos</h4>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>• Corregido error en el cálculo de Networth de Gremios</li>
                      <li>• Arreglado bug de duplicación de turnos en construcción</li>
                      <li>• Solucionado problema visual en modales de entrenamiento</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20 opacity-70">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#d4af37] font-bold">v0.8.3-Alpha</h3>
                  <span className="text-[#d4af37]/60 text-sm">28 Diciembre 2024</span>
                </div>
                <p className="text-[#d4af37]/60 text-sm">
                  Versión anterior con implementación del sistema de defensa automática...
                </p>
              </div>
            </div>
          ),
        }

      case "footer-discord":
        return {
          title: "Discord / Redes Sociales",
          icon: <Github className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <p className="text-[#d4af37]/90 leading-relaxed">
                Únete a la comunidad de MageLord en nuestras redes sociales. Comparte estrategias, encuentra aliados y
                mantente al día con las últimas novedades.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="https://discord.gg/magelord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 p-6 rounded-lg border border-indigo-700/40 hover:border-indigo-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="h-8 w-8 text-indigo-400" />
                    <div>
                      <h4 className="text-indigo-300 font-bold">Discord</h4>
                      <p className="text-indigo-400/60 text-xs">3,247 miembros</p>
                    </div>
                  </div>
                  <p className="text-indigo-200/70 text-sm">
                    Chat en tiempo real, canales por facción, ayuda de moderadores
                  </p>
                </a>

                <a
                  href="https://twitter.com/MageLordGame"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-6 rounded-lg border border-cyan-700/40 hover:border-cyan-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-8 w-8 text-cyan-400" />
                    <div>
                      <h4 className="text-cyan-300 font-bold">Twitter/X</h4>
                      <p className="text-cyan-400/60 text-xs">@MageLordGame</p>
                    </div>
                  </div>
                  <p className="text-cyan-200/70 text-sm">Anuncios oficiales, eventos especiales, sorteos de oro</p>
                </a>

                <a
                  href="https://reddit.com/r/MageLord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-lg border border-orange-700/40 hover:border-orange-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="h-8 w-8 text-orange-400" />
                    <div>
                      <h4 className="text-orange-300 font-bold">Reddit</h4>
                      <p className="text-orange-400/60 text-xs">r/MageLord</p>
                    </div>
                  </div>
                  <p className="text-orange-200/70 text-sm">Guías de jugadores, memes, teorías de estrategia</p>
                </a>

                <a
                  href="https://github.com/MageLord/game"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 p-6 rounded-lg border border-gray-700/40 hover:border-gray-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Github className="h-8 w-8 text-gray-400" />
                    <div>
                      <h4 className="text-gray-300 font-bold">GitHub</h4>
                      <p className="text-gray-400/60 text-xs">Open Source</p>
                    </div>
                  </div>
                  <p className="text-gray-200/70 text-sm">Reporta bugs, sugiere mejoras, contribuye al código</p>
                </a>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 rounded border border-purple-700/30">
                <p className="text-purple-300 text-sm">
                  🎁 <strong>Eventos Exclusivos:</strong> Síguenos en Discord para participar en torneos y sorteos
                  semanales
                </p>
              </div>
            </div>
          ),
        }

      case "footer-terms":
        return {
          title: "Términos y Condiciones",
          icon: <Scroll className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">1. Aceptación de los Términos</h3>
                <p className="text-[#d4af37]/80 text-sm leading-relaxed">
                  Al acceder y utilizar MageLord, aceptas estar sujeto a estos Términos y Condiciones de Uso. Si no
                  estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
                </p>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">2. Cuenta de Usuario</h3>
                <ul className="space-y-2 text-[#d4af37]/80 text-sm">
                  <li>• Debes tener al menos 13 años para crear una cuenta</li>
                  <li>• Eres responsable de mantener la seguridad de tu cuenta y contraseña</li>
                  <li>• Una persona solo puede tener una cuenta activa (prohibida la multicuenta)</li>
                  <li>• Compartir tu cuenta con otros usuarios está prohibido</li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">3. Conducta Prohibida</h3>
                <p className="text-[#d4af37]/80 text-sm mb-3">
                  Las siguientes acciones resultarán en suspensión o baneo permanente:
                </p>
                <ul className="space-y-2 text-[#d4af37]/80 text-sm">
                  <li>
                    • <strong>Multicuenta:</strong> Usar más de una cuenta para obtener ventajas injustas
                  </li>
                  <li>
                    • <strong>Bots y Automatización:</strong> Scripts automáticos, herramientas de terceros
                  </li>
                  <li>
                    • <strong>Explotación de Bugs:</strong> Aprovechar fallos del juego sin reportarlos
                  </li>
                  <li>
                    • <strong>RMT (Real Money Trading):</strong> Comprar/vender cuentas o recursos por dinero real fuera
                    del juego
                  </li>
                  <li>
                    • <strong>Acoso Extremo:</strong> Amenazas, doxxing, discriminación
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">4. Propiedad Intelectual</h3>
                <p className="text-[#d4af37]/80 text-sm leading-relaxed">
                  Todo el contenido del juego (gráficos, texto, código, mecánicas) es propiedad de MageLord. Los
                  jugadores conservan los derechos sobre el contenido que generan (mensajes, nombres de gremios), pero
                  otorgan a MageLord una licencia para usarlo dentro del juego.
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 p-4 rounded border border-red-700/30">
                <p className="text-red-300 text-sm">
                  ⚖️ <strong>Importante:</strong> MageLord se reserva el derecho de modificar estos términos en cualquier
                  momento. Los cambios entrarán en vigor inmediatamente tras su publicación.
                </p>
              </div>
            </div>
          ),
        }

      case "footer-privacy":
        return {
          title: "Política de Privacidad y Cookies",
          icon: <Shield className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <p className="text-[#d4af37]/90 leading-relaxed">
                En MageLord respetamos tu privacidad y cumplimos con el Reglamento General de Protección de Datos (RGPD)
                de la Unión Europea.
              </p>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Datos que Recopilamos</h3>
                <ul className="space-y-2 text-[#d4af37]/80 text-sm">
                  <li>
                    • <strong>Datos de Cuenta:</strong> Email, nombre de usuario, contraseña (encriptada)
                  </li>
                  <li>
                    • <strong>Datos de Juego:</strong> Progreso, estadísticas, mensajes del juego
                  </li>
                  <li>
                    • <strong>Datos Técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo
                  </li>
                  <li>
                    • <strong>Cookies:</strong> Sesión de usuario, preferencias de idioma
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Cómo Usamos tus Datos</h3>
                <ul className="space-y-2 text-[#d4af37]/80 text-sm">
                  <li>• Proporcionar y mejorar el servicio del juego</li>
                  <li>• Autenticación y seguridad de cuentas</li>
                  <li>• Comunicaciones relacionadas con el juego (eventos, actualizaciones)</li>
                  <li>• Detección y prevención de fraudes (multicuenta, bots)</li>
                  <li>• Análisis de uso para mejorar la experiencia</li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Tus Derechos (RGPD)</h3>
                <ul className="space-y-2 text-[#d4af37]/80 text-sm">
                  <li>
                    • <strong>Acceso:</strong> Solicitar una copia de tus datos personales
                  </li>
                  <li>
                    • <strong>Rectificación:</strong> Corregir datos inexactos o incompletos
                  </li>
                  <li>
                    • <strong>Supresión:</strong> Solicitar la eliminación de tu cuenta y datos
                  </li>
                  <li>
                    • <strong>Portabilidad:</strong> Recibir tus datos en formato estructurado
                  </li>
                  <li>
                    • <strong>Oposición:</strong> Oponerte al procesamiento de tus datos para ciertos fines
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Cookies que Utilizamos</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[#d4af37]/90 font-semibold text-sm mb-1">Cookies Esenciales</h4>
                    <p className="text-[#d4af37]/70 text-xs">
                      Necesarias para el funcionamiento básico (sesión, autenticación)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[#d4af37]/90 font-semibold text-sm mb-1">Cookies de Preferencias</h4>
                    <p className="text-[#d4af37]/70 text-xs">Guardan tus preferencias (idioma, tema oscuro/claro)</p>
                  </div>
                  <div>
                    <h4 className="text-[#d4af37]/90 font-semibold text-sm mb-1">Cookies Analíticas</h4>
                    <p className="text-[#d4af37]/70 text-xs">
                      Nos ayudan a entender cómo los jugadores usan MageLord (anónimas)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 p-4 rounded border border-blue-700/30">
                <p className="text-cyan-300 text-sm">
                  🔒 <strong>Seguridad:</strong> Tus datos están protegidos con encriptación SSL/TLS y almacenados en
                  servidores seguros en la UE.
                </p>
              </div>
            </div>
          ),
        }

      case "footer-conduct":
        return {
          title: "Normas de Conducta",
          icon: <FileWarning className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <p className="text-[#d4af37]/90 leading-relaxed">
                MageLord es una comunidad basada en el respeto mutuo y el juego limpio. Todos los jugadores deben
                cumplir con estas normas para garantizar una experiencia positiva.
              </p>

              <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 rounded-lg border border-red-700/40">
                <h3 className="text-red-300 font-bold mb-4 flex items-center gap-2">
                  <FileWarning className="h-5 w-5" />
                  Infracciones Graves (Baneo Permanente)
                </h3>
                <ul className="space-y-2 text-red-200/80 text-sm">
                  <li>
                    • <strong>Multicuenta:</strong> Usar más de una cuenta para obtener ventajas injustas
                  </li>
                  <li>
                    • <strong>Bots y Automatización:</strong> Scripts automáticos, herramientas de terceros
                  </li>
                  <li>
                    • <strong>Explotación de Bugs:</strong> Aprovechar fallos del juego sin reportarlos
                  </li>
                  <li>
                    • <strong>RMT (Real Money Trading):</strong> Comprar/vender cuentas o recursos por dinero real
                  </li>
                  <li>
                    • <strong>Acoso Extremo:</strong> Amenazas, doxxing, discriminación
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 p-6 rounded-lg border border-yellow-700/40">
                <h3 className="text-yellow-300 font-bold mb-4">Infracciones Moderadas (Suspensión Temporal)</h3>
                <ul className="space-y-2 text-yellow-200/80 text-sm">
                  <li>
                    • <strong>Spam:</strong> Mensajes masivos, publicidad no solicitada
                  </li>
                  <li>
                    • <strong>Lenguaje Ofensivo:</strong> Insultos graves en el chat o mensajes
                  </li>
                  <li>
                    • <strong>Griefing:</strong> Atacar repetidamente a principiantes para arruinar su experiencia
                  </li>
                  <li>
                    • <strong>Evasión de Penalizaciones:</strong> Crear cuentas alternativas tras un baneo
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Juego Limpio (Fair Play)</h3>
                <p className="text-[#d4af37]/80 text-sm mb-3">
                  El espíritu de MageLord se basa en la competencia estratégica, no en el abuso de mecánicas:
                </p>
                <ul className="space-y-2 text-[#d4af37]/70 text-sm">
                  <li>• Respeta los Rangos de Ataque (80%-120% Networth)</li>
                  <li>• No ataques repetidamente a jugadores en Protección por Derrota</li>
                  <li>• Acepta las Represalias como parte del juego (no hay "llorar" por contraataques)</li>
                  <li>• Reporta bugs en lugar de explotarlos (serás recompensado por reportes válidos)</li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Sistema de Reportes</h3>
                <p className="text-[#d4af37]/80 text-sm mb-3">Si encuentras a alguien violando estas normas:</p>
                <ol className="space-y-2 text-[#d4af37]/70 text-sm list-decimal ml-6">
                  <li>Usa el botón de "Reportar Jugador" en su perfil</li>
                  <li>Proporciona pruebas (capturas de pantalla, nombres exactos, fechas)</li>
                  <li>Espera a que un moderador revise el caso (24-72 horas)</li>
                  <li>No hagas "justicia por tu mano" (no organices ataques masivos como castigo)</li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-4 rounded border border-green-700/30">
                <p className="text-green-300 text-sm">
                  ✅ <strong>Buen Comportamiento Premiado:</strong> Los jugadores con historial limpio pueden recibir
                  títulos especiales y recompensas exclusivas.
                </p>
              </div>
            </div>
          ),
        }

      case "footer-support":
        return {
          title: "Contacto / Soporte",
          icon: <Mail className="h-8 w-8" />,
          content: (
            <div className="space-y-6">
              <p className="text-[#d4af37]/90 leading-relaxed">
                ¿Necesitas ayuda? Nuestro equipo de soporte está disponible para resolver tus dudas y problemas
                técnicos.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-lg border border-blue-700/40">
                  <Mail className="h-8 w-8 text-blue-400 mb-3" />
                  <h4 className="text-blue-300 font-bold mb-2">Soporte por Email</h4>
                  <p className="text-blue-200/70 text-sm mb-3">Para problemas técnicos, bugs o consultas generales</p>
                  <a href="mailto:support@magelord.com" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
                    support@magelord.com
                  </a>
                  <p className="text-blue-300/50 text-xs mt-2">Respuesta en 24-48 horas</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-lg border border-purple-700/40">
                  <MessageSquare className="h-8 w-8 text-purple-400 mb-3" />
                  <h4 className="text-purple-300 font-bold mb-2">Discord - Soporte Rápido</h4>
                  <p className="text-purple-200/70 text-sm mb-3">Canal #soporte con moderadores activos</p>
                  <a
                    href="https://discord.gg/magelord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    discord.gg/magelord
                  </a>
                  <p className="text-purple-300/50 text-xs mt-2">Respuesta en minutos</p>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Antes de Contactar</h3>
                <p className="text-[#d4af37]/80 text-sm mb-3">Para una respuesta más rápida, asegúrate de incluir:</p>
                <ul className="space-y-2 text-[#d4af37]/70 text-sm">
                  <li>
                    • <strong>Nombre de Usuario:</strong> Tu nombre de Archimago en el juego
                  </li>
                  <li>
                    • <strong>Versión del Juego:</strong> La versión actual (ej: v0.8.4-Alpha)
                  </li>
                  <li>
                    • <strong>Descripción Detallada:</strong> Qué estabas haciendo cuando ocurrió el problema
                  </li>
                  <li>
                    • <strong>Capturas de Pantalla:</strong> Si es posible, adjunta imágenes del error
                  </li>
                  <li>
                    • <strong>Navegador y Dispositivo:</strong> Chrome/Firefox/Safari, PC/Móvil
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-lg border border-[#d4af37]/20">
                <h3 className="text-[#d4af37] font-bold mb-4">Tipos de Consultas</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-black/30 p-3 rounded">
                    <h5 className="text-[#d4af37]/90 text-sm font-semibold mb-1">🐛 Reporte de Bugs</h5>
                    <p className="text-[#d4af37]/60 text-xs">
                      Errores técnicos, problemas de renderizado, cálculos incorrectos
                    </p>
                  </div>
                  <div className="bg-black/30 p-3 rounded">
                    <h5 className="text-[#d4af37]/90 text-sm font-semibold mb-1">❓ Consultas de Juego</h5>
                    <p className="text-[#d4af37]/60 text-xs">Dudas sobre mecánicas, fórmulas, estrategias</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded">
                    <h5 className="text-[#d4af37]/90 text-sm font-semibold mb-1">🔒 Problemas de Cuenta</h5>
                    <p className="text-[#d4af37]/60 text-xs">Recuperación de contraseña, baneo injusto, hackeo</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded">
                    <h5 className="text-[#d4af37]/90 text-sm font-semibold mb-1">💡 Sugerencias</h5>
                    <p className="text-[#d4af37]/60 text-xs">Ideas para nuevas características, balanceo, mejoras</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-4 rounded border border-amber-700/30">
                <p className="text-amber-300 text-sm">
                  ⚡ <strong>Urgencias:</strong> Si has sido hackeado o hay un bug crítico que afecta el servidor, usa
                  el email con asunto "URGENTE" para prioridad máxima.
                </p>
              </div>
            </div>
          ),
        }

      default:
        return {
          title: "Contenido no encontrado",
          icon: <FileText className="h-8 w-8" />,
          content: <p className="text-[#d4af37]/70">El contenido solicitado no está disponible.</p>,
        }
    }
  }

  const content = getContent()

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#d4af37]/70 hover:text-[#d4af37] transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
          )}

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-[#d4af37]/20 to-amber-900/20 rounded-lg border border-[#d4af37]/30">
              {content.icon}
            </div>
            <h1 className="text-3xl font-bold text-[#d4af37]">{content.title}</h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-[#d4af37] to-transparent rounded-full"></div>
        </div>

        <div className="bg-gradient-to-b from-black/60 to-black/80 rounded-lg border border-[#d4af37]/20 p-8">
          {content.content}
        </div>
      </div>
    </div>
  )
}

export default FooterContentPage
