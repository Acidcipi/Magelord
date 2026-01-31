"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  FlaskConical,
  X,
  Sword,
  Swords,
  ShoppingCart,
  MessageSquare,
  Trophy,
  Crown,
  Coins,
  MapPin,
} from "lucide-react"

interface GuiaPageProps {
  language: Language
}

type GuideSection =
  | "lore"
  | "research"
  | "mechanics"
  | "military"
  | "combat"
  | "marketplace"
  | "diplomacy"
  | "magic"
  | null

export function GuiaPage({ language }: GuiaPageProps) {
  const t = useTranslation(language)
  const [activeSection, setActiveSection] = useState<GuideSection>(null)
  // const [openModal, setOpenModal] = useState<string | null>(null)
  // const [activeModal, setActiveModal] = useState<string | null>(null)

  const sections = [
    {
      id: "lore" as GuideSection,
      title: language === "es" ? "Facciones, Clases y Alineamientos" : "Factions, Classes & Alignments",
      description:
        language === "es"
          ? "Descubre las 8 facciones, 5 clases especializadas y 3 alineamientos morales que definen tu imperio."
          : "Discover the 8 factions, 5 specialized classes and 3 moral alignments that define your empire.",
      icon: Users,
      color: "text-blue-400",
      bgGradient: "from-blue-900/20 to-indigo-900/20",
      image: "/epic-fantasy-mage-wizard-with-golden-aura-casting-.jpg",
    },
    {
      id: "research" as GuideSection,
      title: language === "es" ? "Sistema de Investigación" : "Research System",
      description:
        language === "es"
          ? "Aprende sobre Hechizos, Nivel de Magia y Academia Militar. Desbloquea el poder supremo."
          : "Learn about Spells, Magic Level and Military Academy. Unlock supreme power.",
      icon: FlaskConical,
      color: "text-purple-400",
      bgGradient: "from-purple-900/20 to-violet-900/20",
      image: "/magical-wizard-tower.jpg",
    },
    {
      id: "mechanics" as GuideSection,
      title: language === "es" ? "Mecánicas del Juego" : "Game Mechanics",
      description:
        language === "es"
          ? "Entiende los sistemas de Exploración, Construcción y Demolición que rigen tu imperio."
          : "Understand the Exploration, Construction and Demolition systems that govern your empire.",
      icon: BookOpen,
      color: "text-green-400",
      bgGradient: "from-green-900/20 to-teal-900/20",
      image: "/fantasy-wilderness-ancient-map-landscape.jpg",
    },
    {
      id: "military" as GuideSection,
      title: language === "es" ? "Sistema Militar" : "Military System",
      description:
        language === "es"
          ? "Domina el entrenamiento, mantenimiento y logística de tus ejércitos. Conquista o perece."
          : "Master training, maintenance and logistics of your armies. Conquer or perish.",
      icon: Sword,
      color: "text-red-400",
      bgGradient: "from-red-900/20 to-orange-900/20",
      image: "/medieval-military-barracks.jpg",
    },
    {
      id: "combat" as GuideSection,
      title: language === "es" ? "Sistema de Combate" : "Combat System",
      description:
        language === "es"
          ? "Aprende las reglas de guerra: ataques, defensas, represalias y protecciones del sistema de combate."
          : "Learn the rules of war: attacks, defenses, retaliations, and combat system protections.",
      icon: Swords,
      color: "text-red-500",
      bgGradient: "from-red-900/40 to-orange-800/40",
      image: "/images/fantasy-battle-scene.jpg",
    },
    {
      id: "marketplace",
      title: language === "es" ? "Sistema de Mercado" : "Marketplace System",
      icon: ShoppingCart,
      color: "text-amber-400",
      bgGradient: "from-amber-900/20 to-yellow-900/20",
      image: "/images/fantasy-marketplace-trading.jpg",
      description:
        language === "es"
          ? "El comercio es poder. Mercado Global y Mercado Negro."
          : "Trade is power. Global Market and Black Market.",
    },
    {
      id: "diplomacy",
      title: language === "es" ? "Sistema de Diplomacia" : "Diplomacy System",
      icon: MessageSquare,
      color: "text-cyan-400",
      bgGradient: "from-cyan-900/20 to-blue-900/20",
      image: "/images/fantasy-messenger-scroll.jpg",
      description:
        language === "es"
          ? "Mensajería, gremios, rankings y alianzas estratégicas."
          : "Messaging, guilds, rankings and strategic alliances.",
    },
  ]

  const renderLoreModal = () => {
    const factions = [
      {
        id: "infernal",
        name: language === "es" ? "Legiones Infernales" : "Infernal Legions",
        icon: "🔥", // ROJO
        bonus: language === "es" ? "+15% Ataque" : "+15% Attack",
        description:
          language === "es"
            ? "Mecánica única: Saqueo (Roban +10% de Oro extra al ganar combates)."
            : "Unique mechanic: Pillage (Steal +10% extra Gold on victory).",
        lore:
          language === "es"
            ? "La encarnación de la guerra ofensiva. Sus demonios golpean más fuerte que nadie, alimentando su economía con las riquezas de los imperios que reducen a cenizas."
            : "The embodiment of offensive war. Their demons strike harder than anyone, fueling their economy with the riches of the empires they burn to ash.",
        bgColor: "from-red-900/20 to-orange-900/20",
        borderColor: "border-red-500/30",
      },
      {
        id: "celestial",
        name: language === "es" ? "Cónclave Celestial" : "Celestial Conclave",
        icon: "✨", // BLANCO
        bonus: language === "es" ? "+15% Defensa" : "+15% Defense",
        description:
          language === "es"
            ? "Mecánica única: Fe (Resistencia natural contra magia ofensiva)."
            : "Unique mechanic: Faith (Natural resistance against offensive magic).",
        lore:
          language === "es"
            ? "Guardianes inquebrantables del orden. Sus ángeles y paladines forman un muro impenetrable, protegiendo sus tierras con escudos divinos que repelen tanto el acero como la brujería."
            : "Unwavering guardians of order. Their angels and paladins form an impenetrable wall, protecting their lands with divine shields that repel both steel and sorcery.",
        bgColor: "from-blue-100/10 to-cyan-100/10",
        borderColor: "border-blue-200/30",
      },
      {
        id: "asuryan",
        name: language === "es" ? "Altos Magos de Asuryan" : "High Mages of Asuryan",
        icon: "🌟", // AZUL
        bonus: language === "es" ? "+20% Producción de Maná" : "+20% Mana Production",
        description:
          language === "es"
            ? "Mecánica única: Concentración (Sus hechizos de ataque fallan un 10% menos)."
            : "Unique mechanic: Focus (Their attack spells fail 10% less often).",
        lore:
          language === "es"
            ? "Eruditos que han dominado las corrientes arcanas. Mientras otros luchan por recursos físicos, ellos acumulan maná para desatar tormentas apocalípticas desde sus torres de marfil."
            : "Scholars who have mastered the arcane currents. While others fight for physical resources, they accumulate mana to unleash apocalyptic storms from their ivory towers.",
        bgColor: "from-blue-900/20 to-indigo-900/20",
        borderColor: "border-blue-500/30",
      },
      {
        id: "ultratumba",
        name: language === "es" ? "Reinos de Ultratumba" : "Realms of the Afterlife",
        icon: "💀", // NEGRO
        bonus: language === "es" ? "+25% Espionaje" : "+25% Espionage",
        description:
          language === "es"
            ? "Mecánica única: Terror (Reducen la moral enemiga al atacar)."
            : "Unique mechanic: Terror (Reduce enemy morale when attacking).",
        lore:
          language === "es"
            ? "Señores de los secretos y la muerte. Sus espías son sombras invisibles y sus ejércitos no conocen el miedo. Atacan la mente del enemigo antes de tomar sus tierras."
            : "Lords of secrets and death. Their spies are invisible shadows and their armies know no fear. They attack the enemy's mind before taking their lands.",
        bgColor: "from-gray-900/20 to-purple-950/20",
        borderColor: "border-purple-700/30",
      },
      {
        id: "destruccion",
        name: language === "es" ? "Hordas de la Destrucción" : "Hordes of Destruction",
        icon: "🤢", // VERDE
        bonus: language === "es" ? "+20% Crecimiento Población" : "+20% Population Growth",
        description:
          language === "es"
            ? "Mecánica única: Enjambre (Menor coste de comida para sus tropas)."
            : "Unique mechanic: Swarm (Lower food cost for their troops).",
        lore:
          language === "es"
            ? "Una marea verde de vida salvaje. Se recuperan de las bajas más rápido que cualquier otra facción, abrumando al enemigo con números puros y una vitalidad inagotable."
            : "A green tide of savage life. They recover from casualties faster than any other faction, overwhelming the enemy with sheer numbers and inexhaustible vitality.",
        bgColor: "from-green-900/20 to-emerald-900/20",
        borderColor: "border-green-600/30",
      },
      {
        id: "hierro",
        name: language === "es" ? "Ingenios de Hierro" : "Iron Contraptions",
        icon: "🛠️", // GRIS/ACERO
        bonus: language === "es" ? "-15% Coste de Edificios" : "-15% Building Cost",
        description:
          language === "es"
            ? "Mecánica única: Asedio (Bonus de daño contra murallas y defensas)."
            : "Unique mechanic: Siege (Damage bonus against walls and defenses).",
        lore:
          language === "es"
            ? "Maestros ingenieros de las profundidades. Construyen su economía más rápido y sus máquinas de guerra derriban fortificaciones como si fueran de papel."
            : "Master engineers of the depths. They build their economy faster and their war machines tear down fortifications as if they were paper.",
        bgColor: "from-slate-700/20 to-gray-600/20",
        borderColor: "border-slate-400/30",
      },
      {
        id: "escama",
        name: language === "es" ? "Guardianes de la Escama" : "Scale Guardians",
        icon: "🐉", // DORADO
        bonus: language === "es" ? "+15% Producción de Oro" : "+15% Gold Production",
        description:
          language === "es"
            ? "Mecánica única: Piel de Dragón (Resistencia física en combate)."
            : "Unique mechanic: Dragon Skin (Physical resistance in combat).",
        lore:
          language === "es"
            ? "Custodios de tesoros antiguos. Su inmensa riqueza les permite financiar los mejores ejércitos, y su herencia dracónica les otorga una resistencia sobrenatural."
            : "Custodians of ancient treasures. Their immense wealth allows them to fund the best armies, and their draconic heritage grants them supernatural resilience.",
        bgColor: "from-yellow-700/20 to-amber-700/20",
        borderColor: "border-yellow-500/30",
      },
      {
        id: "sangre",
        name: language === "es" ? "Corte de la Sangre" : "Blood Court",
        icon: "🩸", // CARMESÍ
        bonus: language === "es" ? "Regeneración de Bajas" : "Casualty Regeneration",
        description:
          language === "es"
            ? "Mecánica única: Inmortalidad (Recuperan el 15% de sus muertos tras la batalla)."
            : "Unique mechanic: Immortality (Recover 15% of their dead after battle).",
        lore:
          language === "es"
            ? "Aristócratas eternos que ven la guerra como un banquete. Sus tropas son escasas y caras, pero se niegan a permanecer muertas, levantándose una y otra vez."
            : "Eternal aristocrats who view war as a banquet. Their troops are scarce and expensive, but refuse to stay dead, rising again and again.",
        bgColor: "from-red-950/40 to-pink-900/20",
        borderColor: "border-red-800/50",
      },
    ]

    const classes = [
      {
        id: "guerrero",
        name: language === "es" ? "Guerrero" : "Warrior",
        icon: "⚔️",
        bonus: language === "es" ? "+15% Ataque" : "+15% Attack",
        description:
          language === "es"
            ? "Combatiente feroz especializado en daño físico."
            : "Fierce combatant specialized in physical damage.",
        bgColor: "from-red-800/20 to-orange-800/20",
        borderColor: "border-red-400/30",
      },
      {
        id: "mago",
        name: language === "es" ? "Mago" : "Mage",
        icon: "🔮",
        bonus: language === "es" ? "+25% Maná" : "+25% Mana",
        description:
          language === "es" ? "Maestro arcano con vasto poder mágico." : "Arcane master with vast magical power.",
        bgColor: "from-purple-800/20 to-indigo-800/20",
        borderColor: "border-purple-400/30",
      },
      {
        id: "cazador",
        name: language === "es" ? "Cazador" : "Hunter",
        icon: "🏹",
        bonus: language === "es" ? "+20% Exploración" : "+20% Exploration",
        description:
          language === "es"
            ? "Experto en rastreo y expansión territorial."
            : "Expert in tracking and territorial expansion.",
        bgColor: "from-green-800/20 to-teal-800/20",
        borderColor: "border-green-400/30",
      },
      {
        id: "picaro",
        name: language === "es" ? "Pícaro" : "Rogue",
        icon: "🗡️",
        bonus: language === "es" ? "+30% Espionaje" : "+30% Espionage",
        description:
          language === "es" ? "Maestro del sigilo y la infiltración." : "Master of stealth and infiltration.",
        bgColor: "from-gray-800/20 to-slate-800/20",
        borderColor: "border-gray-400/30",
      },
      {
        id: "paladin",
        name: language === "es" ? "Paladín" : "Paladin",
        icon: "🛡️",
        bonus: language === "es" ? "+20% Defensa" : "+20% Defense",
        description:
          language === "es"
            ? "Guardián sagrado con resistencia superior."
            : "Sacred guardian with superior resistance.",
        bgColor: "from-blue-800/20 to-cyan-800/20",
        borderColor: "border-blue-400/30",
      },
    ]

    const alignments = [
      {
        id: "luz",
        name: language === "es" ? "Luz" : "Light",
        icon: "☀️",
        bonus: language === "es" ? "+10% Crecimiento de Población" : "+10% Population Growth",
        description: language === "es" ? "Camino de la pureza y el orden." : "Path of purity and order.",
        bgColor: "from-yellow-800/20 to-amber-800/20",
        borderColor: "border-yellow-400/30",
      },
      {
        id: "oscuridad",
        name: language === "es" ? "Oscuridad" : "Darkness",
        icon: "🌙",
        bonus: language === "es" ? "+10% Ataque" : "+10% Attack",
        description: language === "es" ? "Camino del caos y la destrucción." : "Path of chaos and destruction.",
        bgColor: "from-purple-900/20 to-indigo-950/20",
        borderColor: "border-purple-600/30",
      },
      {
        id: "neutral",
        name: language === "es" ? "Neutral" : "Neutral",
        icon: "⚖️",
        bonus: language === "es" ? "-10% Coste de Turnos" : "-10% Turn Cost",
        description: language === "es" ? "Camino del equilibrio y la pragmática." : "Path of balance and pragmatism.",
        bgColor: "from-gray-800/20 to-slate-800/20",
        borderColor: "border-gray-400/30",
      },
    ]

    return (
      <div className="space-y-6">
        {/* FACCIONES */}
        <div>
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
            {language === "es" ? "Las 8 Facciones" : "The 8 Factions"}
          </h2>
          <p className="text-gray-300 mb-6 italic">
            {language === "es"
              ? "En la era del Primer Conflicto, ocho grandes naciones emergieron de las cenizas del Caos Primordial. Cada una forjada por fuerzas antiguas, cada una destinada a luchar por el dominio absoluto..."
              : "In the age of the First Conflict, eight great nations emerged from the ashes of the Primordial Chaos. Each forged by ancient forces, each destined to fight for absolute dominion..."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factions.map((faction) => (
              <Card
                key={faction.id}
                className={`bg-gradient-to-r ${faction.bgColor} border-2 ${faction.borderColor} p-5`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{faction.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#d4af37] mb-2">{faction.name}</h3>
                    <p className="text-green-400 font-bold text-sm mb-2">{faction.bonus}</p>
                    <p className="text-gray-300 text-sm mb-3">{faction.description}</p>
                    <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                      <p className="text-xs text-gray-300 italic leading-relaxed">{faction.lore}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CLASES */}
        <div className="pt-6 border-t border-[#d4af37]/20">
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
            {language === "es" ? "Las 5 Clases" : "The 5 Classes"}
          </h2>
          <p className="text-gray-300 mb-6 italic">
            {language === "es"
              ? "El camino del poder se manifiesta de cinco formas. Elige tu especialización con sabiduría..."
              : "The path of power manifests in five ways. Choose your specialization wisely..."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <Card
                key={classItem.id}
                className={`bg-gradient-to-r ${classItem.bgColor} border-2 ${classItem.borderColor} p-4`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{classItem.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#d4af37] mb-1">{classItem.name}</h3>
                    <p className="text-green-400 font-bold text-sm mb-2">{classItem.bonus}</p>
                    <p className="text-gray-300 text-xs">{classItem.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ALINEAMIENTOS */}
        <div className="pt-6 border-t border-[#d4af37]/20">
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
            {language === "es" ? "Los 3 Alineamientos" : "The 3 Alignments"}
          </h2>
          <p className="text-gray-300 mb-6 italic">
            {language === "es"
              ? "La moral de tu imperio define su destino. Cada camino ofrece poder único..."
              : "Your empire's morality defines its destiny. Each path offers unique power..."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alignments.map((alignment) => (
              <Card
                key={alignment.id}
                className={`bg-gradient-to-r ${alignment.bgColor} border-2 ${alignment.borderColor} p-4`}
              >
                <div className="text-center">
                  <span className="text-4xl block mb-2">{alignment.icon}</span>
                  <h3 className="text-lg font-bold text-[#d4af37] mb-1">{alignment.name}</h3>
                  <p className="text-green-400 font-bold text-sm mb-2">{alignment.bonus}</p>
                  <p className="text-gray-300 text-xs">{alignment.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderResearchModal = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
          {language === "es" ? "Sistema de Investigación" : "Research System"}
        </h2>
        <p className="text-gray-300 mb-6">
          {language === "es"
            ? "MageLord cuenta con tres ramas de investigación que desbloquean el verdadero poder de tu imperio: Hechizos, Nivel de Magia y Academia Militar."
            : "MageLord features three research branches that unlock your empire's true power: Spells, Magic Level and Military Academy."}
        </p>

        {/* Investigación de Hechizos */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-2 border-purple-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">📜</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "1. Investigación de Hechizos" : "1. Spell Research"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "Seleccionas un hechizo de tu lista de 'Disponibles' y acumulas Puntos de Investigación (PI) para desbloquearlo."
                  : "Select a spell from your 'Available' list and accumulate Research Points (RP) to unlock it."}
              </p>
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                <p className="text-sm font-bold text-cyan-400 mb-2">
                  {language === "es" ? "Fórmula de Generación de PI:" : "RP Generation Formula:"}
                </p>
                <p className="text-lg font-mono text-white text-center py-2 bg-black/60 rounded">
                  PI/turno = (Torres de Mago × 5) + (Población × 0.01)
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-cyan-400 font-bold">Torres de Mago × 5:</span> Fuente principal de PI.
                  Recompensa la inversión en edificios mágicos.
                </p>
                <p>
                  <span className="text-cyan-400 font-bold">Población × 0.01:</span> Factor intelectual. Los imperios
                  grandes contribuyen al conocimiento.
                </p>
                <p className="text-green-400 italic">
                  Una vez acumulados los puntos necesarios, el hechizo pasa a tu 'Libro de Hechizos' y puedes lanzarlo
                  gastando Maná.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Nivel de Magia */}
        <Card className="bg-gradient-to-r from-indigo-900/20 to-violet-900/20 border-2 border-indigo-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">⚡</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "2. Nivel de Magia (ML)" : "2. Magic Level (ML)"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "No desbloquea nada nuevo, pero hace que lo que ya tienes sea más potente. Cada nivel cuesta exponencialmente más."
                  : "Doesn't unlock anything new, but makes what you have more powerful. Each level costs exponentially more."}
              </p>
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                <p className="text-sm font-bold text-cyan-400 mb-2">
                  {language === "es" ? "Fórmula de Coste de Nivel:" : "Level Cost Formula:"}
                </p>
                <p className="text-lg font-mono text-white text-center py-2 bg-black/60 rounded">
                  Coste = Nivel² × 1000 PI
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p className="text-yellow-400 font-bold">
                  {language === "es" ? "Impacto por Nivel:" : "Impact per Level:"}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>+5% Daño en hechizos de ataque</li>
                  <li>+5% Eficiencia en barreras mágicas</li>
                </ul>
                <p className="text-orange-400 italic mt-3">
                  {language === "es"
                    ? "Ejemplo: Nivel 1→2 cuesta 1.000 PI. Nivel 10→11 cuesta 100.000 PI. El crecimiento exponencial obliga a elegir: ¿Subir un nivel de magia o aprender 5 hechizos nuevos?"
                    : "Example: Level 1→2 costs 1,000 RP. Level 10→11 costs 100,000 RP. Exponential growth forces choice: Level up magic or learn 5 new spells?"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Academia Militar */}
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-2 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🎖️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "3. Academia Militar" : "3. Military Academy"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "Las tropas de élite no están disponibles desde el día 1. Debes investigar su 'patente' militar."
                  : "Elite troops aren't available from day 1. You must research their military 'patent'."}
              </p>
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                <table className="w-full text-sm text-gray-300">
                  <thead>
                    <tr className="border-b border-[#d4af37]/30">
                      <th className="text-left py-2 text-cyan-400">{language === "es" ? "Rango" : "Tier"}</th>
                      <th className="text-left py-2 text-cyan-400">
                        {language === "es" ? "Requisito" : "Requirement"}
                      </th>
                      <th className="text-left py-2 text-cyan-400">
                        {language === "es" ? "Ejemplo de Unidad" : "Unit Example"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 font-bold">Tier 1</td>
                      <td className="py-2 text-green-400">
                        {language === "es" ? "Inicial (Gratis)" : "Initial (Free)"}
                      </td>
                      <td className="py-2">Recluta / Milicia</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 font-bold">Tier 2</td>
                      <td className="py-2 text-yellow-400">
                        {language === "es" ? "Academia Nivel 5" : "Academy Level 5"}
                      </td>
                      <td className="py-2">Caballero / Ballestero</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 font-bold">Tier 3</td>
                      <td className="py-2 text-orange-400">
                        {language === "es" ? "Academia Nivel 12" : "Academy Level 12"}
                      </td>
                      <td className="py-2">Paladín / Mago de Guerra</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">Tier 4</td>
                      <td className="py-2 text-red-400">
                        {language === "es" ? "Academia Nivel 20 + Hechizo Único" : "Academy Level 20 + Unique Spell"}
                      </td>
                      <td className="py-2">Dragón / Demonio Mayor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p className="text-yellow-400 font-bold">
                  {language === "es" ? "Mejoras de Veteranía:" : "Veterancy Upgrades:"}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <span className="text-cyan-400">Investigación de Armaduras:</span> +10% Vida a todas las tropas de
                    ese Tier
                  </li>
                  <li>
                    <span className="text-cyan-400">Investigación de Armas:</span> +10% Ataque
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const renderMechanicsModal = () => {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
          {language === "es" ? "Mecánicas del Juego" : "Game Mechanics"}
        </h2>

        {/* Sistema de Exploración */}
        <Card className="bg-gradient-to-r from-green-900/20 to-teal-900/20 border-2 border-green-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🗺️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "Sistema de Exploración" : "Exploration System"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "El sistema de exploración de MageLord te permite expandir las fronteras de tu provincia invirtiendo turnos. El jugador decide cuántos turnos dedicar, y el sistema asigna automáticamente tropas por cada turno invertido."
                  : "MageLord's exploration system allows you to expand your province boundaries by investing turns. The player decides how many turns to dedicate, and the system automatically assigns troops for each turn invested."}
              </p>

              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                <p className="text-sm font-bold text-cyan-400 mb-2">
                  {language === "es" ? "La Fórmula de Expansión Territorial:" : "Territorial Expansion Formula:"}
                </p>
                <p className="text-lg font-mono text-white text-center py-2 bg-black/60 rounded mb-3">
                  {language === "es"
                    ? "Nueva Tierra = [(UnidadesAuto × 500) / Tierra Actual] × Turnos"
                    : "New Land = [(AutoUnits × 500) / Current Land] × Turns"}
                </p>
                <p className="text-sm text-cyan-300 text-center">
                  {language === "es"
                    ? "Donde UnidadesAuto = 20% de la Tierra Actual"
                    : "Where AutoUnits = 20% of Current Land"}
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <span className="text-cyan-400 font-bold">
                    {language === "es" ? "Turnos Seleccionados:" : "Selected Turns:"}
                  </span>{" "}
                  {language === "es"
                    ? "El jugador elige cuántos turnos invertir (ej. de 1 a 10)."
                    : "The player chooses how many turns to invest (e.g., from 1 to 10)."}
                </p>
                <p>
                  <span className="text-cyan-400 font-bold">{language === "es" ? "UnidadesAuto:" : "AutoUnits:"}</span>{" "}
                  {language === "es"
                    ? "El sistema asigna automáticamente el 20% de tu tierra actual como tropas de escolta. Estas tropas quedan 'fuera de combate' durante la exploración."
                    : "The system automatically assigns 20% of your current land as escort troops. These troops are 'out of combat' during exploration."}
                </p>
                <p>
                  <span className="text-cyan-400 font-bold">{language === "es" ? "Factor:" : "Factor:"}</span>{" "}
                  {language === "es"
                    ? "Una constante de equilibrio (ajustada a 500) que determina la velocidad de progresión del servidor."
                    : "A balance constant (set to 500) that determines server progression speed."}
                </p>
                <p>
                  <span className="text-cyan-400 font-bold">
                    {language === "es" ? "Tierra Actual:" : "Current Land:"}
                  </span>{" "}
                  {language === "es"
                    ? "El divisor crítico. A medida que tu provincia crece, el denominador aumenta, haciendo que cada turno de exploración sea menos eficiente."
                    : "The critical divisor. As your province grows, the denominator increases, making each exploration turn less efficient."}
                </p>
              </div>

              <div className="mt-4 bg-purple-900/20 border border-purple-500/30 p-4">
                <p className="text-sm font-bold text-purple-400 mb-2">
                  {language === "es" ? "Ejemplo de Cálculo:" : "Calculation Example:"}
                </p>
                <div className="space-y-2 text-xs text-gray-300">
                  <div>
                    <p className="font-bold text-white">
                      {language === "es" ? "Caso A (Provincia Pequeña):" : "Case A (Small Province):"}
                    </p>
                    <p>{language === "es" ? "Tienes: 500 acres" : "You have: 500 acres"}</p>
                    <p>
                      {language === "es" ? "UnidadesAuto: 500 × 0.2 = 100 tropas" : "AutoUnits: 500 × 0.2 = 100 troops"}
                    </p>
                    <p>
                      {language === "es"
                        ? "Cálculo: [(100 × 500) / 500] × 3 = 300 acres nuevos"
                        : "Calculation: [(100 × 500) / 500] × 3 = 300 new acres"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      {language === "es" ? "Caso B (Provincia Grande):" : "Case B (Large Province):"}
                    </p>
                    <p>{language === "es" ? "Tienes: 5.000 acres" : "You have: 5,000 acres"}</p>
                    <p>
                      {language === "es"
                        ? "UnidadesAuto: 5.000 × 0.2 = 1.000 tropas"
                        : "AutoUnits: 5,000 × 0.2 = 1,000 troops"}
                    </p>
                    <p>
                      {language === "es"
                        ? "Cálculo: [(1,000 × 500) / 5,000] × 3 = 300 acres nuevos"
                        : "Calculation: [(1,000 × 500) / 5,000] × 3 = 300 new acres"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-orange-400 italic mt-3">
                  {language === "es"
                    ? "Conclusión técnica: Este sistema protege el equilibrio del juego. A mayor tamaño de imperio, menor es la eficiencia de exploración, obligando a los jugadores a recurrir al conflicto militar para seguir creciendo."
                    : "Technical conclusion: This system protects game balance. The larger the empire, the less efficient exploration becomes, forcing players to resort to military conflict to continue growing."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Sistema de Construcción */}
        <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-2 border-amber-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🏗️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "Sistema de Construcción por Turnos" : "Turn-Based Construction System"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "En este sistema, el jugador no compra edificios, sino que asigna 'mano de obra' durante un tiempo determinado."
                  : "In this system, the player doesn't buy buildings, but assigns 'labor' for a determined time."}
              </p>

              {/* Formula A: Construction Capacity */}
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es" ? "A. Capacidad de Construcción" : "A. Construction Capacity Formula"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es"
                    ? "Define cuántos edificios puedes levantar por cada turno invertido:"
                    : "Defines how many buildings you can raise per turn invested:"}
                </p>
                <div className="bg-black/60 p-3 rounded">
                  <p className="text-center font-mono text-white text-lg mb-2">
                    Edificios/Turno = [(Población × 0.05) / 10] + (Nivel Tecnología × 2)
                  </p>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>•</p>
                    {language === "es"
                      ? " Población: A mayor población, más trabajadores disponibles"
                      : " Population: More population, more available workers"}
                    <p>•</p>
                    {language === "es"
                      ? " Divisor (10): Ajusta el ritmo para que no sea instantáneo"
                      : " Divisor (10): Adjusts the pace so it's not instant"}
                    <p>•</p>
                    {language === "es"
                      ? " Tecnología: Bonus por investigaciones en la rama de 'Arquitectura'"
                      : " Technology: Bonus from research in the 'Architecture' branch"}
                  </div>
                </div>
              </div>

              {/* Formula B: Action Cost */}
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es" ? "B. Coste de la Acción" : "B. Action Cost"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es" ? "Cada turno de construcción consume:" : "Each construction turn consumes:"}
                </p>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    • <span className="text-yellow-400 font-bold">{language === "es" ? "Oro:" : "Gold:"}</span>{" "}
                    {language === "es"
                      ? "Un coste base por edificio multiplicado por la capacidad de ese turno"
                      : "A base cost per building multiplied by that turn's capacity"}
                  </p>
                  <p>
                    • <span className="text-green-400 font-bold">{language === "es" ? "Acres:" : "Acres:"}</span>{" "}
                    {language === "es"
                      ? "Se restan automáticamente de tus Acres Libres"
                      : "Automatically subtracted from your Free Acres"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sistema de Demolición */}
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-950/20 border-2 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">💣</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "Sistema de Demolición" : "Demolition System"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "La demolición permite reconfigurar tu estrategia eliminando edificios obsoletos para liberar espacio."
                  : "Demolition allows you to reconfigure your strategy by removing obsolete buildings to free up space."}
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-red-400 font-bold">{language === "es" ? "Propósito:" : "Purpose:"}</span>{" "}
                  {language === "es"
                    ? "Cambio de estrategia. Al principio necesitas muchas Granjas, pero en el 'late game' prefieres Fuertes o Torres de Mago."
                    : "Strategy change. At first you need many Farms, but in the 'late game' you prefer Forts or Mage Towers."}
                </p>
                <p>
                  <span className="text-red-400 font-bold">{language === "es" ? "Coste:" : "Cost:"}</span>{" "}
                  {language === "es"
                    ? "1 Turno de gestión administrativa por edificio demolido."
                    : "1 Turn of administrative management per demolished building."}
                </p>
                <p>
                  <span className="text-red-400 font-bold">{language === "es" ? "Beneficio:" : "Benefit:"}</span>{" "}
                  {language === "es"
                    ? "El acre de tierra ocupado vuelve al estado 'Libre', permitiendo la construcción de una estructura diferente."
                    : "The acre of land returns to 'Free' state, allowing construction of a different structure."}
                </p>
                <p>
                  <span className="text-red-400 font-bold">{language === "es" ? "Recuperación:" : "Recovery:"}</span>{" "}
                  {language === "es"
                    ? "No recuperas oro. La demolición es puramente una decisión de espacio estratégico."
                    : "You don't recover gold. Demolition is purely a strategic space decision."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const renderMilitaryModal = () => {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
          {language === "es" ? "El Sistema de Entrenamiento de MageLord" : "MageLord's Training System"}
        </h2>
        <p className="text-gray-300 text-lg">
          {language === "es"
            ? "En MageLord, el ejército no aparece de la nada; es el resultado de transformar tu Población Civil en Fuerza Militar mediante el uso de infraestructuras y recursos."
            : "In MageLord, the army doesn't appear out of nowhere; it's the result of transforming your Civilian Population into Military Force through the use of infrastructure and resources."}
        </p>

        {/* Los Pilares del Entrenamiento */}
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-2 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">⚔️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es" ? "1. Los Pilares del Entrenamiento" : "1. The Pillars of Training"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "Para entrenar, el sistema debe validar tres factores simultáneamente:"
                  : "To train, the system must validate three factors simultaneously:"}
              </p>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">
                    {language === "es" ? "Materia Prima (Ciudadanos):" : "Raw Material (Citizens):"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Solo puedes entrenar si tienes ciudadanos disponibles (desempleados). Cada soldado entrenado reduce tu población civil en 1 unidad."
                      : "You can only train if you have available citizens (unemployed). Each trained soldier reduces your civilian population by 1 unit."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">
                    {language === "es" ? "Capacidad Logística (Cuarteles):" : "Logistical Capacity (Barracks):"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Tus Cuarteles determinan cuántas tropas puedes entrenar por cada Turno invertido."
                      : "Your Barracks determine how many troops you can train per Turn invested."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">
                    {language === "es" ? "Recursos Financieros:" : "Financial Resources:"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Cada unidad tiene un coste de Oro y, en niveles superiores, de Maná."
                      : "Each unit has a Gold cost and, at higher levels, Mana."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Fórmulas Técnicas */}
        <Card className="bg-gradient-to-r from-indigo-900/20 to-violet-900/20 border-2 border-indigo-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">📐</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es" ? "2. Fórmulas Técnicas de Entrenamiento" : "2. Technical Training Formulas"}
              </h3>

              <div className="mb-6">
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es" ? "A. Capacidad de Entrenamiento por Turno" : "A. Training Capacity per Turn"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es"
                    ? "Define el límite máximo de tropas que puedes entrenar por cada turno según su complejidad:"
                    : "Defines the maximum limit of troops you can train per turn based on their complexity:"}
                </p>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20 space-y-2">
                  <p className="text-center font-mono text-white text-lg">
                    {language === "es"
                      ? "Tropas/Turno = Cuarteles × FactorTier"
                      : "Troops/Turn = Barracks × TierFactor"}
                  </p>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Tier 1: 50 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                    <p>• Tier 2: 20 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                    <p>• Tier 3: 10 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                    <p>• Tier 4: 2 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {language === "es"
                      ? "Si tienes 10 Cuarteles, puedes entrenar hasta 500 unidades T1 por turno."
                      : "If you have 10 Barracks, you can train up to 500 T1 units per turn."}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es"
                    ? "B. Coste de Entrenamiento (Ajustado por Facción)"
                    : "B. Training Cost (Adjusted by Faction)"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es"
                    ? "El coste base se ve modificado por la naturaleza de tu facción:"
                    : "The base cost is modified by your faction's nature:"}
                </p>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="text-center font-mono text-white text-lg mb-2">
                    {language === "es"
                      ? "CosteTotal = (TropasPorTurno × Turnos × CosteBase) × MultFacción"
                      : "TotalCost = (TroopsPerTurn × Turns × BaseCost) × FactionMult"}
                  </p>
                  <p className="text-xs text-gray-300">
                    •{" "}
                    {language === "es"
                      ? "Hordas de la Destrucción: Multiplicador de 0.85 (-15% de coste)"
                      : "Destruction Hordes: Multiplier of 0.85 (-15% cost)"}
                  </p>
                  <p className="text-xs text-gray-300">
                    •{" "}
                    {language === "es" ? "Otras Facciones: Multiplicador de 1.0" : "Other Factions: Multiplier of 1.0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Logística y Mantenimiento */}
        <Card className="bg-gradient-to-r from-orange-900/20 to-red-950/20 border-2 border-orange-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">💰</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es"
                  ? "3. Logística y Mantenimiento (El Desafío del 'Upkeep')"
                  : "3. Logistics and Maintenance (The 'Upkeep' Challenge)"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "Una vez reclutadas, las tropas generan un gasto constante cada Turno. Si el balance de tu Página de Estado es negativo, corres riesgos serios."
                  : "Once recruited, troops generate a constant expense each Turn. If your Status Page balance is negative, you run serious risks."}
              </p>
              <div className="bg-black/40 rounded border border-[#d4af37]/20 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#d4af37]/20">
                    <tr>
                      <th className="p-2 text-left text-[#d4af37]">{language === "es" ? "Concepto" : "Concept"}</th>
                      <th className="p-2 text-left text-[#d4af37]">
                        {language === "es" ? "Fórmula de Gasto por Turno" : "Expense Formula per Turn"}
                      </th>
                      <th className="p-2 text-left text-[#d4af37]">
                        {language === "es" ? "Efecto por Falta de Recurso" : "Effect from Resource Shortage"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-t border-[#d4af37]/10">
                      <td className="p-2 font-bold">{language === "es" ? "Sustento (Comida)" : "Sustenance (Food)"}</td>
                      <td className="p-2 font-mono">{language === "es" ? "Tropas × 1 comida" : "Troops × 1 food"}</td>
                      <td className="p-2 text-red-400">
                        {language === "es"
                          ? "Deserción: Las tropas mueren o huyen por hambre"
                          : "Desertion: Troops die or flee from hunger"}
                      </td>
                    </tr>
                    <tr className="border-t border-[#d4af37]/10">
                      <td className="p-2 font-bold">{language === "es" ? "Sueldo (Oro)" : "Salary (Gold)"}</td>
                      <td className="p-2 font-mono">
                        {language === "es" ? "Tropas × FactorTier" : "Troops × TierFactor"}
                      </td>
                      <td className="p-2 text-orange-400">
                        {language === "es"
                          ? "Baja Moral: -50% efectividad en combate"
                          : "Low Morale: -50% combat effectiveness"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>

        {/* Niveles de Tropas (Tiers) */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🎖️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es"
                  ? "4. Niveles de Tropas (Tiers) y Academia Militar"
                  : "4. Troop Tiers and Military Academy"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "El reclutamiento está bloqueado por tu progreso en la Academia Militar:"
                  : "Recruitment is locked by your progress in the Military Academy:"}
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="bg-black/40 p-3 rounded border border-green-500/30">
                  <p className="font-bold text-green-400">Tier 1 ({language === "es" ? "Básico" : "Basic"}):</p>
                  <p>
                    {language === "es"
                      ? "Disponible desde el inicio. Alta cantidad, baja calidad."
                      : "Available from start. High quantity, low quality."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-blue-500/30">
                  <p className="font-bold text-blue-400">
                    Tier 2 ({language === "es" ? "Profesional" : "Professional"}):
                  </p>
                  <p>
                    {language === "es"
                      ? "Requiere Academia Nivel 5. Unidades equilibradas."
                      : "Requires Academy Level 5. Balanced units."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-purple-500/30">
                  <p className="font-bold text-purple-400">Tier 3 ({language === "es" ? "Élite" : "Elite"}):</p>
                  <p>
                    {language === "es"
                      ? "Requiere Academia Nivel 12. Unidades muy potentes que consumen Maná en su mantenimiento."
                      : "Requires Academy Level 12. Very powerful units that consume Mana for maintenance."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/50">
                  <p className="font-bold text-[#d4af37]">Tier 4 ({language === "es" ? "Legendario" : "Legendary"}):</p>
                  <p>
                    {language === "es"
                      ? "Requiere Academia Nivel 20 + Hechizo Único. Unidades que pueden cambiar el rumbo de una guerra."
                      : "Requires Academy Level 20 + Unique Spell. Units that can change the course of a war."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-2 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">⚔️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es" ? "Sistema de Entrenamiento por Turnos" : "Turn-Based Training System"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "Al igual que en Archmage, entrenar es un proceso logístico. Seleccionas el tipo de tropa y cuántos turnos vas a dedicar a su entrenamiento."
                  : "Just like in Archmage, training is a logistical process. You select the troop type and how many turns you'll dedicate to their training."}
              </p>

              {/* Formula A: Effective Recruitment */}
              <div className="mb-6">
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es" ? "A. Fórmula de Entrenamiento Efectivo" : "A. Effective Training Formula"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es"
                    ? "Define cuántas tropas puedes entrenar por turno según su complejidad:"
                    : "Defines how many troops you can train per turn based on their complexity:"}
                </p>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="text-center font-mono text-white text-lg">
                    {language === "es"
                      ? "Tropas/Turno = Cuarteles × Factor Tier"
                      : "Troops/Turn = Barracks × Tier Factor"}
                  </p>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Tier 1: 50 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                    <p>• Tier 2: 20 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                    <p>• Tier 3: 10 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                    <p>• Tier 4: 2 {language === "es" ? "unidades/turno por cuartel" : "units/turn per barracks"}</p>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {language === "es"
                      ? "Si tienes 10 Cuarteles, puedes entrenar hasta 500 unidades T1 por turno."
                      : "If you have 10 Barracks, you can train up to 500 T1 units per turn."}
                  </p>
                </div>
              </div>

              {/* Formula B: Validation Requirements */}
              <div>
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es" ? "B. Requisitos de Validación" : "B. Validation Requirements"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es"
                    ? "Antes de ejecutar la inversión de turnos, el sistema comprueba:"
                    : "Before executing the turn investment, the system checks:"}
                </p>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20 text-sm text-gray-300 space-y-2">
                  <p>
                    •{" "}
                    <span className="text-green-400 font-bold">
                      {language === "es" ? "Ciudadanos Libres:" : "Free Citizens:"}
                    </span>{" "}
                    {language === "es"
                      ? "Debes tener al menos 1 ciudadano por cada tropa que el cálculo estima"
                      : "You must have at least 1 citizen per troop estimated by calculation"}
                  </p>
                  <p>
                    •{" "}
                    <span className="text-yellow-400 font-bold">{language === "es" ? "Oro/Maná:" : "Gold/Mana:"}</span>{" "}
                    {language === "es"
                      ? "El coste total de las tropas estimadas para todos los turnos seleccionados"
                      : "The total cost of estimated troops for all selected turns"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const renderCombatModal = () => {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
          {language === "es" ? "El Sistema de Combate de MageLord" : "MageLord's Combat System"}
        </h2>
        <p className="text-gray-300 text-lg">
          {language === "es"
            ? "El combate en MageLord hereda la profundidad estratégica de los clásicos de navegador. No es solo enviar tropas: cada ataque debe ser calculado, cada defensa preparada, y cada represalia ejecutada dentro del marco de honor del juego."
            : "Combat in MageLord inherits the strategic depth of classic browser games. It's not just about sending troops: every attack must be calculated, every defense prepared, and every retaliation executed within the game's honor framework."}
        </p>

        {/* El Flujo de Combate (UX) */}
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-2 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">⚔️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es" ? "1. El Flujo de Combate (UX)" : "1. The Combat Flow (UX)"}
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">
                    {language === "es" ? "Listado/Buscador:" : "Listing/Searcher:"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Una tabla con enemigos sugeridos de un rango de Networth similar al tuyo y un buscador por nombre."
                      : "A table with suggested enemies of similar Networth range and a name searcher."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">
                    {language === "es" ? "El Modal de Acción:" : "The Action Modal:"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Al hacer clic, se abre una ventana con: Pestaña Espionage (enviar espías), Pestaña Ataque (selectores para decidir qué porcentaje de tropas envías y el tipo de misión: Invasión, Saqueo o Asedio)."
                      : "Upon clicking, a window opens with: Espionage Tab (send spies), Attack Tab (sliders to decide what percentage of troops to send and mission type: Invasion, Pillage, or Siege)."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">
                    {language === "es" ? "El Informe de Batalla:" : "The Battle Report:"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Tras pulsar 'Lanzar Ataque', el modal se transforma en un pergamino de resultados mostrando estado (victoria/derrota), botín obtenido, bajas comparativas, tierra conquistada y edificios destruidos."
                      : "After clicking 'Launch Attack', the modal transforms into a results scroll showing status (victory/defeat), loot obtained, comparative casualties, land conquered, and buildings destroyed."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sistema de Represalias */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🔥</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es" ? "2. Sistema de Represalias (Retaliation)" : "2. Retaliation System"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "El sistema de represalias es la base de la diplomacia. No es caos total donde atacas a cualquiera sin consecuencias; el juego tiene reglas de honor y poder muy estrictas."
                  : "The retaliation system is the basis of diplomacy. It's not total chaos where you attack anyone without consequences; the game has very strict rules of honor and power."}
              </p>

              <div className="mb-6">
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es" ? "A. Tiempo de Represalia (48 horas)" : "A. Retaliation Window (48 hours)"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es"
                    ? "Si el Jugador A te ataca, se abre un 'vínculo de sangre' entre vosotros. Durante 48 horas, puedes atacarle sin importar el rango o el Networth."
                    : "If Player A attacks you, a 'blood bond' opens between you. For 48 hours, you can attack them regardless of range or Networth."}
                </p>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="text-sm text-gray-300">
                    {language === "es"
                      ? "En tu Historial de Combates, estos enemigos aparecen marcados en rojo con un botón directo de 'REPRESALIA' y la cuenta atrás del tiempo restante."
                      : "In your Combat History, these enemies appear marked in red with a direct 'RETALIATION' button and the remaining time countdown."}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-cyan-400 mb-2">
                  {language === "es" ? "B. Rango de Ataque (Attack Range)" : "B. Attack Range"}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {language === "es"
                    ? "Solo puedes atacar a jugadores dentro de un rango de tu propio Networth (normalmente entre 80% y 120% de tu poder)."
                    : "You can only attack players within a range of your own Networth (normally between 80% and 120% of your power)."}
                </p>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="text-sm text-gray-300 font-mono text-center">
                    {language === "es"
                      ? "Rango Válido = 0.8 × TuNetworth ≤ Objetivo ≤ 1.2 × TuNetworth"
                      : "Valid Range = 0.8 × YourNetworth ≤ Target ≤ 1.2 × YourNetworth"}
                  </p>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {language === "es"
                      ? "Excepción: La represalia 'rompe' las reglas de rango durante 48 horas."
                      : "Exception: Retaliation 'breaks' range rules for 48 hours."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sistema de Protección */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-2 border-blue-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🛡️</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es" ? "3. Sistema de Protección" : "3. Protection System"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "Existen tres estados que impiden que jugadores fuertes abusen de los débiles:"
                  : "There are three states that prevent strong players from abusing the weak:"}
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-black/40 p-3 rounded border border-green-500/30">
                  <p className="font-bold text-green-400 mb-1">
                    {language === "es" ? "Protección de Novato (3 días)" : "Newbie Protection (3 days)"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Durante los primeros 3 días tras el registro, nadie puede atacarte y tú no puedes atacar a nadie. Si atacas, pierdes la protección inmediatamente."
                      : "During the first 3 days after registration, no one can attack you and you cannot attack anyone. If you attack, you lose protection immediately."}
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded border border-orange-500/30">
                  <p className="font-bold text-orange-400 mb-1">
                    {language === "es" ? "Protección por Derrota (12-24 horas)" : "Defeat Protection (12-24 hours)"}
                  </p>
                  <p>
                    {language === "es"
                      ? "Si pierdes más del 10-15% de tu Tierra Total en 24 horas, entras en protección temporal para reconstruir. Si atacas, pierdes la protección."
                      : "If you lose more than 10-15% of your Total Land in 24 hours, you enter temporary protection to rebuild. If you attack, you lose protection."}
                  </p>
                  <div className="bg-black/60 p-2 rounded border border-[#d4af37]/20 mt-2">
                    <p className="font-mono text-xs text-center">
                      % {language === "es" ? "Pérdida" : "Loss"} = ({language === "es" ? "Tierra Perdida" : "Land Lost"}{" "}
                      / {language === "es" ? "Tierra Inicial" : "Initial Land"}) × 100
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      {language === "es"
                        ? "Si el resultado es > 10%, se activa is_protected = true"
                        : "If result is > 10%, is_protected = true is activated"}
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded border border-purple-500/30">
                  <p className="font-bold text-purple-400 mb-1">
                    {language === "es" ? "Relaciones de Alianza" : "Alliance Relations"}
                  </p>
                  <p>
                    {language === "es"
                      ? "No puedes atacar a miembros de tu propio gremio o aliados. El sistema bloquea la acción automáticamente."
                      : "You cannot attack members of your own guild or allies. The system automatically blocks the action."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Lógica de Tropas en Viaje */}
        <Card className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border-2 border-amber-500/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🏃</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
                {language === "es"
                  ? "4. Lógica de 'Tropas en Viaje' (Army Out)"
                  : "4. 'Army Out' Logic (Troops Traveling)"}
              </h3>
              <p className="text-gray-300 mb-4">
                {language === "es"
                  ? "El ejército no vuelve al instante. Este es uno de los elementos tácticos más importantes del juego."
                  : "The army doesn't return instantly. This is one of the most important tactical elements of the game."}
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">{language === "es" ? "Mecánica:" : "Mechanic:"}</p>
                  <p>
                    {language === "es"
                      ? "Al enviar el ataque, esas unidades desaparecen de tu Página de Estado y de tu Defensa."
                      : "When sending the attack, those units disappear from your Status Page and your Defense."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-[#d4af37]/20">
                  <p className="font-bold text-cyan-400 mb-1">
                    {language === "es" ? "Tiempo de Retorno:" : "Return Time:"}
                  </p>
                  <p>
                    {language === "es"
                      ? "En la Sala de Guerra aparecerá un temporizador: 'Tu ejército regresará en 12 turnos'."
                      : "In the War Room a timer will appear: 'Your army will return in 12 turns'."}
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-red-500/30">
                  <p className="font-bold text-red-400 mb-1">{language === "es" ? "Riesgo:" : "Risk:"}</p>
                  <p>
                    {language === "es"
                      ? "Si alguien te ataca mientras tu ejército está fuera, solo te defenderás con las tropas que quedaron en casa (el 'Home Guard'). Esto hace que enviar todo tu ejército sea muy peligroso."
                      : "If someone attacks you while your army is out, you'll only defend with the troops left at home (the 'Home Guard'). This makes sending your entire army very dangerous."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const renderMagicModal = () => {
    return (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={() => setActiveSection(null)}
      >
        <div
          className="bg-[#1a1a1a] border-2 border-[#d4af37] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#d4af37]/30 p-6 flex justify-between items-center z-10">
            <h2 className="text-3xl font-bold text-[#d4af37]">
              {language === "es" ? "Sistema de Magia" : "Magic System"}
            </h2>
            <button
              onClick={() => setActiveSection(null)}
              className="text-[#d4af37] hover:text-[#f4cf5f] text-3xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="p-8 space-y-8">
            <p className="text-gray-300">
              {language === "es"
                ? "El sistema de magia de MageLord se divide en tres categorías principales: hechizos instantáneos, rituales de largo plazo y cooldowns de habilidades poderosas."
                : "MageLord's magic system is divided into three main categories: instant spells, long-term rituals, and cooldowns for powerful abilities."}
            </p>

            {/* Libro de Hechizos */}
            <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-2 border-purple-500/30 p-6">
              <div className="flex items-start gap-4">
                <span className="text-5xl">📖</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                    {language === "es" ? "Libro de Hechizos" : "Spellbook"}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {language === "es"
                      ? "Biblioteca visual de tu poder arcano organizada en pestañas funcionales: Economía, Combate y Encantamientos."
                      : "Visual library of your arcane power organized in functional tabs: Economy, Combat, and Enchantments."}
                  </p>

                  <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                    <h4 className="text-lg font-bold text-cyan-400 mb-3">
                      {language === "es" ? "Fórmulas Mágicas:" : "Magical Formulas:"}
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-yellow-400 font-bold mb-1">
                          {language === "es" ? "Probabilidad de Éxito:" : "Success Probability:"}
                        </p>
                        <p className="font-mono text-white bg-black/60 p-2 rounded text-center">
                          50% + (Tu Nivel - Nivel Enemigo) × 5%
                        </p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold mb-1">
                          {language === "es" ? "Potencia de Hechizo:" : "Spell Power:"}
                        </p>
                        <p className="text-gray-300">
                          {language === "es"
                            ? "El daño o beneficio escala +5% por cada Nivel de Magia por encima del requisito base."
                            : "Damage or benefit scales +5% for each Magic Level above base requirement."}
                        </p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold mb-1">
                          {language === "es" ? "Mantenimiento:" : "Maintenance:"}
                        </p>
                        <p className="font-mono text-white bg-black/60 p-2 rounded text-center">
                          {language === "es"
                            ? "Consumo Total = Suma(Coste/Turno de cada Encantamiento)"
                            : "Total Consumption = Sum(Cost/Turn of each Enchantment)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Rituales */}
            <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-2 border-red-500/30 p-6">
              <div className="flex items-start gap-4">
                <span className="text-5xl">🔥</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                    {language === "es" ? "Rituales" : "Rituals"}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {language === "es"
                      ? "Proyectos a largo plazo que requieren inversión constante de turnos y maná. El ritual solo surte efecto al llegar al 100% de progreso."
                      : "Long-term projects requiring constant investment of turns and mana. The ritual only takes effect upon reaching 100% progress."}
                  </p>

                  <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                    <h4 className="text-lg font-bold text-cyan-400 mb-3">
                      {language === "es" ? "Mecánica de Rituales:" : "Ritual Mechanics:"}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-yellow-400 font-bold">
                          {language === "es" ? "Coste de Activación:" : "Activation Cost:"}
                        </span>{" "}
                        {language === "es"
                          ? "Requiere una cantidad inicial de Maná para comenzar."
                          : "Requires an initial amount of Mana to begin."}
                      </p>
                      <p>
                        <span className="text-yellow-400 font-bold">
                          {language === "es" ? "Progreso por Turno:" : "Progress per Turn:"}
                        </span>{" "}
                        Progreso = {language === "es" ? "Turnos Invertidos" : "Turns Invested"}
                      </p>
                      <p className="text-orange-400 italic">
                        {language === "es"
                          ? "Ejemplo (Legiones Infernales): 'Llamada del Vacío' (20 turnos) invoca una unidad Tier 4 gratis."
                          : "Example (Infernal Legions): 'Void Summoning' (20 turns) summons a free Tier 4 unit."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cooldowns */}
            <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-2 border-blue-500/30 p-6">
              <div className="flex items-start gap-4">
                <span className="text-5xl">⏱️</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#d4af37] mb-3">Cooldowns</h3>
                  <p className="text-gray-300 mb-4">
                    {language === "es"
                      ? "Panel de monitorización que informa cuándo podrás volver a ejecutar acciones críticas con tiempo de espera obligatorio."
                      : "Monitoring panel that informs when you can execute critical actions with mandatory waiting periods again."}
                  </p>

                  <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20 mb-4">
                    <h4 className="text-lg font-bold text-cyan-400 mb-3">
                      {language === "es" ? "Categorías de Bloqueo:" : "Lockout Categories:"}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-yellow-400 font-bold">
                          {language === "es" ? "Hechizos de Élite:" : "Elite Spells:"}
                        </span>{" "}
                        {language === "es"
                          ? "Ej: 'Apocalipsis' - Disponible en 04:20:15"
                          : "E.g.: 'Apocalypse' - Available in 04:20:15"}
                      </p>
                      <p>
                        <span className="text-yellow-400 font-bold">
                          {language === "es" ? "Sabotaje:" : "Sabotage:"}
                        </span>{" "}
                        {language === "es"
                          ? "Ej: 'Robo de Oro' - Disponible en 00:15:00"
                          : "E.g.: 'Gold Theft' - Available in 00:15:00"}
                      </p>
                      <p>
                        <span className="text-yellow-400 font-bold">
                          {language === "es" ? "Habilidades Especiales:" : "Special Abilities:"}
                        </span>{" "}
                        {language === "es"
                          ? "Ej: 'Invocación de Diablillos' del Pit Lord"
                          : "E.g.: 'Imp Summoning' from Pit Lord"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 p-4 rounded border border-blue-500/30">
                    <p className="text-sm text-blue-300">
                      <span className="font-bold">{language === "es" ? "Lógica de Backend:" : "Backend Logic:"}</span>{" "}
                      {language === "es"
                        ? "Tiempo Restante = (Timestamp Inicial + Duración Cooldown) - Tiempo Actual"
                        : "Time Remaining = (Initial Timestamp + Cooldown Duration) - Current Time"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderModal = () => {
    if (!activeSection) return null

    const modalContent = {
      lore: renderLoreModal(),
      research: renderResearchModal(),
      mechanics: renderMechanicsModal(),
      military: renderMilitaryModal(),
      combat: renderCombatModal(),
      marketplace: renderMarketplaceModal(),
      diplomacy: renderDiplomacyModal(),
      magic: renderMagicModal(), // Add magic modal rendering
    }

    return (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveSection(null)
        }}
      >
        <div className="bg-[#1a1a1a] border-2 border-[#d4af37] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={() => setActiveSection(null)}
            className="absolute top-4 right-4 text-[#d4af37] hover:text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="p-8">{modalContent[activeSection]}</div>
        </div>
      </div>
    )
  }

  const renderMarketplaceModal = () => {
    return (
      <div className="space-y-8">
        <div className="text-center border-b border-[#d4af37]/30 pb-4">
          <h1 className="text-4xl font-bold text-[#d4af37] mb-2">
            {language === "es" ? "Sistema de Mercado" : "Marketplace System"}
          </h1>
          <p className="text-gray-400 italic">
            {language === "es"
              ? "El comercio es poder. Dos mercados, dos estrategias de dominación económica."
              : "Trade is power. Two markets, two strategies for economic domination."}
          </p>
        </div>

        {/* MERCADO GLOBAL */}
        <div>
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7" />
            {language === "es" ? "Mercado Global (P2P)" : "Global Market (P2P)"}
          </h2>

          <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-2 border-yellow-600/30 p-6 rounded-lg mb-4">
            <p className="text-gray-300 mb-4">
              {language === "es"
                ? "Sistema de intercambio peer-to-peer donde los jugadores comercian entre sí para equilibrar excedentes de recursos."
                : "Peer-to-peer exchange system where players trade with each other to balance resource surpluses."}
            </p>

            <div className="space-y-4">
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  {language === "es" ? "Mecánica de Comercio" : "Trading Mechanics"}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Ofertas de Venta: Los jugadores publican recursos (Oro, Comida, Maná) a cambio de otros recursos."
                        : "Sale Offers: Players post resources (Gold, Food, Mana) in exchange for other resources."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Impuesto de Comercio: El sistema cobra un 5% del recurso vendido para prevenir transferencias masivas entre cuentas."
                        : "Trade Tax: The system charges 5% of the sold resource to prevent massive transfers between accounts."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Coste de Turnos: Publicar o aceptar una oferta consume 1 Turno (representa tiempo de transporte)."
                        : "Turn Cost: Publishing or accepting an offer consumes 1 Turn (represents transport time)."}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-4 rounded border border-green-500/30">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Fórmula de Impuesto" : "Tax Formula"}
                </h3>
                <div className="bg-black/60 p-4 rounded font-mono text-green-400 text-sm">
                  {language === "es" ? "Recurso Recibido" : "Resource Received"} ={" "}
                  {language === "es" ? "Cantidad Vendida" : "Sold Amount"} × 0.95
                </div>
                <p className="text-gray-400 text-xs mt-2 italic">
                  {language === "es"
                    ? "(El vendedor recibe el 95%, el 5% se pierde como impuesto del sistema)"
                    : "(The seller receives 95%, 5% is lost as system tax)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MERCADO NEGRO */}
        <div className="border-t border-[#d4af37]/30 pt-6">
          <h2 className="text-3xl font-bold text-red-500 mb-4 flex items-center gap-2">
            <span className="text-4xl">🌑</span>
            {language === "es" ? "Mercado Negro (Subastas)" : "Black Market (Auctions)"}
          </h2>

          <div className="bg-gradient-to-r from-purple-950/40 to-red-950/40 border-2 border-red-700/50 p-6 rounded-lg">
            <p className="text-gray-300 mb-4">
              {language === "es"
                ? "El epicentro de la economía clandestina. Subastas en tiempo real de artefactos prohibidos, patentes y mercenarios."
                : "The epicenter of the clandestine economy. Real-time auctions of forbidden artifacts, patents and mercenaries."}
            </p>

            <div className="space-y-4">
              <div className="bg-black/60 p-4 rounded border border-red-600/30">
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  {language === "es" ? "Sistema de Subastas" : "Auction System"}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Generación: Nuevo lote cada 4 horas con duración de 2-24 horas."
                        : "Generation: New lot every 4 hours with 2-24 hour duration."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Pujas: Cada puja debe superar la anterior en mínimo 10%. El oro queda bloqueado hasta que otro jugador supere tu oferta."
                        : "Bids: Each bid must exceed the previous by at least 10%. Gold is locked until another player outbids you."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Anti-Snipe: Si alguien puja con menos de 2 minutos restantes, el temporizador se reinicia a 2 minutos."
                        : "Anti-Snipe: If someone bids with less than 2 minutes remaining, the timer resets to 2 minutes."}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/60 p-4 rounded border border-purple-600/30">
                <h3 className="text-xl font-bold text-purple-400 mb-2">
                  {language === "es" ? "Catálogo de Adquisiciones" : "Acquisition Catalog"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-3 rounded border border-purple-500/20">
                    <h4 className="text-[#d4af37] font-bold mb-1">
                      {language === "es" ? "Patentes & Grimorios" : "Patents & Grimoires"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Desbloquea unidades y hechizos de otras facciones. Los hechizos cruzados tienen +50% coste de maná y +15% probabilidad de fallo."
                        : "Unlock units and spells from other factions. Cross spells have +50% mana cost and +15% fail chance."}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-3 rounded border border-amber-600/20">
                    <h4 className="text-[#d4af37] font-bold mb-1">
                      {language === "es" ? "Artefactos Mágicos" : "Magic Artifacts"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Armas, armaduras, estandartes y reliquias que otorgan bonos pasivos a ataque, defensa o producción."
                        : "Weapons, armor, banners and relics that grant passive bonuses to attack, defense or production."}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 p-3 rounded border border-red-600/20">
                    <h4 className="text-[#d4af37] font-bold mb-1">
                      {language === "es" ? "Mercenarios" : "Mercenaries"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Tropas que se unen instantáneamente a tu ejército sin consumir turnos de entrenamiento."
                        : "Troops that instantly join your army without consuming training turns."}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-900/20 to-slate-900/20 p-3 rounded border border-gray-600/20">
                    <h4 className="text-[#d4af37] font-bold mb-1">
                      {language === "es" ? "Recursos Prohibidos" : "Forbidden Resources"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Esclavos para aumentar población rápidamente y otros recursos ilegales del mercado clandestino."
                        : "Slaves to quickly increase population and other illegal resources from the black market."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Fórmulas del Mercado Negro" : "Black Market Formulas"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{language === "es" ? "Puja Mínima:" : "Minimum Bid:"}</p>
                    <div className="bg-black/60 p-3 rounded font-mono text-green-400 text-sm">
                      {language === "es" ? "Puja Mínima" : "Minimum Bid"} ={" "}
                      {language === "es" ? "Puja Actual" : "Current Bid"} × 1.10
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      {language === "es" ? "Penalización de Hechizos Cruzados:" : "Cross Spell Penalty:"}
                    </p>
                    <div className="bg-black/60 p-3 rounded font-mono text-red-400 text-sm">
                      {language === "es" ? "Coste Maná" : "Mana Cost"} ={" "}
                      {language === "es" ? "Coste Base" : "Base Cost"} × 1.5
                      <br />
                      {language === "es" ? "Probabilidad Fallo" : "Fail Chance"} = {language === "es" ? "Base" : "Base"}{" "}
                      + 15%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDiplomacyModal = () => {
    return (
      <div className="space-y-8">
        <div className="text-center border-b border-[#d4af37]/30 pb-4">
          <h1 className="text-4xl font-bold text-[#d4af37] mb-2">
            {language === "es" ? "Sistema de Diplomacia" : "Diplomacy System"}
          </h1>
          <p className="text-gray-400 italic">
            {language === "es"
              ? "La política es un arma más letal que cualquier espada. Forja alianzas o destruye imperios."
              : "Politics is a weapon deadlier than any sword. Forge alliances or destroy empires."}
          </p>
        </div>

        {/* MENSAJERÍA */}
        <div>
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
            <MessageSquare className="h-7 w-7" />
            {language === "es" ? "Correo Arcano (Mensajería)" : "Arcane Mail (Messaging)"}
          </h2>

          <div className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-2 border-cyan-600/30 p-6 rounded-lg mb-4">
            <p className="text-gray-300 mb-4">
              {language === "es"
                ? "Sistema de mensajería formal donde los pactos quedan registrados como prueba. Cada mensaje es un pergamino sellado que puede cambiar el destino de tu imperio."
                : "Formal messaging system where pacts are recorded as proof. Each message is a sealed scroll that can change your empire's destiny."}
            </p>

            <div className="space-y-4">
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  {language === "es" ? "Tipos de Mensajes" : "Message Types"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-950/30 p-3 rounded border border-blue-500/20">
                    <div className="text-2xl mb-1">📜</div>
                    <h4 className="text-[#d4af37] font-bold text-sm mb-1">
                      {language === "es" ? "Jugador" : "Player"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Comunicación directa entre archimagos. Pactos, amenazas y negociaciones."
                        : "Direct communication between archmages. Pacts, threats and negotiations."}
                    </p>
                  </div>
                  <div className="bg-purple-950/30 p-3 rounded border border-purple-500/20">
                    <div className="text-2xl mb-1">⚙️</div>
                    <h4 className="text-[#d4af37] font-bold text-sm mb-1">
                      {language === "es" ? "Sistema" : "System"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Notificaciones automáticas: espías capturados, ataques recibidos, recursos robados."
                        : "Automatic notifications: captured spies, received attacks, stolen resources."}
                    </p>
                  </div>
                  <div className="bg-red-950/30 p-3 rounded border border-red-500/20">
                    <div className="text-2xl mb-1">⚔️</div>
                    <h4 className="text-[#d4af37] font-bold text-sm mb-1">
                      {language === "es" ? "Represalia" : "Retaliation"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Mensaje de enemigos con ventana de venganza activa (48h). Aparece en rojo parpadeante."
                        : "Message from enemies with active revenge window (48h). Appears in blinking red."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-cyan-500/30">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Funcionalidades" : "Features"}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Buzón de Entrada/Salida: Gestiona mensajes recibidos y enviados con historial completo."
                        : "Inbox/Outbox: Manage received and sent messages with complete history."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Bloqueo/Ignorar: Evita el acoso de jugadores derrotados bloqueando comunicaciones."
                        : "Block/Ignore: Avoid harassment from defeated players by blocking communications."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Filtro de Represalia: Los mensajes de enemigos en ventana de venganza se destacan en rojo."
                        : "Retaliation Filter: Messages from enemies in revenge window are highlighted in red."}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* GREMIOS */}
        <div className="border-t border-[#d4af37]/30 pt-6">
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
            <Users className="h-7 w-7" />
            {language === "es" ? "Gremios (Guilds)" : "Guilds"}
          </h2>

          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-2 border-purple-600/30 p-6 rounded-lg">
            <p className="text-gray-300 mb-4">
              {language === "es"
                ? "Alianza formal de hasta 20-25 jugadores. Estar solo es ser una diana andante. Los gremios son la unidad política básica del juego."
                : "Formal alliance of up to 20-25 players. Being alone is being a walking target. Guilds are the basic political unit of the game."}
            </p>

            <div className="space-y-4">
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="text-xl font-bold text-purple-400 mb-2">
                  {language === "es" ? "Jerarquía del Gremio" : "Guild Hierarchy"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-yellow-950/30 p-3 rounded border border-yellow-600/30">
                    <div className="text-2xl mb-1">👑</div>
                    <h4 className="text-[#d4af37] font-bold text-sm mb-1">{language === "es" ? "Líder" : "Leader"}</h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Control total: disolver gremio, expulsar miembros, cambiar diplomacia y editar lema."
                        : "Total control: dissolve guild, expel members, change diplomacy and edit motto."}
                    </p>
                  </div>
                  <div className="bg-blue-950/30 p-3 rounded border border-blue-600/30">
                    <div className="text-2xl mb-1">⚜️</div>
                    <h4 className="text-[#d4af37] font-bold text-sm mb-1">
                      {language === "es" ? "Consejero" : "Counselor"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Puede invitar miembros y moderar el foro interno del gremio."
                        : "Can invite members and moderate the guild's internal forum."}
                    </p>
                  </div>
                  <div className="bg-gray-950/30 p-3 rounded border border-gray-600/30">
                    <div className="text-2xl mb-1">🛡️</div>
                    <h4 className="text-[#d4af37] font-bold text-sm mb-1">
                      {language === "es" ? "Miembro" : "Member"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Acceso al foro, defensa coordinada y bonos del gremio."
                        : "Access to forum, coordinated defense and guild bonuses."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  {language === "es" ? "Estadísticas y Poder" : "Statistics and Power"}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Networth Total del Gremio: Σ (sumatoria de todos los miembros). Define el poder del gremio en rankings."
                        : "Total Guild Networth: Σ (sum of all members). Defines guild power in rankings."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Territorio Total: Suma de acres de todos los miembros del gremio."
                        : "Total Territory: Sum of acres of all guild members."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Rango Mundial: Posición del gremio en el ranking global basado en Networth."
                        : "World Rank: Guild position in global ranking based on Networth."}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-4 rounded border border-purple-500/30">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Bono de Sinergia" : "Synergy Bonus"}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  {language === "es"
                    ? "Si el 70% de los miembros del gremio pertenecen a la misma facción, el gremio recibe un bonus pasivo especial:"
                    : "If 70% of guild members belong to the same faction, the guild receives a special passive bonus:"}
                </p>
                <div className="bg-black/60 p-3 rounded border border-yellow-500/20">
                  <p className="text-yellow-400 font-bold text-sm">
                    {language === "es"
                      ? "Ejemplo: 'Horda Infernal' → +10% velocidad de reclutamiento de unidades Tier 1"
                      : "Example: 'Infernal Horde' → +10% recruitment speed for Tier 1 units"}
                  </p>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  {language === "es" ? "Diplomacia del Gremio" : "Guild Diplomacy"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-green-950/30 p-3 rounded">
                    <div className="text-2xl mb-1">🤝</div>
                    <h4 className="text-green-400 font-bold text-sm mb-1">
                      {language === "es" ? "Aliados" : "Allies"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "No pueden atacarse entre sí. El sistema bloquea automáticamente los ataques."
                        : "Cannot attack each other. System automatically blocks attacks."}
                    </p>
                  </div>
                  <div className="bg-blue-950/30 p-3 rounded">
                    <div className="text-2xl mb-1">🕊️</div>
                    <h4 className="text-blue-400 font-bold text-sm mb-1">
                      {language === "es" ? "Pacto PNA" : "NAP Pact"}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Pacto de No Agresión temporal. Romperlo antes de tiempo aplica penalización."
                        : "Temporary Non-Aggression Pact. Breaking early applies penalty."}
                    </p>
                  </div>
                  <div className="bg-red-950/30 p-3 rounded">
                    <div className="text-2xl mb-1">⚔️</div>
                    <h4 className="text-red-400 font-bold text-sm mb-1">{language === "es" ? "Guerra" : "War"}</h4>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Gremios enemigos marcados. Ataques dan +5% de moral (daño bonus)."
                        : "Marked enemy guilds. Attacks give +5% morale (bonus damage)."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Fórmulas del Gremio" : "Guild Formulas"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      {language === "es" ? "Networth del Gremio:" : "Guild Networth:"}
                    </p>
                    <div className="bg-black/60 p-3 rounded font-mono text-green-400 text-sm">
                      NW {language === "es" ? "Gremio" : "Guild"} = Σ NW {language === "es" ? "Miembros" : "Members"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      {language === "es" ? "Coste de Ruptura de Pacto:" : "Pact Break Cost:"}
                    </p>
                    <div className="bg-black/60 p-3 rounded font-mono text-red-400 text-sm">
                      {language === "es" ? "Debuff Deshonor" : "Dishonor Debuff"}: -20%{" "}
                      {language === "es" ? "Producción Oro" : "Gold Production"} × 24h
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      {language === "es" ? "Límite de Miembros:" : "Member Limit:"}
                    </p>
                    <div className="bg-black/60 p-3 rounded font-mono text-yellow-400 text-sm">
                      {language === "es" ? "Máximo" : "Maximum"}: 20-25 {language === "es" ? "jugadores" : "players"}
                    </div>
                    <p className="text-gray-400 text-xs mt-2 italic">
                      {language === "es"
                        ? "(Evita que un solo gremio domine todo el servidor)"
                        : "(Prevents a single guild from dominating the entire server)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  {language === "es" ? "Muro del Gremio (Foro Privado)" : "Guild Wall (Private Forum)"}
                </h3>
                <p className="text-gray-300 text-sm">
                  {language === "es"
                    ? "Sistema de mensajes rápidos estilo tablón donde solo los miembros pueden leer y escribir. Es donde se pegan informes de batalla para pedir ayuda, se coordinan ataques masivos y se comparten estrategias secretas."
                    : "Quick message board system where only members can read and write. This is where battle reports are posted to ask for help, massive attacks are coordinated and secret strategies are shared."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d4af37]/30 pt-6">
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
            <Trophy className="h-7 w-7" />
            {language === "es" ? "El Panteón (Rankings)" : "The Pantheon (Rankings)"}
          </h2>

          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-2 border-yellow-600/30 p-6 rounded-lg">
            <p className="text-gray-300 mb-4">
              {language === "es"
                ? "El ranking no solo sirve para presumir; es la herramienta para buscar objetivos y medir el poder del servidor."
                : "Rankings aren't just for showing off; they're the tool to find targets and measure server power."}
            </p>

            <div className="space-y-4">
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  {language === "es" ? "Tipos de Rankings" : "Ranking Types"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-yellow-950/30 p-3 rounded border border-yellow-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      <h4 className="text-[#d4af37] font-bold text-sm">
                        {language === "es" ? "Poder General (Networth)" : "General Power (Networth)"}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Clasificación principal basada en Σ (Tierra + Edificios + Tropas + Oro). El ranking de 'quién manda'."
                        : "Main ranking based on Σ (Land + Buildings + Troops + Gold). The 'who's boss' ranking."}
                    </p>
                  </div>
                  <div className="bg-red-950/30 p-3 rounded border border-red-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Swords className="h-5 w-5 text-red-400" />
                      <h4 className="text-[#d4af37] font-bold text-sm">
                        {language === "es" ? "Poder Militar" : "Military Power"}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Solo valor de tropas. Útil para identificar a los jugadores más peligrosos en combate."
                        : "Troop value only. Useful for identifying the most dangerous players in combat."}
                    </p>
                  </div>
                  <div className="bg-green-950/30 p-3 rounded border border-green-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-green-400" />
                      <h4 className="text-[#d4af37] font-bold text-sm">
                        {language === "es" ? "Ranking Territorial" : "Territorial Ranking"}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Quién tiene más acres. Suele ser el objetivo de las Invasiones."
                        : "Who has the most acres. Usually the target of Invasions."}
                    </p>
                  </div>
                  <div className="bg-amber-950/30 p-3 rounded border border-amber-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="h-5 w-5 text-amber-400" />
                      <h4 className="text-[#d4af37] font-bold text-sm">
                        {language === "es" ? "Ranking de Tesorería" : "Treasury Ranking"}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Los más ricos en oro y recursos. Objetivos ideales para misiones de Latrocinio."
                        : "The richest in gold and resources. Ideal targets for Theft missions."}
                    </p>
                  </div>
                  <div className="bg-purple-950/30 p-3 rounded border border-purple-600/30 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <h4 className="text-[#d4af37] font-bold text-sm">
                        {language === "es" ? "Poder de Gremio" : "Guild Power"}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {language === "es"
                        ? "Sumatoria Σ del Networth de todos los miembros del gremio."
                        : "Sum Σ of the Networth of all guild members."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  {language === "es" ? "Buscadores y Filtros Inteligentes" : "Smart Search and Filters"}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Buscador por Nombre: Encuentra a ese enemigo específico al que quieres aplicar Represalia."
                        : "Name Search: Find that specific enemy you want to retaliate against."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Filtro por Rango de Ataque: Botón 'Objetivos Disponibles' que solo muestra jugadores entre 80% y 120% de tu Networth (tu rango legal de ataque)."
                        : "Attack Range Filter: 'Available Targets' button showing only players between 80% and 120% of your Networth (your legal attack range)."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Filtro por Facción: Ver quién es el mejor entre las Legiones Infernales, Guardianes de la Escama, etc."
                        : "Faction Filter: See who's the best among Infernal Legions, Scale Guardians, etc."}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Interfaz del Ranking" : "Ranking Interface"}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Posición con Iconos Especiales: Coronas de Oro, Plata y Bronce para el Top 3."
                        : "Position with Special Icons: Gold, Silver and Bronze crowns for Top 3."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Identidad: Nombre de la Provincia y Tag del Gremio (ej: [HELL] Cipi)."
                        : "Identity: Province Name and Guild Tag (e.g.: [HELL] Cipi)."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Acciones Rápidas: Enviar Mensaje ✉️, Espiar 👁️, Atacar ⚔️ (solo si está en rango)."
                        : "Quick Actions: Send Message ✉️, Spy 👁️, Attack ⚔️ (only if in range)."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span>
                      {language === "es"
                        ? "Resaltado del Jugador Actual: Tu fila aparece con borde dorado brillante."
                        : "Current Player Highlight: Your row appears with bright golden border."}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Simplified header, removed redundant t.guideTitle */}
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.guide}</h1>
      {/* Removed redundant t.guideSubtitle */}
      <p className="text-gray-400">{t.guideDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card
            key={section.id}
            className={`cursor-pointer group hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${section.bgGradient} border-2 border-[#d4af37]/30 hover:border-[#d4af37]/60 overflow-hidden relative h-64`}
            onClick={() => setActiveSection(section.id)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ backgroundImage: `url(${section.image})` }}
            />
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <section.icon className={`h-8 w-8 ${section.color}`} />
                  <h3 className="text-2xl font-bold text-[#d4af37]">{section.title}</h3>
                </div>
                <p className="text-gray-300 text-sm">{section.description}</p>
              </div>
            </div>
          </Card>
        ))}

        <Card
          className="bg-cover bg-center cursor-pointer hover:scale-105 transition-transform"
          style={{
            backgroundImage: "url('/images/fantasy-wizard-casting-magic.jpg')",
          }}
          onClick={() => setActiveSection("magic")}
        >
          <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 min-h-[200px] flex flex-col justify-end">
            <h2 className="text-3xl font-bold text-[#d4af37] mb-2">
              {language === "es" ? "Sistema de Magia" : "Magic System"}
            </h2>
            <p className="text-gray-300">
              {language === "es"
                ? "Libro de hechizos, rituales y cooldowns arcanos."
                : "Spellbook, rituals and arcane cooldowns."}
            </p>
          </div>
        </Card>
      </div>

      {renderModal()}
    </div>
  )
}
