"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Language } from "@/lib/i18n"
import { createBrowserClient } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  X,
  Eye,
  Sword,
  Mountain,
  TrendingUp,
  Flame,
  Skull,
  Swords,
  Filter,
  AlertCircle,
  Users,
  Shield,
  Sparkles,
  Package,
} from "lucide-react"

// --- COMPONENTES UI AUXILIARES ---
const CustomCard = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-[#1a1a1a]/80 border border-[#d4af37]/20 p-4 rounded-lg ${className || ""}`}>{children}</div>
)

const CustomButton = ({
  className,
  onClick,
  children,
  variant,
}: { className?: string; onClick?: () => void; children: React.ReactNode; variant?: string }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${variant === "outline" ? "border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10" : "bg-purple-600 hover:bg-purple-700 text-white"} ${className || ""}`}
  >
    {children}
  </button>
)

const CustomBadge = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={`px-2 py-1 rounded text-sm ${className || ""}`}>{children}</span>
)

const CustomAlert = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-4 rounded border ${className || ""}`}>{children}</div>
)

interface SalaGuerraPageProps {
  language: Language
  gameState?: any
  user?: any
  reloadGameState?: () => void
}

export function SalaGuerraPage({ language, gameState, user, reloadGameState }: SalaGuerraPageProps) {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [enemies, setEnemies] = useState<any[]>([])
  const [selectedEnemy, setSelectedEnemy] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados de Espionaje y Ataque
  const [spiesCount, setSpiesCount] = useState(1)
  const [spyUnit, setSpyUnit] = useState<any>(null)
  const [unitPercentages, setUnitPercentages] = useState<Record<string, number>>({})
  const [espionageResult, setEspionageResult] = useState<any>(null)
  const [showEspionageDialog, setShowEspionageDialog] = useState(false)

  const [missionType, setMissionType] = useState<"invasion" | "saqueo" | "asedio">("invasion")
  const [battleReport, setBattleReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"espionage" | "attack" | "report">("espionage")

  const [selectedSpell, setSelectedSpell] = useState<string | null>(null)
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null)
  const [selectAllUnits, setSelectAllUnits] = useState(false)

  // Inicialización
  useEffect(() => {
    setMounted(true)
  }, [])

  // Configuración de unidades (Espía y Porcentajes)
  useEffect(() => {
    if (mounted && gameState?.units) {
      const spy = gameState.units.find((u: any) => u.name === "Espía" || u.unit_type === "SPY")
      setSpyUnit(spy)

      const initialPercentages: Record<string, number> = {}
      gameState.units.forEach((unit: any) => {
        initialPercentages[unit.unit_id] = 0
      })
      setUnitPercentages(initialPercentages)
    }
  }, [mounted, gameState?.units])

  // Cargar lista de rivales
  useEffect(() => {
    const fetchEnemies = async () => {
      if (!mounted || !gameState?.province_id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const supabase = createBrowserClient()

        // Llamada RPC corregida
        const { data, error } = await supabase.rpc("get_rivals_in_range", {
          p_my_province_id: gameState.province_id,
        })

        if (error) {
          console.error("Error fetching rivals:", error)
          toast({
            title: language === "es" ? "Error" : "Error",
            description: language === "es" ? "No se pudieron cargar los rivales" : "Could not load rivals",
            variant: "destructive",
          })
          setEnemies([])
        } else {
          setEnemies(data || [])
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        setEnemies([])
      } finally {
        setLoading(false)
      }
    }

    fetchEnemies()
  }, [mounted, gameState?.province_id, language])

  const filteredEnemies = enemies.filter((enemy) =>
    enemy.province_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // --- LÓGICA DE ESPIONAJE (CORREGIDA) ---
  const handleSendSpies = async () => {
    if (!gameState?.province_id || !selectedEnemy?.province_id) return

    const totalSpies = spyUnit?.quantity || 0
    if (!spyUnit || totalSpies < spiesCount) {
      toast({
        title: language === "es" ? "Espías insuficientes" : "Insufficient Spies",
        description: language === "es" ? "No tienes suficientes espías disponibles" : "Not enough spies available",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.rpc("perform_espionage_mission", {
        p_attacker_id: gameState.province_id,
        p_defender_id: selectedEnemy.province_id,
        p_spies_sent: spiesCount,
      })

      if (error) throw error

      if (data?.success) {
        setEspionageResult(data)
        setShowEspionageDialog(true)
        toast({
          title: language === "es" ? "¡Misión exitosa!" : "Mission successful!",
          description: language === "es" ? "Informe recibido" : "Report received",
        })
        if (reloadGameState) reloadGameState()
      } else {
        toast({
          title: language === "es" ? "Misión fallida" : "Mission failed",
          description:
            data?.message || (language === "es" ? "Nuestros espías no han regresado" : "Spies did not return"),
          variant: "destructive",
        })
        if (reloadGameState) reloadGameState()
      }
    } catch (error: any) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // --- LÓGICA DE ATAQUE (CORREGIDA) ---
  const handleAttack = async () => {
    if (!gameState?.province_id || !selectedEnemy?.province_id) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" ? "Datos de provincia no válidos" : "Invalid province data",
        variant: "destructive",
      })
      return
    }

    // 1. Preparar tropas
    const armyToSend = gameState.units
      .map((u: any) => {
        const pct = unitPercentages[u.unit_id] || 0
        const quantity = Math.floor((u.quantity * pct) / 100)
        return { unit_id: u.unit_id, quantity }
      })
      .filter((u: any) => u.quantity > 0)

    if (armyToSend.length === 0) {
      toast({
        title: language === "es" ? "Ejército vacío" : "Empty Army",
        description: language === "es" ? "Selecciona tropas primero" : "Select troops first",
        variant: "destructive",
      })
      return
    }

    // 2. Mapear misión a inglés
    const missionMap = {
      invasion: "invasion",
      saqueo: "pillage",
      asedio: "siege",
    }
    // ✅ DEBUG CRÍTICO - AÑADIDO AQUÍ
    console.log("🔍 DEBUG PROVINCIA:", {
      "gameState.province_id": gameState?.province_id,
      "gameState.province": gameState?.province,
      "gameState completo": gameState,
      "selectedEnemy.province_id": selectedEnemy.province_id,
      "missionType": missionType,
      "missionMapped": missionMap[missionType]
    })

    try {
      const supabase = createBrowserClient()

      // 3. RPC CORRECTO
      const { data, error } = await supabase.rpc("perform_attack_mission", {
        p_attacker_id: gameState.province_id,
        p_defender_id: selectedEnemy.province_id,
        p_army_composition: armyToSend,
        p_mission_type: missionMap[missionType] || "pillage",
      })

      if (error) throw error

      // 4. Mostrar resultados
      setBattleReport(data)
      setActiveTab("report")
      if (reloadGameState) reloadGameState()

      toast({
        title: language === "es" ? "Combate finalizado" : "Combat finished",
        description: data.victory
          ? language === "es" ? "¡Victoria!" : "Victory!"
          : language === "es" ? "Derrota..." : "Defeat...",
        className: data.victory
          ? "bg-green-900 border-green-500 text-white"
          : "bg-red-900 border-red-500 text-white",
      })
    } catch (error: any) {
      console.error("[ATAQUE] Error:", error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error?.message || (language === "es" ? "Error al procesar ataque" : "Error processing attack"),
        variant: "destructive",
      })
    }
  }


  const handleToggleAllUnits = () => {
    const newValue = !selectAllUnits
    setSelectAllUnits(newValue)
    const newPercentages: Record<string, number> = {}
    if (newValue) {
      gameState.units.forEach((unit: any) => {
        newPercentages[unit.unit_id] = 100
      })
    } else {
      gameState.units.forEach((unit: any) => {
        newPercentages[unit.unit_id] = 0
      })
    }
    setUnitPercentages(newPercentages)
  }

  const getRelationshipBadge = (relationship: string) => {
    const rel = relationship?.toUpperCase()
    let badgeClass = "bg-gray-500/20 text-gray-400 border-gray-500/30"
    let text = language === "es" ? "Desconocido" : "Unknown"
    switch (rel) {
      case "WEAKER":
        badgeClass = "bg-green-500/20 text-green-400 border-green-500/30"
        text = language === "es" ? "Débil" : "Weak"
        break
      case "SIMILAR":
        badgeClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        text = language === "es" ? "Similar" : "Similar"
        break
      case "STRONGER":
        badgeClass = "bg-red-500/20 text-red-400 border-red-500/30"
        text = language === "es" ? "Fuerte" : "Strong"
        break
    }
    return <CustomBadge className={badgeClass}>{text}</CustomBadge>
  }

  const getMissionBackground = () => {
    switch (missionType) {
      case "invasion":
        return "/images/battle-invasion-medieval-army.jpg"
      case "saqueo":
        return "/images/battle-raid-medieval-plunder.jpg"
      case "asedio":
        return "/images/battle-siege-castle-fire.jpg"
      default:
        return "/images/battle-invasion-medieval-army.jpg"
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <img
          src="/images/war-room-medieval-strategy-map.jpg"
          alt="War room"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent rounded-lg" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl font-bold text-[#d4af37] mb-2 flex items-center gap-3">
            <Swords className="h-10 w-10" />
            {language === "es" ? "Sala de Guerra" : "War Room"}
          </h1>
          <p className="text-gray-300">
            {language === "es"
              ? `${filteredEnemies.length} provincias disponibles para atacar`
              : `${filteredEnemies.length} provinces available to attack`}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <CustomCard>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === "es" ? "Buscar por nombre de provincia..." : "Search by province name..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#d4af37]/30 rounded-lg pl-10 pr-4 py-2 text-[#d4af37] placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <CustomButton variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {language === "es" ? "Filtros" : "Filters"}
          </CustomButton>
        </div>
      </CustomCard>

      {!selectedEnemy ? (
        <>
          <CustomCard className="border-red-500/20">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              {language === "es" ? "Objetivos Disponibles" : "Available Targets"}
            </h3>

            {filteredEnemies.length === 0 ? (
              <div className="text-center py-12">
                <Swords className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  {language === "es" ? "El mundo está vacío" : "The world is empty"}
                </p>
                <p className="text-gray-500 text-sm">
                  {language === "es"
                    ? "No hay provincias disponibles para atacar en este momento"
                    : "No provinces available to attack at this time"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#d4af37]/30">
                      <th className="text-left p-3 text-gray-400 text-sm font-semibold">
                        {language === "es" ? "Rango" : "Rank"}
                      </th>
                      <th className="text-left p-3 text-gray-400 text-sm font-semibold">
                        {language === "es" ? "Provincia/Gobernador" : "Province/Governor"}
                      </th>
                      <th className="text-right p-3 text-gray-400 text-sm font-semibold">
                        {language === "es" ? "Poder" : "Power"}
                      </th>
                      <th className="text-center p-3 text-gray-400 text-sm font-semibold">
                        {language === "es" ? "Relación" : "Relation"}
                      </th>
                      <th className="text-right p-3 text-gray-400 text-sm font-semibold">
                        {language === "es" ? "Acciones" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnemies.map((enemy) => (
                      <tr
                        key={enemy.province_id}
                        className="group border-b border-[#d4af37]/10 hover:bg-[#1a1a1a]/50 transition-colors"
                      >
                        <td className="p-3">
                          {/* CORREGIDO: Uso de player_rank */}
                          <span className="text-[#d4af37] font-bold text-lg">#{enemy.player_rank || "?"}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                              <p className="text-white font-semibold">{enemy.province_name}</p>
                            </div>
                            <p className="text-gray-400 text-sm">by {enemy.player_name}</p>
                            <p className="text-gray-500 text-xs">{enemy.faction}</p>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[#d4af37] font-bold text-lg">
                              {Number(enemy.networth || 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-xs">
                              <Mountain className="h-3 w-3 inline mr-1" />
                              {Number(enemy.land || 0).toLocaleString()} {language === "es" ? "tierra" : "land"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {getRelationshipBadge(enemy.relation || enemy.relationship)}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2 justify-end">
                            <CustomButton
                              onClick={() => setSelectedEnemy(enemy)}
                              className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/30 group-hover:border-purple-500/60 transition-all text-sm px-2 py-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {language === "es" ? "Espiar" : "Spy"}
                            </CustomButton>
                            <CustomButton
                              onClick={() => {
                                setSelectedEnemy(enemy)
                                setActiveTab("attack")
                              }}
                              className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 group-hover:border-red-500/60 transition-all text-sm px-2 py-1"
                            >
                              <Sword className="h-4 w-4 mr-1" />
                              {language === "es" ? "Atacar" : "Attack"}
                            </CustomButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CustomCard>
        </>
      ) : (
        // --- MODAL DE ACCIÓN (Fixed overlay) ---
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <CustomCard className="border-2 border-[#d4af37]/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative bg-[#0a0a0a]">
            {/* Header del Modal */}
            <div className="border-b border-[#d4af37]/30 p-4 flex justify-between items-center sticky top-0 bg-[#0a0a0a] z-10">
              <h2 className="text-2xl font-bold text-[#d4af37]">
                {language === "es" ? "Objetivo:" : "Target:"} {selectedEnemy.province_name}
              </h2>
              <CustomButton
                variant="ghost"
                onClick={() => {
                  setSelectedEnemy(null)
                  setBattleReport(null)
                  setActiveTab("espionage")
                  setEspionageResult(null)
                }}
                className="text-gray-400 hover:text-[#d4af37] p-0"
              >
                <X className="h-6 w-6" />
              </CustomButton>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#d4af37]/20">
              <button
                onClick={() => setActiveTab("espionage")}
                className={`flex-1 py-3 px-4 font-semibold transition-all ${
                  activeTab === "espionage"
                    ? "bg-purple-900/30 text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-[#d4af37]"
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                {language === "es" ? "Espionaje" : "Espionage"}
              </button>
              <button
                onClick={() => setActiveTab("attack")}
                className={`flex-1 py-3 px-4 font-semibold transition-all ${
                  activeTab === "attack"
                    ? "bg-red-900/30 text-red-400 border-b-2 border-red-400"
                    : "text-gray-400 hover:text-[#d4af37]"
                }`}
              >
                <Sword className="h-4 w-4 inline mr-2" />
                {language === "es" ? "Ataque" : "Attack"}
              </button>
              {battleReport && (
                <button
                  onClick={() => setActiveTab("report")}
                  className={`flex-1 py-3 px-4 font-semibold transition-all ${
                    activeTab === "report"
                      ? "bg-[#d4af37]/20 text-[#d4af37] border-b-2 border-[#d4af37]"
                      : "text-gray-400 hover:text-[#d4af37]"
                  }`}
                >
                  <TrendingUp className="h-4 w-4 inline mr-2" />
                  {language === "es" ? "Informe" : "Report"}
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Pestaña de Espionaje */}
              {activeTab === "espionage" && (
                <div
                  className="space-y-4 relative rounded-lg overflow-hidden p-6"
                  style={{
                    backgroundImage: "url('/images/spy-medieval-shadow-agent.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#1a0a3a]/85 to-[#1a0a3a]/75" />

                  <div className="relative z-10 space-y-4">
                    <p className="text-gray-300 bg-black/40 p-3 rounded backdrop-blur-sm">
                      {language === "es"
                        ? "Envía espías para obtener información del enemigo antes del ataque."
                        : "Send spies to gather enemy intelligence before attacking."}
                    </p>

                    {!spyUnit || spyUnit.quantity === 0 ? (
                      <CustomAlert className="bg-red-900/40 border-red-500/50 backdrop-blur-sm">
                        <Eye className="h-4 w-4 text-red-400 inline mr-2" />
                        <span className="text-red-300">
                          {language === "es" ? "Recluta espías primero" : "Recruit spies first"}
                        </span>
                      </CustomAlert>
                    ) : (
                      <>
                        <CustomCard className="bg-indigo-900/40 border-indigo-500/50 backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Eye className="h-5 w-5 text-indigo-400" />
                              <span className="text-lg font-semibold text-white">
                                {language === "es" ? "Espías Disponibles" : "Available Spies"}
                              </span>
                            </div>
                            <span className="text-2xl font-bold text-indigo-300">
                              {spyUnit?.quantity?.toLocaleString() || 0}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                {language === "es" ? "Espías a enviar" : "Spies to send"}
                              </span>
                              <span className="font-semibold text-indigo-300">{spiesCount.toLocaleString()}</span>
                            </div>
                            <input
                              type="range"
                              value={spiesCount}
                              onChange={(e) => setSpiesCount(Number(e.target.value))}
                              min={1}
                              max={spyUnit?.quantity || 1}
                              step={1}
                              className="w-full accent-indigo-500"
                            />
                          </div>
                        </CustomCard>

                        <CustomButton onClick={handleSendSpies} className="w-full bg-indigo-700 hover:bg-indigo-600">
                          <Eye className="h-4 w-4 mr-2" />
                          {language === "es" ? `Enviar ${spiesCount} Espía(s)` : `Send ${spiesCount} Spy/Spies`}
                        </CustomButton>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Pestaña de Ataque */}
              {activeTab === "attack" && (
                <div
                  className="space-y-6 relative rounded-lg overflow-hidden p-6"
                  style={{
                    backgroundImage: `url('${getMissionBackground()}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/85 to-[#0a0a0a]/75" />

                  <div className="relative z-10 space-y-6">
                    {/* Mission type selector */}
                    <div>
                      <h4 className="text-[#d4af37] font-semibold mb-3 bg-black/40 p-2 rounded backdrop-blur-sm">
                        {language === "es" ? "Tipo de Misión:" : "Mission Type:"}
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setMissionType("invasion")}
                          className={`p-4 rounded border-2 transition-all backdrop-blur-sm ${
                            missionType === "invasion"
                              ? "border-red-500 bg-red-900/60 text-red-300"
                              : "border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500"
                          }`}
                        >
                          <Sword className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-semibold">{language === "es" ? "Invasión" : "Invasion"}</p>
                          <p className="text-xs mt-1">{language === "es" ? "Conquista tierra" : "Conquer land"}</p>
                        </button>
                        <button
                          onClick={() => setMissionType("saqueo")}
                          className={`p-4 rounded border-2 transition-all backdrop-blur-sm ${
                            missionType === "saqueo"
                              ? "border-yellow-500 bg-yellow-900/60 text-yellow-300"
                              : "border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500"
                          }`}
                        >
                          <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-semibold">{language === "es" ? "Saqueo" : "Raid"}</p>
                          <p className="text-xs mt-1">{language === "es" ? "Robar recursos" : "Steal resources"}</p>
                        </button>
                        <button
                          onClick={() => setMissionType("asedio")}
                          className={`p-4 rounded border-2 transition-all backdrop-blur-sm ${
                            missionType === "asedio"
                              ? "border-orange-500 bg-orange-900/60 text-orange-300"
                              : "border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500"
                          }`}
                        >
                          <Flame className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-semibold">{language === "es" ? "Asedio" : "Siege"}</p>
                          <p className="text-xs mt-1">
                            {language === "es" ? "Destruir edificios" : "Destroy buildings"}
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/60 p-4 rounded backdrop-blur-sm border border-[#d4af37]/30">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[#d4af37] font-semibold flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {language === "es" ? "Selecciona tus Tropas:" : "Select your Troops:"}
                        </h4>
                        <label className="flex items-center gap-2 cursor-pointer bg-[#d4af37]/20 px-3 py-2 rounded border border-[#d4af37]/50 hover:bg-[#d4af37]/30 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectAllUnits}
                            onChange={handleToggleAllUnits}
                            className="w-4 h-4 accent-[#d4af37]"
                          />
                          <span className="text-[#d4af37] font-semibold text-sm">
                            {language === "es" ? "Todas las Tropas" : "All Troops"}
                          </span>
                        </label>
                      </div>

                      {gameState?.units && gameState.units.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {gameState.units.map((unit: any) => {
                            const isSelected = (unitPercentages[unit.unit_id] || 0) > 0
                            return (
                              <div
                                key={unit.unit_id}
                                className={`p-3 rounded border-2 transition-all ${
                                  isSelected ? "border-[#d4af37] bg-[#d4af37]/10" : "border-gray-700 bg-black/20"
                                }`}
                              >
                                <label className="flex items-start gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      setUnitPercentages({
                                        ...unitPercentages,
                                        [unit.unit_id]: e.target.checked ? 100 : 0,
                                      })
                                    }}
                                    className="w-4 h-4 mt-1 accent-[#d4af37]"
                                  />
                                  <div className="flex-1">
                                    <p className="text-gray-200 font-semibold text-sm">{unit.name}</p>
                                    <p className="text-gray-400 text-xs">
                                      {unit.quantity.toLocaleString()} {language === "es" ? "disponibles" : "available"}
                                    </p>
                                    {isSelected && (
                                      <div className="mt-2">
                                        <div className="flex justify-between text-xs mb-1">
                                          <span className="text-gray-400">
                                            {Math.floor(
                                              (unit.quantity * (unitPercentages[unit.unit_id] || 0)) / 100,
                                            ).toLocaleString()}
                                          </span>
                                          <span className="text-[#d4af37]">{unitPercentages[unit.unit_id] || 0}%</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={unitPercentages[unit.unit_id] || 0}
                                          onChange={(e) =>
                                            setUnitPercentages({
                                              ...unitPercentages,
                                              [unit.unit_id]: Number(e.target.value),
                                            })
                                          }
                                          className="w-full accent-[#d4af37]"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-4">
                          {language === "es" ? "No tienes tropas disponibles" : "No troops available"}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/60 p-4 rounded backdrop-blur-sm border border-blue-500/30">
                        <label className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                          <Sparkles className="h-4 w-4" />
                          {language === "es" ? "Hechizo de Apoyo:" : "Support Spell:"}
                        </label>
                        <select
                          value={selectedSpell || ""}
                          onChange={(e) => setSelectedSpell(e.target.value || null)}
                          className="w-full bg-[#0a0a0a] border border-blue-500/50 rounded px-3 py-2 text-gray-300 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">{language === "es" ? "Ninguno" : "None"}</option>
                          {/* TODO: Load from gameState.spells */}
                          <option value="spell1">{language === "es" ? "Bendición de Gloria" : "Glory Blessing"}</option>
                          <option value="spell2">{language === "es" ? "Escudo Divino" : "Divine Shield"}</option>
                        </select>
                      </div>

                      <div className="bg-black/60 p-4 rounded backdrop-blur-sm border border-orange-500/30">
                        <label className="flex items-center gap-2 text-orange-400 font-semibold mb-2">
                          <Package className="h-4 w-4" />
                          {language === "es" ? "Artefacto:" : "Artifact:"}
                        </label>
                        <select
                          value={selectedArtifact || ""}
                          onChange={(e) => setSelectedArtifact(e.target.value || null)}
                          className="w-full bg-[#0a0a0a] border border-orange-500/50 rounded px-3 py-2 text-gray-300 focus:outline-none focus:border-orange-500"
                        >
                          <option value="">{language === "es" ? "Ninguno" : "None"}</option>
                          {/* TODO: Load from gameState.artifacts */}
                          <option value="artifact1">
                            {language === "es" ? "Espada del Destino" : "Sword of Destiny"}
                          </option>
                          <option value="artifact2">{language === "es" ? "Estandarte de Guerra" : "War Banner"}</option>
                        </select>
                      </div>
                    </div>

                    <CustomAlert className="bg-yellow-900/40 border-yellow-500/50 backdrop-blur-sm">
                      <p className="text-yellow-300 text-sm">
                        ⚠️{" "}
                        {language === "es"
                          ? "Tus tropas estarán fuera durante 12 turnos."
                          : "Your troops will be away for 12 turns."}
                      </p>
                    </CustomAlert>

                    <CustomButton onClick={handleAttack} className="w-full bg-red-600 hover:bg-red-700 text-xl py-6">
                      <Sword className="h-6 w-6 mr-2" />
                      {language === "es" ? "Lanzar Ataque" : "Launch Attack"}
                    </CustomButton>
                  </div>
                </div>
              )}

              {/* Informe de Batalla */}
              {activeTab === "report" && battleReport && (
                <div className="space-y-6">
                  {/* Cabecera */}
                  <div
                    className={`text-center p-6 rounded-lg border-2 ${
                      battleReport.victory ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"
                    }`}
                  >
                    <h3
                      className={`text-3xl font-bold mb-4 ${battleReport.victory ? "text-green-400" : "text-red-400"}`}
                    >
                      {battleReport.victory
                        ? language === "es"
                          ? "¡Victoria Gloriosa!"
                          : "Glorious Victory!"
                        : language === "es"
                          ? "Retirada Humillante"
                          : "Humiliating Retreat"}
                    </h3>

                    <p className="text-gray-300 text-sm mb-4 italic">{battleReport.message}</p>

                    {battleReport.victory && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">{language === "es" ? "Oro Robado:" : "Gold Stolen:"}</p>
                          <p className="text-yellow-400 text-2xl font-bold">
                            {(battleReport.goldStolen || 0).toLocaleString()} 💰
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">
                            {language === "es" ? "Tierra Conquistada:" : "Land Conquered:"}
                          </p>
                          <p className="text-green-400 text-2xl font-bold">{battleReport.landConquered || 0} acres</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">
                            {language === "es" ? "Tierra Arrasada:" : "Land Wasted:"}
                          </p>
                          <p className="text-orange-400 text-2xl font-bold">{battleReport.landWasted || 0} acres</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bajas */}
                  <div>
                    <h4 className="text-[#d4af37] font-semibold mb-3 flex items-center gap-2">
                      <Skull className="h-5 w-5" />
                      {language === "es" ? "Bajas de Combate:" : "Combat Casualties:"}
                    </h4>
                    <div className="space-y-4">
                      {/* Bajas propias */}
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          {language === "es" ? "Tus bajas:" : "Your casualties:"}
                        </p>
                        <div className="space-y-1">
                          {Array.isArray(battleReport.casualties?.attacker) && 
                          battleReport.casualties.attacker.length > 0 ? (
                            battleReport.casualties.attacker.map((unit: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-300">{unit.unit_name}</span>
                                <span className="text-red-400">-{unit.quantity.toLocaleString()}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">Sin bajas</p>
                          )}
                        </div>
                      </div>

                      {/* Bajas enemigas */}
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          {language === "es" ? "Bajas enemigas:" : "Enemy casualties:"}
                        </p>
                        <div className="space-y-1">
                          {Array.isArray(battleReport.casualties?.defender) && 
                          battleReport.casualties.defender.length > 0 ? (
                            battleReport.casualties.defender.map((unit: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-300">{unit.unit_name}</span>
                                <span className="text-green-400">-{unit.quantity.toLocaleString()}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">Sin bajas</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón Volver */}
                  <CustomButton
                    onClick={() => {
                      setSelectedEnemy(null)
                      setBattleReport(null)
                      setActiveTab("espionage")
                    }}
                    className="w-full bg-[#d4af37] hover:bg-[#b8941f] text-black"
                  >
                    {language === "es" ? "Volver a la Sala de Guerra" : "Return to War Room"}
                  </CustomButton>
                </div>
              )}
            </div>
          </CustomCard>
        </div>
      )}

      {/* Mensaje si no hay enemigos */}
      {enemies.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <p className="text-xl text-gray-400">
            {language === "es" ? "No hay otros otros jugadores registrados" : "No other players registered"}
          </p>
        </div>
      )}

      {/* --- FIX: MODAL DE ESPIONAJE (NIVEL RAÍZ PARA EVITAR OSCURIDAD) --- */}
      {showEspionageDialog && espionageResult?.data && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <div
            className="max-w-md w-full relative shadow-2xl rounded-lg overflow-hidden"
            style={{
              backgroundImage: "url('/images/spy-report-scroll-parchment.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-gradient-to-b from-indigo-950/95 via-indigo-900/90 to-indigo-950/95 border border-indigo-500 p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-indigo-300 flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  {language === "es" ? "Informe de Espionaje" : "Espionage Report"}
                </h2>
                <button onClick={() => setShowEspionageDialog(false)} className="text-gray-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-900/40 border border-yellow-500/50 rounded p-3 backdrop-blur-sm">
                    <p className="text-gray-300 text-sm">Oro:</p>
                    <p className="text-yellow-400 text-xl font-bold">
                      {Number(espionageResult.data.gold || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-900/40 border border-blue-500/50 rounded p-3 backdrop-blur-sm">
                    <p className="text-gray-300 text-sm">Maná:</p>
                    <p className="text-blue-400 text-xl font-bold">
                      {Number(espionageResult.data.mana || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-900/40 border border-green-500/50 rounded p-3 backdrop-blur-sm">
                    <p className="text-gray-300 text-sm">Tierra:</p>
                    <p className="text-green-400 text-xl font-bold">
                      {Number(espionageResult.data.land || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-900/40 border border-purple-500/50 rounded p-3 backdrop-blur-sm">
                    <p className="text-gray-300 text-sm">Nivel Mágico:</p>
                    <p className="text-purple-400 text-xl font-bold">{Number(espionageResult.data.magic_level || 1)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-indigo-300 font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Tropas Detectadas:
                  </h4>
                  <div className="bg-black/60 p-3 rounded border border-gray-700 max-h-40 overflow-y-auto backdrop-blur-sm">
                    {espionageResult.data.units && espionageResult.data.units.length > 0 ? (
                      <ul className="space-y-1 text-sm">
                        {espionageResult.data.units.map((u: any, i: number) => (
                          <li key={i} className="flex justify-between text-gray-300">
                            <span>{u.name}</span>
                            <span className="text-indigo-300">{u.quantity.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No se detectaron tropas.</p>
                    )}
                  </div>
                </div>
              </div>

              <CustomButton
                onClick={() => setShowEspionageDialog(false)}
                className="mt-6 w-full bg-indigo-700 hover:bg-indigo-600"
              >
                Cerrar Informe
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
