"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, Swords, Coins, Zap, Users, Target } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"

interface ReclutarPageProps {
  language: Language
  gameState: any
  onUpdate: () => Promise<void>
}

const toNumber = (value: any): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const getTierColor = (tier: number): string => {
  switch (tier) {
    case 1:
      return "bg-slate-600 text-white"
    case 2:
      return "bg-green-600 text-white"
    case 3:
      return "bg-blue-600 text-white"
    case 4:
      return "bg-purple-600 text-white"
    case 5:
      return "bg-red-600 text-white"
    case 6:
      return "bg-gradient-to-r from-amber-500 via-red-500 to-purple-600 text-white animate-pulse"
    default:
      return "bg-amber-600 text-white"
  }
}

export function ReclutarPage({ language, gameState, onUpdate }: ReclutarPageProps) {
  const t = useTranslation(language)
  const { toast } = useToast()

  const [ready, setReady] = useState(false)
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const [trainingTurns, setTrainingTurns] = useState<Record<string, string>>({})
  const [trainingStates, setTrainingStates] = useState<Record<string, boolean>>({})

  const [calculatedUnits, setCalculatedUnits] = useState<Record<string, number>>({})

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    const fetchUnits = async () => {
      if (!gameState?.province_id) {
        console.log("[v0] ⚠️ No province_id found in gameState")
        return
      }

      setLoading(true)
      setError("")

      try {
        console.log("[v0] 🔍 Fetching unlocked units for province:", gameState.province_id)

        const { data, error: fetchError } = await supabase
          .from("master_units")
          .select("*, province_unlocked_units!inner(province_id)")
          .eq("province_unlocked_units.province_id", gameState.province_id)

        if (fetchError) {
          console.error("[v0] ❌ Fetch error:", fetchError)
          setError(fetchError.message)
          setLoading(false)
          return
        }

        console.log("[v0] ✅ Unlocked units loaded:", data?.length || 0)

        setUnits(data || [])
      } catch (err: any) {
        console.error("[v0] 💥 Exception:", err)
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    if (ready && gameState?.province_id) {
      fetchUnits()
    }
  }, [ready, gameState?.province_id])

  useEffect(() => {
    const newCalculatedUnits: Record<string, number> = {}

    Object.entries(trainingTurns).forEach(([unitId, turnsStr]) => {
      const turns = toNumber(turnsStr)
      if (turns > 0) {
        const barracks = toNumber(gameState?.barracks) || 1
        const unitsProduced = Math.floor(barracks * 10 * turns)
        newCalculatedUnits[unitId] = unitsProduced
      } else {
        newCalculatedUnits[unitId] = 0
      }
    })

    setCalculatedUnits(newCalculatedUnits)
  }, [trainingTurns, gameState?.barracks])

  const handleTrain = async (unit: any) => {
    const turnsInput = trainingTurns[unit.id] || ""

    if (!turnsInput) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" ? "Ingresa los turnos" : "Enter turns",
        variant: "destructive",
      })
      return
    }

    const turns = toNumber(turnsInput)
    if (turns <= 0) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" ? "Turnos inválidos" : "Invalid turns",
        variant: "destructive",
      })
      return
    }

    const unitTier = toNumber(unit.tier)
    if (unitTier === 6 && turns < 20) {
      toast({
        title: language === "es" ? "Invocación Insuficiente" : "Insufficient Invocation",
        description:
          language === "es"
            ? "La invocación requiere un sacrificio mayor de turnos (mínimo 20)"
            : "The invocation requires a greater sacrifice of turns (minimum 20)",
        variant: "destructive",
      })
      return
    }

    setTrainingStates({ ...trainingStates, [unit.id]: true })

    try {
      console.log("[v0] 🎯 Calling RPC entrenar_unidades with:", {
        p_province_id: gameState.province_id,
        p_unit_id: unit.id,
        p_turnos: turns,
      })

      const { error } = await supabase.rpc("entrenar_unidades", {
        p_province_id: gameState.province_id,
        p_unit_id: unit.id,
        p_turnos: turns,
      })

      if (!error) {
        const unitsProduced = calculatedUnits[unit.id] || 0
        toast({
          title: language === "es" ? "¡Excelente!" : "Excellent!",
          description:
            language === "es"
              ? `Has entrenado ${unitsProduced} unidades de ${unit.name}`
              : `You trained ${unitsProduced} ${unit.name} units`,
          duration: 3000,
        })

        setTrainingTurns({ ...trainingTurns, [unit.id]: "" })

        setTimeout(async () => {
          await onUpdate()
        }, 800)
      } else {
        console.error("[v0] ❌ RPC Error:", error?.message)
        toast({
          title: "Error de Entrenamiento",
          description: error?.message || "Error desconocido",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("[v0] ❌ Training error:", err)
      toast({
        title: "Error",
        description: err.message || "Training failed",
        variant: "destructive",
      })
    } finally {
      setTrainingStates({ ...trainingStates, [unit.id]: false })
    }
  }

  const getUnitQuantity = (unitId: string): number => {
    if (!gameState?.units) return 0
    const unit = gameState.units.find((u: any) => String(u.unit_id) === String(unitId))
    return toNumber(unit?.quantity)
  }

  const sortedUnits = [...units].sort((a, b) => {
    const tierA = toNumber(a.tier)
    const tierB = toNumber(b.tier)

    if (tierA !== tierB) {
      return tierA - tierB // Sort by tier ascending
    }

    // Same tier, sort alphabetically by name
    return a.name.localeCompare(b.name)
  })

  if (!ready) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-amber-500" />
        <h2 className="text-3xl font-bold text-white">{language === "es" ? "Entrenamiento" : "Recruitment"}</h2>
      </div>

      {!loading && units.length === 0 && (
        <Card className="bg-red-950/50 border-red-800 p-6">
          <p className="text-red-300 text-lg font-semibold">
            ERROR: No se pudieron cargar unidades para la facción "{gameState?.faction || "UNKNOWN"}"
          </p>
          <p className="text-red-200 mt-2">
            DEBUG: Mi facción es {gameState?.faction || "UNKNOWN"}. Unidades encontradas: {units.length}
          </p>
        </Card>
      )}

      {loading && (
        <Card className="bg-slate-900/50 border-amber-700/50 p-8 text-center">
          <p className="text-amber-400 text-lg">{language === "es" ? "Cargando unidades..." : "Loading units..."}</p>
        </Card>
      )}

      {error && (
        <Card className="bg-red-950/50 border-red-800 p-6">
          <p className="text-red-300">Error: {error}</p>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sortedUnits.map((unit) => {
          const attack = toNumber(unit.attack)
          const defense = toNumber(unit.defense)
          const accuracy = toNumber(unit.accuracy)
          const tier = toNumber(unit.tier)
          const maintenanceGold = toNumber(unit.maintenance_gold)
          const maintenanceMana = toNumber(unit.maintenance_mana)
          const ownedQuantity = getUnitQuantity(unit.id)
          const isTraining = trainingStates[unit.id] || false
          const trainTurns = trainingTurns[unit.id] || ""

          const unitsProduced = calculatedUnits[unit.id] || 0

          const goldCost = unitsProduced * maintenanceGold * 5
          const manaCost = unitsProduced * maintenanceMana * 2

          const hasEnoughGold = goldCost <= toNumber(gameState?.gold)
          const hasEnoughMana = manaCost <= toNumber(gameState?.mana)

          const imageUrl = unit.image_url?.replace(/\\/g, "/") || "/fantasy-unit.jpg"

          const isTier6 = tier === 6
          const currentLand = toNumber(gameState?.land) || 0
          const maxTier6Units = Math.floor(currentLand / 2000)
          const tier6Warning =
            isTier6 && unitsProduced > 0
              ? unitsProduced > maxTier6Units
                ? language === "es"
                  ? `⚠️ Requieres ${unitsProduced * 2000} acres (Tienes: ${currentLand})`
                  : `⚠️ Requires ${unitsProduced * 2000} acres (You have: ${currentLand})`
                : language === "es"
                  ? `✓ Puedes invocar ${maxTier6Units} Príncipes máximo`
                  : `✓ You can summon ${maxTier6Units} Princes maximum`
              : null

          return (
            <Card
              key={unit.id}
              className="relative bg-slate-900 border-0 hover:border-2 hover:border-amber-500 transition-all overflow-hidden shadow-xl"
            >
              <div className="relative h-[32rem] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

                {isTier6 && (
                  <div className="absolute top-3 left-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                      🔥 UNIDAD LEGENDARIA: Requiere 2,000 acres por cada Príncipe
                    </div>
                  </div>
                )}

                <div className="absolute top-3 right-3 z-10">
                  <Badge className={`${getTierColor(tier)} font-bold text-sm px-3 py-1.5`}>Tier {String(tier)}</Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-400 mb-0.5">{unit.name}</h3>
                    <p className="text-xs text-slate-300">{unit.unit_type}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-red-400">
                      <Swords className="h-4 w-4" />
                      <span className="text-sm font-bold">{String(attack)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-bold">{String(defense)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-bold">{String(accuracy)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Coins className="h-3 w-3" />
                      <span>{String(maintenanceGold)}/t</span>
                    </div>
                    <div className="flex items-center gap-1 text-purple-400">
                      <Zap className="h-3 w-3" />
                      <span>{String(maintenanceMana)}/t</span>
                    </div>
                  </div>

                  {unit.abilities && Array.isArray(unit.abilities) && unit.abilities.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-semibold">
                        {language === "es" ? "Habilidades" : "Abilities"}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {unit.abilities.map((ability: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-slate-800/90 text-amber-300 border-amber-700/50"
                          >
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800/90 rounded px-3 py-1.5 inline-block">
                    <span className="text-amber-400 font-bold text-sm">
                      {language === "es" ? "Tienes" : "You have"}: {String(ownedQuantity)}
                    </span>
                  </div>

                  <div className="space-y-2 bg-slate-900/95 rounded-lg p-3 border border-amber-700/30">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={trainTurns}
                        onChange={(e) => setTrainingTurns({ ...trainingTurns, [unit.id]: e.target.value })}
                        placeholder={language === "es" ? "Turnos" : "Turns"}
                        className="bg-slate-800 border-slate-700 text-white text-sm h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                        disabled={isTraining}
                      />
                      <Button
                        onClick={() => handleTrain(unit)}
                        disabled={isTraining || !trainTurns}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4"
                      >
                        {isTraining ? (language === "es" ? "..." : "...") : language === "es" ? "Entrenar" : "Train"}
                      </Button>
                    </div>

                    {trainTurns && toNumber(trainTurns) > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-amber-300 font-semibold">
                          {language === "es" ? "Producirás" : "You'll produce"}: {String(unitsProduced)}{" "}
                          {language === "es" ? "unidades" : "units"}
                        </div>

                        {tier6Warning && (
                          <div
                            className={`text-xs font-bold ${unitsProduced > maxTier6Units ? "text-red-400" : "text-green-400"}`}
                          >
                            {tier6Warning}
                          </div>
                        )}

                        <div className="space-y-0.5">
                          <div
                            className={`flex items-center gap-1 text-xs font-semibold ${hasEnoughGold ? "text-yellow-400" : "text-red-500"}`}
                          >
                            <Coins className="h-3 w-3" />
                            <span>
                              {language === "es" ? "Coste Oro" : "Gold Cost"}: {goldCost.toLocaleString()}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-1 text-xs font-semibold ${hasEnoughMana ? "text-purple-400" : "text-red-500"}`}
                          >
                            <Zap className="h-3 w-3" />
                            <span>
                              {language === "es" ? "Coste Maná" : "Mana Cost"}: {manaCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
