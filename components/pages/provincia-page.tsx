"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Compass, Hammer, TrendingUp, X } from "lucide-react"

interface ProvinciaPageProps {
  language: Language
  province: any
  user: any
  onProvinceUpdate: (province: any) => void
}

export function ProvinciaPage({ language, province, user, onProvinceUpdate }: ProvinciaPageProps) {
  const t = useTranslation(language)

  const [soldierCount, setSoldierCount] = useState("")
  const [isExploring, setIsExploring] = useState(false)
  const [showExplorationModal, setShowExplorationModal] = useState(false)

  const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null)
  const [buildQuantity, setBuildQuantity] = useState("")
  const [isConstructing, setIsConstructing] = useState(false)

  const [history, setHistory] = useState<any[]>([])

  const buildings = [
    {
      id: "farm",
      name: t.farm || "Granja",
      description: t.farmDesc || "Genera Comida (+20/ciclo)",
      baseCost: 500,
      goldCost: 500,
      turnCost: 1,
      landCost: 1,
      icon: "🌾",
      produces: t.foodBag || "Comida",
      productionValue: "+20",
      bgImage: "/medieval-farm-fields.jpg",
      currentOwned: 25,
    },
    {
      id: "mine",
      name: t.goldMine || "Mina de Oro",
      description: "Genera Oro (+100/ciclo)",
      baseCost: 700,
      goldCost: 700,
      turnCost: 1,
      landCost: 1,
      icon: "⛏️",
      produces: t.goldCoin || "Oro",
      productionValue: "+100",
      bgImage: "/medieval-gold-mine.jpg",
      currentOwned: 18,
    },
    {
      id: "barracks",
      name: t.barracks || "Cuarteles",
      description: "Permite reclutar soldados",
      baseCost: 1000,
      goldCost: 1000,
      turnCost: 2,
      landCost: 1,
      icon: "⚔️",
      produces: t.troopTraining || "Tropas",
      productionValue: "Rápido",
      bgImage: "/medieval-military-barracks.jpg",
      currentOwned: 12,
    },
    {
      id: "mage_tower",
      name: t.mageTower || "Torres de Mago",
      description: "Genera Maná (+15/ciclo)",
      baseCost: 1200,
      goldCost: 1200,
      turnCost: 2,
      landCost: 1,
      icon: "🔮",
      produces: t.manaPotion || "Maná",
      productionValue: "+15",
      bgImage: "/magical-wizard-tower.jpg",
      currentOwned: 10,
    },
    {
      id: "fort",
      name: "Fuertes",
      description: "Aumenta Defensa (+50/fuerte)",
      baseCost: 1500,
      goldCost: 1500,
      turnCost: 2,
      landCost: 2,
      icon: "🏰",
      produces: t.defensiveBonus || "Defensa",
      productionValue: "+50",
      bgImage: "/medieval-stone-fortress.jpg",
      currentOwned: 8,
    },
    {
      id: "wall",
      name: t.wall || "Muralla",
      description: "% Reducción daño recibido",
      baseCost: 2500,
      goldCost: 2500,
      turnCost: 3,
      landCost: 2,
      icon: "🛡️",
      produces: t.damageReduction || "Protección",
      productionValue: "-10%",
      bgImage: "/medieval-castle-walls.jpg",
      currentOwned: 5,
    },
  ]

  const calculateExplorationCost = () => {
    const soldiers = Number.parseInt(soldierCount) || 0
    if (soldiers <= 0) return { gold: 0, turns: 0, land: 0 }

    const goldCost = 100
    const turnsCost = 2
    const currentLand = province?.land || 500
    const diminishingFactor = Math.max(1, currentLand / 100)
    let landFound = (soldiers * 0.5) / diminishingFactor

    if (user?.class === "cazador" || user?.class === "hunter") {
      landFound *= 1.2
    }

    landFound = Math.floor(landFound)
    if (landFound < 1) landFound = 1

    return { gold: goldCost, turns: turnsCost, land: landFound }
  }

  const handleExploration = async () => {
    setIsExploring(true)
    setShowExplorationModal(false)

    try {
      const token = localStorage.getItem("session_token")
      const response = await fetch("/api/exploration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unitsSent: Number.parseInt(soldierCount),
        }),
      })

      const data = await response.json()

      if (data.success) {
        onProvinceUpdate(data.data.province)
        setHistory((prev) =>
          [
            {
              type: "exploration",
              message: `${t.successExploration} +${data.data.landFound} ${t.land}`,
              timestamp: new Date().toLocaleString(),
            },
            ...prev,
          ].slice(0, 10),
        )
        setSoldierCount("")
      } else {
        alert(t.errorExploration + ": " + data.error)
      }
    } catch (error) {
      console.error("[v0] Exploration error:", error)
      alert(t.errorExploration)
    } finally {
      setIsExploring(false)
    }
  }

  const handleConstruction = async () => {
    if (!selectedBuilding) return

    setIsConstructing(true)

    try {
      const token = localStorage.getItem("session_token")
      const response = await fetch("/api/construction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          buildingType: selectedBuilding.id,
          quantity: Number.parseInt(buildQuantity),
        }),
      })

      const data = await response.json()

      if (data.success) {
        onProvinceUpdate(data.data.province)
        setHistory((prev) =>
          [
            {
              type: "construction",
              message: `${t.successConstruction} ${buildQuantity}x ${selectedBuilding?.name}`,
              timestamp: new Date().toLocaleString(),
            },
            ...prev,
          ].slice(0, 10),
        )
        setBuildQuantity("")
        setSelectedBuilding(null)
      } else {
        alert(t.errorConstruction + ": " + data.error)
      }
    } catch (error) {
      console.error("[v0] Construction error:", error)
      alert(t.errorConstruction)
    } finally {
      setIsConstructing(false)
    }
  }

  const explorationCost = calculateExplorationCost()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.provinceManagement}</h1>

      <Card
        className="bg-cover bg-center border-2 border-[#d4af37]/40 overflow-hidden relative min-h-[280px]"
        style={{ backgroundImage: `url('/fantasy-wilderness-ancient-map-landscape.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60 backdrop-blur-[2px]" />
        <div className="relative p-8">
          <div className="flex items-center gap-3 mb-6">
            <Compass className="h-10 w-10 text-[#d4af37] drop-shadow-lg" />
            <div>
              <h2 className="text-3xl font-bold text-[#d4af37] drop-shadow-lg">{t.landExploration}</h2>
              <p className="text-gray-200 text-base mt-1">{t.explorationDescription}</p>
            </div>
          </div>

          <div className="max-w-2xl bg-black/60 backdrop-blur-sm border border-[#d4af37]/30 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-gray-200 font-semibold mb-3">{t.assignSoldiers}</label>
                <Input
                  type="number"
                  value={soldierCount}
                  onChange={(e) => setSoldierCount(e.target.value)}
                  placeholder="0"
                  className="bg-black/70 border-[#d4af37]/50 text-white text-lg h-12"
                  min="1"
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>{t.cost}:</span>
                    <span className="text-yellow-400 font-bold">
                      {explorationCost.gold} {t.gold}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>{t.turns_unit}:</span>
                    <span className="text-blue-400 font-bold">{explorationCost.turns}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>{t.land} estimado:</span>
                    <span className="text-green-400 font-bold">~{explorationCost.land}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowExplorationModal(true)}
                disabled={!soldierCount || Number.parseInt(soldierCount) <= 0 || isExploring}
                className="bg-[#d4af37] text-black hover:bg-[#f4cf5f] disabled:opacity-50 h-12 text-lg font-bold"
              >
                <Compass className="mr-2 h-5 w-5" />
                {isExploring ? t.exploring : t.exploreLands}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-[#d4af37] mb-6">{t.buildingsManagement}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildings.map((building) => (
            <Card
              key={building.id}
              onClick={() => setSelectedBuilding(building)}
              className="bg-cover bg-center border-2 border-[#d4af37]/20 overflow-hidden hover:border-[#d4af37]/60 transition-all cursor-pointer relative h-[200px]"
              style={{ backgroundImage: `url('${building.bgImage}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-black/85" />
              <div className="relative p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl drop-shadow-lg">{building.icon}</span>
                    <h3 className="text-xl font-bold text-[#d4af37]">{building.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{building.description}</p>
                </div>

                <div className="flex justify-between items-end">
                  {/* Bottom Left: Costs */}
                  <div className="text-sm space-y-1">
                    <div className="text-gray-300">
                      {t.cost}:{" "}
                      <span className="text-yellow-400 font-bold">
                        {building.goldCost} {t.gold}
                      </span>
                    </div>
                    <div className="text-gray-300">
                      {t.turns_unit}: <span className="text-blue-400 font-bold">{building.turnCost}</span>
                    </div>
                    <div className="text-gray-300">
                      {t.land}: <span className="text-orange-400 font-bold">{building.landCost}</span>
                    </div>
                  </div>

                  {/* Bottom Right: Total Production */}
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">{t.totalProduction}</p>
                    <p className="text-lg font-bold text-green-400">
                      {building.productionValue} {building.produces}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <Card className="bg-[#1a1a1a] border border-[#d4af37]/20 p-6">
          <h3 className="text-xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t.buildingHistory}
          </h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-black/30 p-3 rounded">
                <span className="text-gray-300">{item.message}</span>
                <span className="text-gray-500 text-sm">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showExplorationModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="bg-[#1a1a1a] border-2 border-[#d4af37] p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-[#d4af37] mb-4">{t.confirmExploration}</h3>
            <p className="text-gray-300 mb-4">{t.areYouSure}</p>
            <div className="bg-black/50 p-4 rounded mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">{t.assignSoldiers}:</span>
                <span className="text-white font-bold">{soldierCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.cost}:</span>
                <span className="text-yellow-400 font-bold">
                  {explorationCost.gold} {t.gold}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.turns_unit}:</span>
                <span className="text-blue-400 font-bold">{explorationCost.turns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.land} estimado:</span>
                <span className="text-green-400 font-bold">~{explorationCost.land}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowExplorationModal(false)} variant="outline" className="flex-1">
                {t.cancel}
              </Button>
              <Button onClick={handleExploration} className="flex-1 bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
                {t.confirm}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {selectedBuilding && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1a1a1a] border-2 border-[#d4af37] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Building artistic image */}
            <div
              className="h-64 bg-cover bg-center relative"
              style={{ backgroundImage: `url('${selectedBuilding.bgImage}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]" />
              <Button
                onClick={() => setSelectedBuilding(null)}
                variant="ghost"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selectedBuilding.icon}</span>
                <div>
                  <h3 className="text-3xl font-bold text-[#d4af37]">{selectedBuilding.name}</h3>
                  <p className="text-gray-400">{selectedBuilding.description}</p>
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300 font-semibold">Cantidad que posees:</span>
                  <span className="text-[#d4af37] text-2xl font-bold">{selectedBuilding.currentOwned}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Costo unitario:</span>
                    <p className="text-yellow-400 font-bold">
                      {selectedBuilding.goldCost} {t.gold}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Producción:</span>
                    <p className="text-green-400 font-bold">
                      {selectedBuilding.productionValue} {selectedBuilding.produces}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Turnos:</span>
                    <p className="text-blue-400 font-bold">{selectedBuilding.turnCost}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tierra:</span>
                    <p className="text-orange-400 font-bold">{selectedBuilding.landCost}</p>
                  </div>
                </div>
              </div>

              {/* Construction controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Cantidad a construir:</label>
                  <Input
                    type="number"
                    value={buildQuantity}
                    onChange={(e) => setBuildQuantity(e.target.value)}
                    placeholder="0"
                    className="bg-black/50 border-[#d4af37]/30 text-white text-lg h-12"
                    min="1"
                  />
                </div>

                {buildQuantity && Number.parseInt(buildQuantity) > 0 && (
                  <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded p-4 space-y-2">
                    <h4 className="text-[#d4af37] font-bold mb-2">Costo Total:</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Oro:</span>
                      <span className="text-yellow-400 font-bold">
                        {selectedBuilding.goldCost * Number.parseInt(buildQuantity)} {t.gold}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Turnos:</span>
                      <span className="text-blue-400 font-bold">
                        {Math.ceil((selectedBuilding.turnCost * Number.parseInt(buildQuantity)) / 2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tierra:</span>
                      <span className="text-orange-400 font-bold">
                        {selectedBuilding.landCost * Number.parseInt(buildQuantity)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => setSelectedBuilding(null)} variant="outline" className="flex-1">
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={handleConstruction}
                    disabled={!buildQuantity || Number.parseInt(buildQuantity) <= 0 || isConstructing}
                    className="flex-1 bg-[#d4af37] text-black hover:bg-[#f4cf5f] disabled:opacity-50"
                  >
                    <Hammer className="mr-2 h-4 w-4" />
                    {isConstructing ? t.constructing : t.constructBuildings}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
