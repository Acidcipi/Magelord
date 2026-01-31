"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Sparkles, Users, Swords, Crown, Shield, TrendingUp, X, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { FACTIONS } from "@/lib/factions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CataclysmCountdown } from "@/components/cataclysm-countdown"
import { supabase } from "@/lib/supabaseClient"

interface PortadaPageProps {
  language: Language
  gameState?: any
}

export function PortadaPage({ language, gameState }: PortadaPageProps) {
  const t = useTranslation(language)
  const [activeFaction, setActiveFaction] = useState(0)
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null)
  const [researchQueue, setResearchQueue] = useState<any[]>([])
  const [stats, setStats] = useState({
    provinces: 1240,
    battles: 452,
    goldTraded: 2000000,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        provinces: prev.provinces + Math.floor(Math.random() * 3),
        battles: prev.battles + Math.floor(Math.random() * 2),
        goldTraded: prev.goldTraded + Math.floor(Math.random() * 10000),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadResearchQueue = async () => {
      if (!gameState?.province_id) return

      try {
        const { data, error } = await supabase
          .from("province_research_queue")
          .select("*")
          .eq("province_id", gameState.province_id)
          .gt("turns_remaining", 0)

        if (!error && data) {
          const enrichedData = await Promise.all(
            data.map(async (item) => {
              let name = item.target_type
              if (item.target_type === "UNIT") {
                const { data: unit } = await supabase
                  .from("master_units")
                  .select("name")
                  .eq("id", item.target_id)
                  .single()
                name = unit?.name || "Unidad Desconocida"
              } else if (item.target_type === "SPELL") {
                const { data: spell } = await supabase
                  .from("master_spells")
                  .select("name")
                  .eq("id", item.target_id)
                  .single()
                name = spell?.name || "Hechizo Desconocido"
              } else if (item.target_type === "RITUAL") {
                const { data: ritual } = await supabase
                  .from("master_rituals")
                  .select("name")
                  .eq("id", item.target_id)
                  .single()
                name = ritual?.name || "Ritual Desconocido"
              }
              return { ...item, targetName: name }
            }),
          )
          setResearchQueue(enrichedData || [])
        }
      } catch (error) {
        console.error("[v0] ❌ Error loading research queue:", error)
      }
    }

    loadResearchQueue()
  }, [gameState?.province_id])

  const factions = [
    {
      id: "infernal",
      name: FACTIONS.infernal.name,
      description: FACTIONS.infernal.description,
      color: FACTIONS.infernal.color,
      icon: FACTIONS.infernal.icon,
      image: "/images/infernal-legion-demon.jpg",
      bgGradient: "from-red-900/20 to-black",
    },
    {
      id: "celestial",
      name: FACTIONS.celestial.name,
      description: FACTIONS.celestial.description,
      color: FACTIONS.celestial.color,
      icon: FACTIONS.celestial.icon,
      image: "/images/celestial-angel.jpg",
      bgGradient: "from-yellow-900/20 to-black",
    },
    {
      id: "sangre",
      name: FACTIONS.sangre.name,
      description: FACTIONS.sangre.description,
      color: FACTIONS.sangre.color,
      icon: FACTIONS.sangre.icon,
      image: "/images/blood-vampire.jpg",
      bgGradient: "from-red-950/20 to-black",
    },
    {
      id: "destruccion",
      name: FACTIONS.destruccion.name,
      description: FACTIONS.destruccion.description,
      color: FACTIONS.destruccion.color,
      icon: FACTIONS.destruccion.icon,
      image: "/images/orc-warrior.jpg",
      bgGradient: "from-green-900/20 to-black",
    },
    {
      id: "ultratumba",
      name: FACTIONS.ultratumba.name,
      description: FACTIONS.ultratumba.description,
      color: FACTIONS.ultratumba.color,
      icon: FACTIONS.ultratumba.icon,
      image: "/images/undead-lich.jpg",
      bgGradient: "from-purple-900/20 to-black",
    },
    {
      id: "escama",
      name: FACTIONS.escama.name,
      description: FACTIONS.escama.description,
      color: FACTIONS.escama.color,
      icon: FACTIONS.escama.icon,
      image: "/images/dragon-guardian.jpg",
      bgGradient: "from-orange-900/20 to-black",
    },
    {
      id: "asuryan",
      name: FACTIONS.asuryan.name,
      description: FACTIONS.asuryan.description,
      color: FACTIONS.asuryan.color,
      icon: FACTIONS.asuryan.icon,
      image: "/images/high-elf-mage.jpg",
      bgGradient: "from-cyan-900/20 to-black",
    },
    {
      id: "hierro",
      name: FACTIONS.hierro.name,
      description: FACTIONS.hierro.description,
      color: FACTIONS.hierro.color,
      icon: FACTIONS.hierro.icon,
      image: "/images/dwarf-engineer.jpg",
      bgGradient: "from-gray-800/20 to-black",
    },
  ]

  const scrollToFactions = () => {
    document.getElementById("factions")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="space-y-0 -m-6">
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#1a0a0a] to-[#0a0a0a]"
        style={{
          backgroundImage: "url('/epic-fantasy-mage-wizard-with-golden-aura-casting-.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%", // Adjusted from center to 30% down to show full head
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-[#d4af37]" />
            <span className="text-[#d4af37] text-sm font-medium">
              {language === "es" ? "Servidor Alpha - Únete Ahora" : "Alpha Server - Join Now"}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-[#d4af37] mb-6 leading-tight text-balance">
            MAGELORD
            <br />
            <span className="text-4xl md:text-5xl bg-gradient-to-r from-[#d4af37] to-[#ffd700] bg-clip-text text-transparent">
              {language === "es" ? "El Renacer de los Archimagos" : "The Rise of the Archmages"}
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-[#d4af37] font-bold mb-4 text-pretty">
            {language === "es"
              ? "Donde la Magia Forja Imperios y la Estrategia Define Destinos"
              : "Where Magic Forges Empires and Strategy Defines Destinies"}
          </p>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
            {language === "es"
              ? "Estrategia masiva por turnos en un mundo vivo donde cada decisión cuenta. Domina artes arcanas prohibidas, forja alianzas legendarias, traiciona a tus enemigos y conquista el ranking global. Tu imperio te espera, Archimago."
              : "Massive turn-based strategy in a living world where every decision matters. Master forbidden arcane arts, forge legendary alliances, betray your enemies and conquer the global rankings. Your empire awaits, Archmage."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#d4af37] hover:bg-[#f4cf5f] text-black font-bold text-lg px-8 py-6 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-all duration-300"
            >
              {language === "es" ? "EMPEZAR MI REINO" : "START MY KINGDOM"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={scrollToFactions}
              variant="outline"
              className="border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-bold text-lg px-8 py-6 rounded-xl transition-all duration-300 bg-transparent"
            >
              {language === "es" ? "EXPLORAR FACCIONES" : "EXPLORE FACTIONS"}
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      {gameState && (
        <section className="py-8 px-6 bg-[#1a1a1a]">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-[#0a0a0a] border-[#d4af37]/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-[#d4af37]" />
                <h3 className="text-xl font-bold text-[#d4af37]">
                  {language === "es" ? "Estado de Investigaciones" : "Research Status"}
                </h3>
              </div>

              {researchQueue.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4 opacity-30">🔬</div>
                  <p className="text-gray-400">{language === "es" ? "Laboratorio inactivo" : "Laboratory inactive"}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {language === "es"
                      ? "Visita el Centro de Investigación para comenzar un proyecto"
                      : "Visit the Research Center to start a project"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {researchQueue.map((item) => {
                    const progress = ((item.total_turns - item.turns_remaining) / item.total_turns) * 100
                    return (
                      <div key={item.id} className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#d4af37] font-semibold">
                            {language === "es" ? "Investigando" : "Researching"}: {item.targetName || item.target_type}
                          </span>
                          <span className="text-sm text-gray-400">
                            {item.turns_remaining}/{item.total_turns} {language === "es" ? "turnos" : "turns"}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2 mb-2" />
                        <p className="text-xs text-gray-500">
                          {progress.toFixed(0)}% {language === "es" ? "completado" : "complete"} |{" "}
                          {language === "es" ? "Faltan" : "Remaining"}: {item.turns_remaining}{" "}
                          {language === "es" ? "turnos" : "turns"}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        </section>
      )}

      <section className="py-8 px-6 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <CataclysmCountdown />
        </div>
      </section>

      <section id="factions" className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-4">
              {language === "es" ? "Elige Tu Destino" : "Choose Your Destiny"}
            </h2>
            <p className="text-xl text-gray-400">
              {language === "es"
                ? "8 facciones únicas, cada una con su propia identidad, estrategia y camino hacia la victoria"
                : "8 unique factions, each with its own identity, strategy and path to victory"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {factions.map((faction, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveFaction(index)}
                onClick={() => setSelectedFaction(faction.id)}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-500 cursor-pointer group ${
                  activeFaction === index
                    ? "border-[#d4af37] scale-105 shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                    : "border-[#d4af37]/20 hover:border-[#d4af37]/50"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${faction.bgGradient})`,
                }}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={`/.jpg?key=no6fa&height=400&width=300&query=${encodeURIComponent(
                      faction.name + " fantasy character epic tier 4 unit",
                    )}`}
                    alt={faction.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Faction info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{faction.icon}</span>
                    <h3 className="text-xl font-bold" style={{ color: faction.color }}>
                      {faction.name}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs line-clamp-2">{faction.description}</p>
                </div>

                {/* Active indicator */}
                {activeFaction === index && (
                  <div className="absolute top-4 right-4">
                    <Crown className="h-8 w-8 text-[#d4af37] animate-pulse" />
                  </div>
                )}

                {/* Click hint */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-[#d4af37]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[#d4af37] text-xs font-medium">
                    {language === "es" ? "Click para detalles" : "Click for details"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-3">
              {language === "es" ? "Un Mundo Vivo" : "A Living World"}
            </h2>
            <p className="text-gray-400">
              {language === "es" ? "Estadísticas en tiempo real del servidor" : "Real-time server statistics"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-xl p-8 text-center hover:border-[#d4af37]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <Users className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
              <div className="text-4xl font-bold text-[#d4af37] mb-2">Σ {stats.provinces.toLocaleString()}</div>
              <p className="text-gray-400">{language === "es" ? "Provincias Activas" : "Active Provinces"}</p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-xl p-8 text-center hover:border-[#d4af37]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <Swords className="h-12 w-12 text-[#ff1744] mx-auto mb-4" />
              <div className="text-4xl font-bold text-[#ff1744] mb-2">⚔️ {stats.battles.toLocaleString()}</div>
              <p className="text-gray-400">{language === "es" ? "Batallas en 24h" : "Battles in 24h"}</p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-xl p-8 text-center hover:border-[#d4af37]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <TrendingUp className="h-12 w-12 text-[#4caf50] mx-auto mb-4" />
              <div className="text-4xl font-bold text-[#4caf50] mb-2">
                💎 {(stats.goldTraded / 1000000).toFixed(1)}M
              </div>
              <p className="text-gray-400">{language === "es" ? "Oro Comerciado Hoy" : "Gold Traded Today"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-4">
              {language === "es" ? "Características del Juego" : "Game Features"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-xl p-8 hover:border-[#d4af37]/50 transition-all duration-300 group">
              <div className="bg-[#d4af37]/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "Economía Real" : "Real Economy"}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {language === "es"
                  ? "Comercio P2P entre jugadores y Subastas en el Mercado Negro. Cada transacción impacta el servidor."
                  : "P2P trading between players and Black Market Auctions. Every transaction impacts the server."}
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-xl p-8 hover:border-[#d4af37]/50 transition-all duration-300 group">
              <div className="bg-[#d4af37]/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/20 transition-colors">
                <Sparkles className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "Magia Persistente" : "Persistent Magic"}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {language === "es"
                  ? "Rituales que toman días en completarse y hechizos que alteran el destino del servidor."
                  : "Rituals that take days to complete and spells that alter the fate of the server."}
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-xl p-8 hover:border-[#d4af37]/50 transition-all duration-300 group">
              <div className="bg-[#d4af37]/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/20 transition-colors">
                <Shield className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-bold text-[#d4af37] mb-3">
                {language === "es" ? "Diplomacia Total" : "Total Diplomacy"}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {language === "es"
                  ? "Alianzas, Gremios de hasta 25 miembros y traiciones que quedan registradas para siempre."
                  : "Alliances, Guilds of up to 25 members and betrayals that are recorded forever."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gradient-to-t from-[#0a0a0a] to-[#1a1a1a] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-6">
            {language === "es" ? "¿Listo para Forjar Tu Imperio?" : "Ready to Forge Your Empire?"}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {language === "es"
              ? "Únete a miles de jugadores en la batalla por la supremacía arcana"
              : "Join thousands of players in the battle for arcane supremacy"}
          </p>
          <Button
            size="lg"
            className="bg-[#d4af37] hover:bg-[#f4cf5f] text-black font-bold text-lg px-12 py-7 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-all duration-300"
          >
            {language === "es" ? "COMENZAR AHORA" : "START NOW"}
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Added dialog for faction details */}
      {selectedFaction && (
        <Dialog open={!!selectedFaction} onOpenChange={() => setSelectedFaction(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#d4af37]">
                {factions.find((f) => f.id === selectedFaction)?.name}
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-400 leading-relaxed">
              {factions.find((f) => f.id === selectedFaction)?.description}
            </p>
            <Button variant="outline" className="mt-6 bg-transparent" onClick={() => setSelectedFaction(null)}>
              {language === "es" ? "Cerrar" : "Close"}
              <X className="ml-2 h-4 w-4" />
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default PortadaPage
