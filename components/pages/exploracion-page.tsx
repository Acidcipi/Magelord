"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Compass } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { GameState } from "@/lib/game-state"
import { supabase } from "@/lib/supabaseClient"

interface ExploracionPageProps {
  language: Language
  gameState: GameState
  onUpdate: () => Promise<void>
}

export function ExploracionPage({ language, gameState, onUpdate }: ExploracionPageProps) {
  const t = useTranslation(language)
  const { toast } = useToast()
  const [turnsToExplore, setTurnsToExplore] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState({ land: 0 })
  const [lastResult, setLastResult] = useState<{ landGained: number; turnsUsed: number } | null>(null)

  useEffect(() => {
    if (typeof turnsToExplore === "number" && turnsToExplore > 0) {
      const currentLand = Number(gameState.land || gameState.acres || 0)
      const landPerTurn = Math.floor(5000000 / (currentLand + 50000) + 20)
      const landGained = landPerTurn * turnsToExplore
      setPreview({ land: landGained })
    } else {
      setPreview({ land: 0 })
    }
  }, [turnsToExplore, gameState.acres, gameState.land])

  const handleExploration = async () => {
    console.log("[v0] 🔍 Starting exploration...")

    const turns = typeof turnsToExplore === "number" ? turnsToExplore : 0

    if (turns < 1) {
      toast({
        title: "Error",
        description: language === "es" ? "Debes usar al menos 1 turno" : "Must use at least 1 turn",
        variant: "destructive",
      })
      return
    }

    if (turns > gameState.turns) {
      toast({
        title: "Error",
        description: language === "es" ? "No tienes suficientes turnos" : "Insufficient turns",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const currentLand = Number(gameState.land || gameState.acres || 0)
      const landPerTurn = Math.floor(5000000 / (currentLand + 50000) + 20)
      const landGained = landPerTurn * turns
      const newLand = currentLand + landGained
      const newTurns = gameState.turns - turns

      console.log("[v0] 📊 Exploration calculation:", {
        currentAcres: currentLand,
        turnsUsed: turns,
        landPerTurn,
        landGained,
        newLand,
        newTurns,
      })

      const { data, error } = await supabase
        .from("provinces")
        .update({
          land: newLand,
          turns: newTurns,
        })
        .eq("id", gameState.province_id)
        .select()
        .single()

      if (error) {
        console.error("[v0] ❌ Exploration failed:", error)
        toast({
          title: "Error",
          description: language === "es" ? "Error al explorar" : "Exploration error",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      console.log("[v0] ✅ Exploration successful:", data)

      toast({
        title: language === "es" ? "¡Éxito!" : "Success!",
        description:
          language === "es"
            ? `Has encontrado ${landGained} acres de tierra nueva usando ${turns} turno${turns > 1 ? "s" : ""}.`
            : `You found ${landGained} acres of new land using ${turns} turn${turns > 1 ? "s" : ""}.`,
        duration: 5000,
      })

      setLastResult({ landGained, turnsUsed: turns })

      await onUpdate()
      setTurnsToExplore("")
    } catch (error) {
      console.error("[v0] ❌ Exploration error:", error)
      toast({
        title: "Error",
        description: language === "es" ? "Error al explorar" : "Exploration error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Compass className="h-8 w-8 text-[#d4af37]" />
        <h1 className="text-3xl font-bold text-[#d4af37]">{t.exploring || "Exploración"}</h1>
      </div>

      <Card
        className="relative overflow-hidden border-2 border-[#d4af37]/30 p-8"
        style={{
          backgroundImage: "url(/fantasy-wilderness-ancient-map-landscape.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 space-y-6">
          <div className="bg-black/60 border border-[#d4af37]/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4">{language === "es" ? "Expansión de Territorio" : "Land Expansion"}</h2>
            <p className="text-gray-300 mb-6">
              {language === "es"
                ? "Envía expediciones para expandir las fronteras de tu provincia. Cada turno te otorga un 5% de tu tierra actual más 2 acres adicionales."
                : "Send expeditions to expand your province borders. Each turn grants you 5% of your current land plus 2 additional acres."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Turnos para Explorar" : "Turns to Explore"}
                </label>
                <Input
                  type="number"
                  min="1"
                  max={gameState.turns}
                  value={turnsToExplore}
                  onChange={(e) => {
                    const val = e.target.value
                    setTurnsToExplore(val === "" ? "" : Number.parseInt(val) || "")
                  }}
                  placeholder={language === "es" ? "Ingresa cantidad de turnos" : "Enter number of turns"}
                  className="bg-black/40 border-[#d4af37]/30 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {language === "es" ? "Turnos disponibles:" : "Available turns:"} {gameState.turns}
                </p>
              </div>

              <div className="bg-black/40 border border-green-500/30 rounded p-4">
                <h3 className="text-sm font-bold text-green-400 mb-3">
                  {language === "es" ? `Estimado: +${preview.land} acres` : `Estimated: +${preview.land} acres`}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">{language === "es" ? "Tierra Actual:" : "Current Land:"}</p>
                    <p className="text-white font-bold">
                      {Number(gameState.land || gameState.acres || 0).toLocaleString()} acres
                    </p>
                  </div>
                </div>
              </div>

              {lastResult && (
                <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border-2 border-[#d4af37] rounded-lg p-4">
                  <h3 className="text-lg font-bold text-[#d4af37] mb-3 flex items-center gap-2">
                    <Compass className="h-5 w-5" />
                    {language === "es" ? "Informe de la última expedición" : "Last Expedition Report"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-black/40 rounded p-3">
                      <p className="text-gray-400 text-xs mb-1">
                        {language === "es" ? "Tierras anexionadas:" : "Land Annexed:"}
                      </p>
                      <p className="text-green-400 font-bold text-lg">
                        +{lastResult.landGained.toLocaleString()} acres
                      </p>
                    </div>
                    <div className="bg-black/40 rounded p-3">
                      <p className="text-gray-400 text-xs mb-1">
                        {language === "es" ? "Esfuerzo realizado:" : "Effort Made:"}
                      </p>
                      <p className="text-[#d4af37] font-bold text-lg">
                        {lastResult.turnsUsed} {language === "es" ? "turnos" : "turns"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleExploration}
                disabled={
                  loading ||
                  !turnsToExplore ||
                  typeof turnsToExplore !== "number" ||
                  turnsToExplore < 1 ||
                  turnsToExplore > gameState.turns
                }
                className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f] font-bold text-lg py-6"
              >
                <Compass className="mr-2 h-5 w-5" />
                {loading
                  ? language === "es"
                    ? "Explorando..."
                    : "Exploring..."
                  : language === "es"
                    ? "Iniciar Exploración"
                    : "Start Exploration"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ExploracionPage
