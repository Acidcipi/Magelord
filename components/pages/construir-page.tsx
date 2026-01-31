"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Hammer, X } from "lucide-react"
import { calculateConstructionCapacity } from "@/lib/game-formulas"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

interface ConstruirPageProps {
  language: Language
  gameState: any
  onUpdate: () => void
}

export function ConstruirPage({ language, gameState, onUpdate }: ConstruirPageProps) {
  const t = useTranslation(language)
  const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null)
  const [turnsToInvest, setTurnsToInvest] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const initialBuildings = {
    homes: gameState?.buildings?.homes || gameState?.homes || 0,
    farms: gameState?.buildings?.farms || gameState?.farms || 0,
    mines: gameState?.buildings?.mines || gameState?.mines || 0,
    barracks: gameState?.buildings?.barracks || gameState?.barracks || 0,
    towers: gameState?.buildings?.towers || gameState?.towers || 0,
    fortresses: gameState?.buildings?.fortresses || gameState?.fortresses || 0,
    walls: gameState?.buildings?.walls || gameState?.walls || 0,
  }

  const buildings = [
    {
      id: "homes",
      name: language === "es" ? "Casas" : "Homes",
      description:
        language === "es"
          ? "Viviendas para tus ciudadanos. Capacidad: Cada casa aloja entre 15-30 ciudadanos. Sin espacio en las casas, la población no crece y no puedes entrenar tropas. Crecimiento: La población crece cada turno si hay espacio libre. Impuestos: Solo los ciudadanos alojados generan oro eficientemente."
          : "Housing for your citizens. Capacity: Each home houses 15-30 citizens. Without home space, population doesn't grow and you can't train troops. Growth: Population grows each turn if space is available. Taxes: Only housed citizens generate gold efficiently.",
      image: "/medieval-village-homes.jpg",
      goldCost: 30,
      turnsCost: 1,
      landRequired: 1,
      production: { amount: 20, unit: language === "es" ? "Población" : "Population" },
      currentQuantity: initialBuildings.homes,
    },
    {
      id: "farms",
      name: language === "es" ? "Granjas" : "Farms",
      description:
        language === "es"
          ? "Estructuras de producción agrícola y establos. Son el motor de crecimiento de tu población civil. Sustento: Genera Comida cada turno. Sin comida, la población emigra y las tropas mueren por inanición."
          : "Agricultural production structures and stables. They are the growth engine of your civilian population. Sustenance: Generates Food each turn. Without food, population emigrates and troops die of starvation.",
      image: "/medieval-farm-fields.jpg",
      goldCost: 50,
      turnsCost: 1,
      landRequired: 1,
      production: { amount: 50, unit: language === "es" ? "Comida/turno" : "Food/turn" },
      currentQuantity: initialBuildings.farms,
    },
    {
      id: "mines",
      name: language === "es" ? "Minas de Oro" : "Gold Mines",
      description:
        language === "es"
          ? "Excavaciones profundas en busca de vetas de oro. Representan la base financiera de tu imperio. Riqueza: Genera Oro cada turno. El oro es necesario para pagar el mantenimiento del ejército y nuevas construcciones."
          : "Deep excavations searching for gold veins. They represent your empire's financial base. Wealth: Generates Gold each turn. Gold is necessary to pay army maintenance and new constructions.",
      image: "/medieval-gold-mine.jpg",
      goldCost: 100,
      turnsCost: 1,
      landRequired: 1,
      production: { amount: 500, unit: language === "es" ? "Oro/turno" : "Gold/turn" },
      currentQuantity: initialBuildings.mines,
    },
    {
      id: "barracks",
      name: language === "es" ? "Cuartel" : "Barracks",
      description:
        language === "es"
          ? "Centros de entrenamiento y alojamiento militar. Optimizan la logística de reclutamiento. Capacidad: Permite reclutar tropas más rápido y aumenta el límite de población militar que puedes sostener."
          : "Military training and housing centers. They optimize recruitment logistics. Capacity: Allows recruiting troops faster and increases the military population limit you can sustain.",
      image: "/medieval-military-barracks.jpg",
      goldCost: 125,
      turnsCost: 2,
      landRequired: 1,
      production: { amount: 50, unit: language === "es" ? "Capacidad" : "Capacity" },
      currentQuantity: initialBuildings.barracks,
    },
    {
      id: "towers",
      name: language === "es" ? "Torres de Magos" : "Mage Towers",
      description:
        language === "es"
          ? "Agujas cargadas de cristales arcanos que canalizan las corrientes de maná del entorno. Poder: Genera Maná cada turno. El maná es el combustible para hechizos de ataque, defensa y espionaje."
          : "Spires loaded with arcane crystals channeling environmental mana currents. Power: Generates Mana each turn. Mana is the fuel for attack, defense and espionage spells.",
      image: "/magical-wizard-tower.jpg",
      goldCost: 200,
      turnsCost: 2,
      landRequired: 1,
      production: { amount: 10, unit: "% Defensa" },
      currentQuantity: initialBuildings.towers,
    },
    {
      id: "fortresses",
      name: language === "es" ? "Fortalezas" : "Fortresses",
      description:
        language === "es"
          ? "Bastiones fortificados donde tus tropas se posicionan para repeler agresores. Defensa de Tropas: Proporciona cobertura táctica. Aumenta la supervivencia de tus soldados cuando eres atacado, reduciendo tus bajas."
          : "Fortified bastions where your troops position to repel aggressors. Troop Defense: Provides tactical cover. Increases your soldiers' survival when attacked, reducing casualties.",
      image: "/medieval-stone-fortress.jpg",
      goldCost: 250,
      turnsCost: 3,
      landRequired: 2,
      production: { amount: 5, unit: "% Defensa" },
      currentQuantity: initialBuildings.fortresses,
    },
    {
      id: "walls",
      name: language === "es" ? "Murallas" : "Walls",
      description:
        language === "es"
          ? "Perímetro defensivo reforzado. Son la última línea de defensa de tu soberanía territorial. Protección de Bienes: Reduce la eficacia de las invasiones enemigas. Hace que pierdas menos edificios y recursos en caso de saqueo."
          : "Reinforced defensive perimeter. They are the last line of defense for your territorial sovereignty. Asset Protection: Reduces enemy invasion effectiveness. Makes you lose fewer buildings and resources in case of plunder.",
      image: "/medieval-castle-walls.jpg",
      goldCost: 500,
      turnsCost: 4,
      landRequired: 2,
      production: { amount: 10, unit: "% Defensa" },
      currentQuantity: initialBuildings.walls,
    },
  ]

  const handleConstruct = async () => {
    console.log("[v0] Starting database-connected construction")

    setResult(null)
    setError(null)

    if (!selectedBuilding || !turnsToInvest || typeof turnsToInvest !== "number") return

    const population = gameState?.population || 1000
    const buildingsPerTurn = calculateConstructionCapacity(population)
    const totalBuildings = buildingsPerTurn * turnsToInvest

    const totalGoldCost = selectedBuilding.goldCost * totalBuildings
    const totalLandRequired = selectedBuilding.landRequired * totalBuildings

    if (gameState.gold < totalGoldCost) {
      setError(
        language === "es"
          ? `No tienes suficiente oro. Necesitas ${totalGoldCost.toLocaleString()} oro.`
          : `Insufficient gold. You need ${totalGoldCost.toLocaleString()} gold.`,
      )
      toast({
        title: "Error",
        description: language === "es" ? "Oro insuficiente" : "Insufficient gold",
        variant: "destructive",
      })
      return
    }

    if (gameState.turns < turnsToInvest) {
      setError(language === "es" ? "No tienes suficientes turnos" : "Insufficient turns")
      return
    }

    const freeLand = gameState.acres - (gameState.buildings_total || 0)
    if (freeLand < totalLandRequired) {
      setError(language === "es" ? "No tienes suficiente tierra libre" : "Insufficient free land")
      return
    }

    setLoading(true)

    try {
      const { data: existingBuildings, error: fetchError } = await supabase
        .from("buildings")
        .select("homes, farms, mines, towers, barracks, walls, fortresses")
        .eq("province_id", gameState.province_id)
        .single()

      if (fetchError) {
        console.error("[v0] ❌ Error fetching building:", fetchError.message)
        setError(fetchError.message)
        toast({
          title: "Error",
          description: fetchError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const columnName = selectedBuilding.id // homes, farms, mines, towers, barracks, walls, fortresses
      const currentAmount = existingBuildings[columnName] || 0
      const newAmount = currentAmount + totalBuildings

      const { error: updateError } = await supabase
        .from("buildings")
        .update({ [columnName]: newAmount })
        .eq("province_id", gameState.province_id)

      if (updateError) {
        console.error("[v0] ❌ Error updating buildings:", updateError.message)
        setError(updateError.message)
        setLoading(false)
        return
      }

      const { error: provinceError } = await supabase
        .from("provinces")
        .update({
          gold: gameState.gold - totalGoldCost,
          turns: gameState.turns - turnsToInvest,
          last_update: new Date().toISOString(),
        })
        .eq("id", gameState.province_id)

      if (provinceError) {
        console.error("[v0] ❌ Error updating province:", provinceError.message)
        setError(provinceError.message)
        setLoading(false)
        return
      }

      console.log("[v0] ✅ Construction successful")

      setResult(
        language === "es"
          ? `¡Éxito! Has construido ${totalBuildings} ${selectedBuilding.name}(s).`
          : `Success! You built ${totalBuildings} ${selectedBuilding.name}(s).`,
      )

      toast({
        title: language === "es" ? "¡Éxito!" : "Success!",
        description:
          language === "es"
            ? `Has construido ${totalBuildings} ${selectedBuilding.name}(s).`
            : `You built ${totalBuildings} ${selectedBuilding.name}(s).`,
        duration: 5000,
      })

      await onUpdate()
      setSelectedBuilding(null)
      setTurnsToInvest("")
    } catch (error: any) {
      console.error("[v0] 💥 Construction error:", error)
      setError(language === "es" ? "Error al construir" : "Construction error")
      toast({
        title: "Error",
        description: error.message || "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Hammer className="h-8 w-8 text-[#d4af37]" />
        <h1 className="text-3xl font-bold text-[#d4af37]">{t.construct}</h1>
      </div>
      <p className="text-gray-400">
        {language === "es"
          ? "Construye edificios para mejorar tu provincia y desbloquear nuevas capacidades."
          : "Build structures to improve your province and unlock new capabilities."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buildings.map((building) => {
          const totalProduction =
            building.production.amount > 0 ? building.production.amount * building.currentQuantity : 0

          return (
            <Card
              key={building.id}
              onClick={() => setSelectedBuilding(building)}
              className="relative overflow-hidden border-2 border-[#d4af37]/30 hover:border-[#d4af37] cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="relative h-96">
                <Image
                  src={building.image || "/placeholder.svg"}
                  alt={building.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-[#d4af37] mb-2">{building.name}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">{building.description}</p>

                  <div className="flex justify-between items-end">
                    <div className="text-sm space-y-1">
                      <p className="text-gray-400">{language === "es" ? "Coste:" : "Cost:"}</p>
                      <p className="text-yellow-400 font-bold">
                        {building.goldCost} {t.gold}
                      </p>
                      <p className="text-blue-400 font-bold">
                        {building.turnsCost} {t.turns_unit}
                      </p>
                      <p className="text-green-400 font-bold">{building.landRequired} acres</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">{language === "es" ? "Construidas:" : "Built:"}</p>
                      <p className="text-3xl font-bold text-[#d4af37]">{building.currentQuantity}</p>
                      {totalProduction > 0 && (
                        <p className="text-sm text-cyan-400 mt-1">
                          +{totalProduction} {building.production.unit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedBuilding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => {
            setSelectedBuilding(null)
            setResult(null)
            setError(null)
          }}
        >
          <div
            className="bg-[#0a0a0a] border-2 border-[#d4af37] rounded-lg max-w-2xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={() => {
                setSelectedBuilding(null)
                setResult(null)
                setError(null)
              }}
              variant="ghost"
              className="absolute top-4 right-4 text-[#d4af37] hover:text-[#f4cf5f]"
            >
              <X className="h-6 w-6" />
            </Button>

            <div
              className="h-64 bg-cover bg-center rounded-lg mb-6"
              style={{ backgroundImage: `url(${selectedBuilding.image})` }}
            />

            <h2 className="text-2xl font-bold text-[#d4af37] mb-4">{selectedBuilding.name}</h2>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#d4af37] mb-2">
                {language === "es" ? "Turnos para Construir" : "Turns to Build"}
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={turnsToInvest}
                onChange={(e) => {
                  const val = e.target.value
                  setTurnsToInvest(val === "" ? "" : Number.parseInt(val) || "")
                }}
                placeholder={language === "es" ? "Ingresa turnos" : "Enter turns"}
                className="bg-black/40 border-[#d4af37]/30 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                {language === "es"
                  ? `Con tu población actual, construirás aproximadamente ${typeof turnsToInvest === "number" ? calculateConstructionCapacity(gameState?.population || 1000) * turnsToInvest : 0} edificios`
                  : `With your current population, you'll build approximately ${typeof turnsToInvest === "number" ? calculateConstructionCapacity(gameState?.population || 1000) * turnsToInvest : 0} buildings`}
              </p>
            </div>

            <div className="bg-black/40 border border-yellow-500/30 rounded p-4 mb-6">
              <h3 className="text-sm font-bold text-yellow-400 mb-2">
                {language === "es" ? "Coste Estimado" : "Estimated Cost"}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">{t.gold}:</p>
                  <p className="text-yellow-400 font-bold">
                    {typeof turnsToInvest === "number"
                      ? selectedBuilding.goldCost *
                        calculateConstructionCapacity(gameState?.population || 1000) *
                        turnsToInvest
                      : 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">{t.turns_unit}:</p>
                  <p className="text-blue-400 font-bold">{turnsToInvest || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400">Tierra:</p>
                  <p className="text-green-400 font-bold">
                    {typeof turnsToInvest === "number"
                      ? selectedBuilding.landRequired *
                        calculateConstructionCapacity(gameState?.population || 1000) *
                        turnsToInvest
                      : 0}{" "}
                    acres
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleConstruct}
              disabled={loading || !turnsToInvest || typeof turnsToInvest !== "number"}
              className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f] font-bold text-lg py-6"
            >
              <Hammer className="mr-2 h-5 w-5" />
              {loading
                ? language === "es"
                  ? "Construyendo..."
                  : "Building..."
                : language === "es"
                  ? "Construir"
                  : "Build"}
            </Button>

            {result && (
              <div className="mt-4 bg-green-900/30 border border-green-500/50 rounded p-4">
                <p className="text-green-400 font-bold">{result}</p>
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-900/30 border border-red-500/50 rounded p-4">
                <p className="text-red-400 font-bold">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
