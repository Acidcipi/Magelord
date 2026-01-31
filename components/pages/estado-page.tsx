"use client"
import type { Language } from "@/lib/i18n"
import type { GameState } from "@/lib/game-state"
import { FACTIONS, type Faction } from "@/lib/factions"
import { getActiveBuffs } from "@/lib/game-formulas"
import { Card } from "@/components/ui/card"
import { Sparkles, TrendingUp, Users, PieChart, DollarSign } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { translations } from "@/lib/i18n"

interface EstadoPageProps {
  language: Language
  gameState: GameState
}

const toNumber = (val: any): number => {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

const calculateProduction = (buildings: { farms: number; mines: number; towers: number }, troops: number) => {
  const goldProduction = toNumber(buildings.mines) * 500
  const goldUpkeep = toNumber(troops) * 0.5
  const goldNet = goldProduction - goldUpkeep

  const foodProduction = toNumber(buildings.farms) * 50
  const foodUpkeep = toNumber(troops) * 1
  const foodNet = foodProduction - foodUpkeep

  const manaProduction = toNumber(buildings.towers) * 10
  const manaUpkeep = 0
  const manaNet = manaProduction - manaUpkeep

  return {
    gold: { production: goldProduction, upkeep: goldUpkeep, net: goldNet },
    food: { production: foodProduction, upkeep: foodUpkeep, net: foodNet },
    mana: { production: manaProduction, upkeep: manaUpkeep, net: manaNet },
  }
}

const getTaxRateStatus = (rate: number, lang: Language) => {
  if (rate <= 10) {
    return {
      status: lang === "es" ? "Paraíso" : "Paradise",
      description: lang === "es" ? "Bono de Moral y Crecimiento" : "Morale and Growth Bonus",
      color: "text-green-400",
    }
  } else if (rate <= 20) {
    return {
      status: lang === "es" ? "Estándar" : "Standard",
      description: lang === "es" ? "Equilibrio Económico" : "Economic Balance",
      color: "text-blue-400",
    }
  } else if (rate <= 35) {
    return {
      status: lang === "es" ? "Opresivo" : "Oppressive",
      description: lang === "es" ? "La Moral descenderá" : "Morale will decrease",
      color: "text-orange-400",
    }
  } else {
    return {
      status: lang === "es" ? "Tiránico" : "Tyrannical",
      description: lang === "es" ? "Riesgo de revueltas y huida de población" : "Risk of revolts and population flight",
      color: "text-red-400",
    }
  }
}

const EstadoPage = ({ gameState, language }: EstadoPageProps) => {
  const t = translations[language]
  const { toast } = useToast()

  const [taxRate, setTaxRate] = useState(gameState.tax_rate ?? 20)
  const [isSaving, setIsSaving] = useState(false)
  const [userRanking, setUserRanking] = useState<number | null>(null)

  useEffect(() => {
    const loadTaxRate = async () => {
      const { data, error } = await supabase
        .from("provinces")
        .select("tax_rate")
        .eq("id", gameState.province_id)
        .single()

      if (data && !error) {
        setTaxRate(toNumber(data.tax_rate))
      }
    }

    loadTaxRate()
  }, [gameState.province_id])

  useEffect(() => {
    const loadRanking = async () => {
      if (gameState.province_id) {
        const { fetchUserRanking } = await import("@/lib/game-state")
        const ranking = await fetchUserRanking(gameState.province_id)
        setUserRanking(ranking)
      }
    }
    loadRanking()
  }, [gameState.province_id])

  const totalTroops =
    toNumber(gameState.tier1_units) +
    toNumber(gameState.tier2_units) +
    toNumber(gameState.tier3_units) +
    toNumber(gameState.tier4_units)

  const production = calculateProduction(
    {
      farms: toNumber(gameState.farms),
      mines: toNumber(gameState.mines),
      towers: toNumber(gameState.towers),
    },
    totalTroops,
  )

  const estimatedTaxIncome = Math.floor((toNumber(gameState.population) * toNumber(taxRate)) / 100)
  const taxStatus = getTaxRateStatus(toNumber(taxRate), language)

  const faction = gameState.faction as Faction
  const factionData = faction ? FACTIONS[faction] : null

  const activeBuffs =
    gameState.faction && gameState.class && gameState.alignment
      ? getActiveBuffs(gameState.faction, gameState.class, gameState.alignment)
      : []

  const landData = {
    farms: toNumber(gameState.farms),
    mines: toNumber(gameState.mines),
    barracks: toNumber(gameState.barracks),
    towers: toNumber(gameState.towers),
    forts: toNumber(gameState.fortresses),
    walls: toNumber(gameState.walls),
    free: toNumber(gameState.free_acres) || toNumber(gameState.land) - toNumber(gameState.buildings_total) || 0,
  }

  const totalBuilt =
    landData.farms + landData.mines + landData.barracks + landData.towers + landData.forts + landData.walls
  const totalLand = totalBuilt + landData.free

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.provinceState}</h1>

      {/* A. Información de Identidad */}
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a0a] border-2 border-[#d4af37]/30 p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(/epic-fantasy-mage-wizard-with-golden-aura-casting-.jpg)" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-[#d4af37]" />
            <h3 className="text-2xl font-semibold text-[#d4af37]">
              {language === "es" ? "Perfil del Imperio" : "Empire Profile"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{language === "es" ? "Nombre de Provincia:" : "Province Name:"}</span>
                <span className="text-[#d4af37] font-bold text-lg">{gameState.name || "Tu Provincia"}</span>
              </div>

              <div className="flex justify-between items-center border-t border-[#d4af37]/20 pt-3">
                <span className="text-gray-400">{language === "es" ? "Facción:" : "Faction:"}</span>
                <span className="text-[#d4af37] capitalize font-semibold">{gameState.faction || "Desconocida"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t.class}:</span>
                <span className="text-[#d4af37] capitalize font-semibold">{gameState.class || "Sin Clase"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t.alignment}:</span>
                <span className="text-[#d4af37] capitalize font-semibold">{gameState.alignment || "Neutral"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-[#d4af37]/20 to-transparent p-4 rounded-lg border border-[#d4af37]/30">
                <p className="text-gray-400 text-sm mb-1">
                  {language === "es" ? "Poder Total (Networth)" : "Total Power (Networth)"}
                </p>
                <p className="text-3xl font-bold text-[#d4af37]">{toNumber(gameState.networth).toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-1">
                  #{userRanking ?? "..."} {language === "es" ? "en el ranking" : "in ranking"}
                </p>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                <p className="text-blue-400 text-sm font-semibold">
                  {language === "es" ? "🛡️ Protección de Novato Activa" : "🛡️ Novice Protection Active"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {language === "es" ? "Tiempo restante: 3 días" : "Time remaining: 3 days"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* B. Balance de Recursos (Producción Neta) */}
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-green-500/30 p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(/medieval-gold-mine.jpg)" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <h3 className="text-2xl font-semibold text-[#d4af37]">
              {language === "es" ? "Balance de Recursos" : "Resource Balance"}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">{language === "es" ? "Oro/Turno" : "Gold/Turn"}</p>
              <p className={`text-2xl font-bold ${production.gold.net >= 0 ? "text-green-400" : "text-red-400"}`}>
                {production.gold.net >= 0 ? "+" : ""}
                {production.gold.net.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {production.gold.production} - {production.gold.upkeep}
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-orange-500/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">{language === "es" ? "Comida/Turno" : "Food/Turn"}</p>
              <p className={`text-2xl font-bold ${production.food.net >= 0 ? "text-green-400" : "text-red-400"}`}>
                {production.food.net >= 0 ? "+" : ""}
                {production.food.net.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {production.food.production} - {production.food.upkeep}
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-purple-500/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">{language === "es" ? "Maná/Turno" : "Mana/Turn"}</p>
              <p className={`text-2xl font-bold ${production.mana.net >= 0 ? "text-green-400" : "text-red-400"}`}>
                {production.mana.net >= 0 ? "+" : ""}
                {production.mana.net.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {production.mana.production} - {production.mana.upkeep}
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-blue-500/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">
                {language === "es" ? "Turnos Disponibles" : "Available Turns"}
              </p>
              <p className="text-2xl font-bold text-blue-400">{toNumber(gameState.turns)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* C. Política Fiscal del Reino */}
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-yellow-500/30 p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(/medieval-gold-mine.jpg)" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-6 w-6 text-yellow-400" />
            <h3 className="text-2xl font-semibold text-[#d4af37]">
              {language === "es" ? "Política Fiscal del Reino" : "Kingdom Tax Policy"}
            </h3>
          </div>

          <div className="space-y-6">
            {/* Tax Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-gray-300 font-medium">
                  {language === "es" ? "Tasa de Impuestos" : "Tax Rate"}
                </label>
                <span className="text-2xl font-bold text-[#d4af37]">{taxRate}%</span>
              </div>

              <Slider
                value={[taxRate]}
                onValueChange={(value) => setTaxRate(value[0])}
                max={100}
                step={1}
                className="mb-4"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Tax Status Display */}
            <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">{language === "es" ? "Estado:" : "Status:"}</span>
                <span className={`font-bold text-lg ${taxStatus.color}`}>{taxStatus.status}</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{taxStatus.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <span className="text-gray-400">{language === "es" ? "Ingresos previstos:" : "Estimated income:"}</span>
                <span className="text-green-400 font-bold text-lg">
                  +{estimatedTaxIncome.toLocaleString()} {language === "es" ? "Oro/Turno" : "Gold/Turn"}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <Button
              onClick={async () => {
                setIsSaving(true)

                try {
                  const { error } = await supabase
                    .from("provinces")
                    .update({ tax_rate: taxRate })
                    .eq("id", gameState.province_id)

                  if (error) throw error

                  toast({
                    title: language === "es" ? "Tasas Aplicadas" : "Taxes Applied",
                    description:
                      language === "es"
                        ? `Nuevo impuesto establecido al ${taxRate}%`
                        : `New tax rate set to ${taxRate}%`,
                  })
                } catch (error: any) {
                  console.error("[v0] ❌ Error updating tax rate:", error)
                  toast({
                    title: language === "es" ? "Error" : "Error",
                    description:
                      language === "es" ? "No se pudo actualizar la tasa de impuestos" : "Failed to update tax rate",
                    variant: "destructive",
                  })
                } finally {
                  setIsSaving(false)
                }
              }}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-bold"
            >
              {isSaving
                ? language === "es"
                  ? "Aplicando..."
                  : "Applying..."
                : language === "es"
                  ? "Aplicar Tasas"
                  : "Apply Tax Rate"}
            </Button>
          </div>
        </div>
      </Card>

      {/* D. Composición Poblacional */}
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1a1a2a] border-2 border-cyan-500/30 p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(/fantasy-medieval-mages-wizards-casting-spells-epic.jpg)" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-[#d4af37]">
              {language === "es" ? "Desglose de Población" : "Population Breakdown"}
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{language === "es" ? "Civiles:" : "Civilians:"}</span>
              <span className="text-green-400 font-bold text-lg">
                {toNumber(gameState.population_civilians).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{language === "es" ? "Militares:" : "Military:"}</span>
              <span className="text-red-400 font-bold text-lg">
                {toNumber(gameState.population_military).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{language === "es" ? "Desempleados:" : "Unemployed:"}</span>
              <span className="text-yellow-400 font-bold text-lg">
                {toNumber(gameState.population_unemployed).toLocaleString()}
              </span>
            </div>
            <div className="border-t border-[#d4af37]/20 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-[#d4af37] font-bold">
                  {language === "es" ? "Población Total:" : "Total Population:"}
                </span>
                <span className="text-[#d4af37] font-bold text-2xl">
                  {toNumber(gameState.population_total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfico de Queso - Uso de Tierra */}
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#d4af37]/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="h-6 w-6 text-[#d4af37]" />
          <h3 className="text-xl font-semibold text-[#d4af37]">
            {language === "es" ? "Distribución de Tierra" : "Land Distribution"}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Pie Chart Visual */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Granjas - Verde */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="20"
                  strokeDasharray={`${(landData.farms / totalLand) * 251.2} 251.2`}
                  strokeDashoffset="0"
                />
                {/* Minas - Amarillo */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="20"
                  strokeDasharray={`${(landData.mines / totalLand) * 251.2} 251.2`}
                  strokeDashoffset={`-${(landData.farms / totalLand) * 251.2}`}
                />
                {/* Cuarteles - Naranja */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f97316"
                  strokeWidth="20"
                  strokeDasharray={`${(landData.barracks / totalLand) * 251.2} 251.2`}
                  strokeDashoffset={`-${((landData.farms + landData.mines) / totalLand) * 251.2}`}
                />
                {/* Torres - Púrpura */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="20"
                  strokeDasharray={`${(landData.towers / totalLand) * 251.2} 251.2`}
                  strokeDashoffset={`-${((landData.farms + landData.mines + landData.barracks) / totalLand) * 251.2}`}
                />
                {/* Fuertes - Cyan */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="20"
                  strokeDasharray={`${(landData.forts / totalLand) * 251.2} 251.2`}
                  strokeDashoffset={`-${((landData.farms + landData.mines + landData.barracks + landData.towers) / totalLand) * 251.2}`}
                />
                {/* Murallas - Azul */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray={`${(landData.walls / totalLand) * 251.2} 251.2`}
                  strokeDashoffset={`-${((landData.farms + landData.mines + landData.barracks + landData.towers + landData.forts) / totalLand) * 251.2}`}
                />
                {/* Libre - Gris */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#6b7280"
                  strokeWidth="20"
                  strokeDasharray={`${(landData.free / totalLand) * 251.2} 251.2`}
                  strokeDashoffset={`-${(totalBuilt / totalLand) * 251.2}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#d4af37]">{totalLand}</p>
                  <p className="text-xs text-gray-400">acres</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-gray-300">{language === "es" ? "Granjas" : "Farms"}</span>
              </div>
              <span className="text-green-400 font-bold">
                {landData.farms} ({Math.round((landData.farms / totalLand) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="text-gray-300">{language === "es" ? "Minas" : "Mines"}</span>
              </div>
              <span className="text-yellow-400 font-bold">
                {landData.mines} ({Math.round((landData.mines / totalLand) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span className="text-gray-300">{language === "es" ? "Cuarteles" : "Barracks"}</span>
              </div>
              <span className="text-orange-400 font-bold">
                {landData.barracks} ({Math.round((landData.barracks / totalLand) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded" />
                <span className="text-gray-300">{language === "es" ? "Torres de Mago" : "Mage Towers"}</span>
              </div>
              <span className="text-purple-400 font-bold">
                {landData.towers} ({Math.round((landData.towers / totalLand) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded" />
                <span className="text-gray-300">{language === "es" ? "Fuertes" : "Forts"}</span>
              </div>
              <span className="text-cyan-400 font-bold">
                {landData.forts} ({Math.round((landData.forts / totalLand) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[#d4af37]/20 pt-2 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded" />
                <span className="text-gray-300 font-bold">{language === "es" ? "Libre" : "Free"}</span>
              </div>
              <span className="text-gray-400 font-bold">
                {landData.free} ({Math.round((landData.free / totalLand) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Buffs Activos */}
      {activeBuffs.length > 0 && (
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a0a] border-2 border-green-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#d4af37]" />
            <h3 className="text-xl font-semibold text-[#d4af37]">{t.activeBuffs}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {activeBuffs.map((buff, index) => (
              <div
                key={index}
                className="bg-green-900/20 border border-green-500/30 rounded px-3 py-2 text-sm text-green-400 flex items-center gap-2"
              >
                <Sparkles className="h-3 w-3" />
                {buff}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export { EstadoPage }

export default EstadoPage
