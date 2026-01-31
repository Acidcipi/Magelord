"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, X } from "lucide-react"
import type { GameState } from "@/lib/game-state"
import { supabase } from "@/lib/supabaseClient"

interface DemolerPageProps {
  language: Language
  gameState: GameState
  onUpdate: () => void
}

interface Building {
  id: string
  name: string
  description: string
  image: string
  currentQuantity: number
}

export function DemolerPage({ language, gameState, onUpdate }: DemolerPageProps) {
  const t = useTranslation(language)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const buildings: Building[] = [
    {
      id: "farms",
      name: language === "es" ? "Granja" : "Farm",
      description:
        language === "es"
          ? "Estructuras de producción agrícola. Demoler libera espacio para otras construcciones."
          : "Agricultural production structures. Demolishing frees space for other constructions.",
      image: "/medieval-farm-fields.jpg",
      currentQuantity: gameState.farms || 0,
    },
    {
      id: "mines",
      name: language === "es" ? "Mina de Oro" : "Gold Mine",
      description:
        language === "es"
          ? "Excavaciones profundas de oro. Demoler recupera el acre ocupado."
          : "Deep gold excavations. Demolishing recovers the occupied acre.",
      image: "/medieval-gold-mine.jpg",
      currentQuantity: gameState.mines || 0,
    },
    {
      id: "barracks",
      name: language === "es" ? "Cuartel" : "Barracks",
      description:
        language === "es"
          ? "Centros de entrenamiento militar. Demoler reduce capacidad de reclutamiento."
          : "Military training centers. Demolishing reduces recruitment capacity.",
      image: "/medieval-military-barracks.jpg",
      currentQuantity: gameState.barracks || 0,
    },
    {
      id: "towers",
      name: language === "es" ? "Torre de Magos" : "Mage Tower",
      description:
        language === "es"
          ? "Torres arcanas generadoras de maná. Demoler reduce generación de maná."
          : "Arcane mana-generating towers. Demolishing reduces mana generation.",
      image: "/magical-wizard-tower.jpg",
      currentQuantity: gameState.towers || 0,
    },
    {
      id: "fortresses",
      name: language === "es" ? "Fortaleza" : "Fortress",
      description:
        language === "es"
          ? "Bastiones defensivos. Demoler reduce defensa provincial."
          : "Defensive bastions. Demolishing reduces provincial defense.",
      image: "/medieval-stone-fortress.jpg",
      currentQuantity: gameState.fortresses || 0,
    },
    {
      id: "walls",
      name: language === "es" ? "Murallas" : "Walls",
      description:
        language === "es"
          ? "Perímetro defensivo. Demoler debilita protección contra invasiones."
          : "Defensive perimeter. Demolishing weakens protection against invasions.",
      image: "/medieval-castle-walls.jpg",
      currentQuantity: gameState.walls || 0,
    },
  ]

  const handleDemolish = async () => {
    if (!selectedBuilding) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const { data, error: rpcError } = await supabase.rpc("demolish_building", {
        p_province_id: gameState.province_id,
        p_building_type: selectedBuilding.id,
        p_amount: quantity,
      })

      if (rpcError) {
        throw new Error(rpcError.message || "Demolition failed")
      }

      const successMessage =
        language === "es"
          ? `¡Éxito! Has demolido ${quantity} ${selectedBuilding.name}(s). Coste: ${quantity * 500} oro.`
          : `Success! You demolished ${quantity} ${selectedBuilding.name}(s). Cost: ${quantity * 500} gold.`

      setResult(successMessage)

      if (typeof window !== "undefined" && (window as any).toast) {
        ;(window as any).toast({
          title: language === "es" ? "¡Demolición Exitosa!" : "Demolition Successful!",
          description: successMessage,
          duration: 5000,
        })
      }

      await onUpdate()
      setSelectedBuilding(null)
      setQuantity(1)
    } catch (err: any) {
      setError(err.message)

      if (typeof window !== "undefined" && (window as any).toast) {
        ;(window as any).toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
          duration: 5000,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trash2 className="h-8 w-8 text-red-400" />
        <h1 className="text-3xl font-bold text-[#d4af37]">{t.demolish}</h1>
      </div>
      <p className="text-gray-400">
        {language === "es"
          ? "Demuele edificios para liberar espacio y reconfigurar tu estrategia. Coste: 1 turno por edificio."
          : "Demolish buildings to free space and reconfigure your strategy. Cost: 1 turn per building."}
      </p>

      {/* Building Cards in 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buildings.map((building) => (
          <Card
            key={building.id}
            onClick={() => building.currentQuantity > 0 && setSelectedBuilding(building)}
            className={`relative overflow-hidden border-2 ${
              building.currentQuantity > 0
                ? "border-red-500/30 hover:border-red-500 cursor-pointer"
                : "border-gray-700/30 opacity-50 cursor-not-allowed"
            } transition-all hover:scale-[1.02]`}
          >
            {/* Building Image */}
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${building.image})` }}>
              {building.currentQuantity === 0 && (
                <div className="h-full flex items-center justify-center bg-black/60">
                  <p className="text-gray-400 font-bold">{language === "es" ? "No construido" : "Not built"}</p>
                </div>
              )}
            </div>

            {/* Building Info */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-[#d4af37] mb-1">{building.name}</h3>
                <p className="text-sm text-gray-400">{building.description}</p>
              </div>

              <div className="bg-black/40 border border-red-500/20 rounded p-2 mb-3">
                <p className="text-xs text-gray-400">
                  {language === "es" ? "Cantidad construida:" : "Built quantity:"}
                </p>
                <p className="text-lg font-bold text-red-400">{building.currentQuantity}</p>
              </div>

              <div className="text-sm space-y-1">
                <p className="text-gray-500">{language === "es" ? "Demolición:" : "Demolition:"}</p>
                <p className="text-blue-400 font-bold">1 {language === "es" ? "Turno" : "Turn"}</p>
                <p className="text-green-400 font-bold">+1 acre {language === "es" ? "liberado" : "freed"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Demolition Modal */}
      {selectedBuilding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <Card className="bg-[#0a0a0a] border-2 border-red-500 rounded-lg max-w-2xl w-full p-6 relative">
            <Button
              onClick={() => setSelectedBuilding(null)}
              variant="ghost"
              className="absolute top-4 right-4 text-red-400 hover:text-red-500"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Building Image in Modal */}
            <div
              className="h-64 bg-cover bg-center rounded-lg mb-6"
              style={{ backgroundImage: `url(${selectedBuilding.image})` }}
            />

            <h2 className="text-2xl font-bold text-[#d4af37] mb-4">{selectedBuilding.name}</h2>

            {/* Warning Message */}
            <div className="bg-red-900/20 border border-red-500/50 rounded p-4 mb-6">
              <p className="text-red-400 font-bold mb-2">{language === "es" ? "⚠️ Advertencia" : "⚠️ Warning"}</p>
              <p className="text-sm text-gray-300">
                {language === "es"
                  ? "La demolición es permanente. No recuperarás el oro invertido. Solo liberarás el acre de tierra para nuevas construcciones."
                  : "Demolition is permanent. You won't recover invested gold. You'll only free the acre of land for new constructions."}
              </p>
            </div>

            {/* Quantity Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#d4af37] mb-2">
                {language === "es" ? "Cantidad a Demoler" : "Quantity to Demolish"}
              </label>
              <Input
                type="number"
                min="1"
                max={selectedBuilding.currentQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                className="bg-black/40 border-red-500/30 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                {language === "es" ? "Disponibles:" : "Available:"} {selectedBuilding.currentQuantity}
              </p>
            </div>

            {/* Total Cost Preview */}
            <div className="bg-black/40 border border-red-500/30 rounded p-4 mb-6">
              <h3 className="text-sm font-bold text-red-400 mb-2">
                {language === "es" ? "Coste de Demolición" : "Demolition Cost"}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">{language === "es" ? "Oro:" : "Gold:"}</p>
                  <p className="text-yellow-400 font-bold">{quantity * 500}</p>
                </div>
                <div>
                  <p className="text-gray-400">{language === "es" ? "Turnos:" : "Turns:"}</p>
                  <p className="text-blue-400 font-bold">0</p>
                </div>
                <div>
                  <p className="text-gray-400">{language === "es" ? "Tierra Liberada:" : "Land Freed:"}</p>
                  <p className="text-green-400 font-bold">+{quantity} acres</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {language === "es"
                  ? "Coste: 500 oro por edificio (no consume turnos)"
                  : "Cost: 500 gold per building (doesn't consume turns)"}
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleDemolish}
              disabled={loading}
              className="w-full bg-red-600 text-white hover:bg-red-700 font-bold text-lg py-6"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              {loading
                ? language === "es"
                  ? "Demoliendo..."
                  : "Demolishing..."
                : language === "es"
                  ? "Demoler"
                  : "Demolish"}
            </Button>

            {/* Result Messages */}
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
          </Card>
        </div>
      )}
    </div>
  )
}
