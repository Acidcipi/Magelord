"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Skull, Loader2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"

interface RitualesPageProps {
  language: Language
  gameState?: any
  user?: any
}

interface MasterRitual {
  id: number
  name: string
  description: string
  channeling_turns: number
  gold_cost: number
  mana_cost: number
  population_cost: number
  sacrifice_units?: any
  effect_description: string
  faction_restriction?: string
  image_url?: string
}

interface UserRitual {
  id: number
  user_id: string
  ritual_id: number
  current_turn: number
  started_at: string
  completed: boolean
}

export function RitualesPage({ language, gameState, user }: RitualesPageProps) {
  const t = useTranslation(language)
  const [mounted, setMounted] = useState(false)
  const [selectedRitual, setSelectedRitual] = useState<MasterRitual | null>(null)
  const [rituals, setRituals] = useState<MasterRitual[]>([])
  const [userRituals, setUserRituals] = useState<UserRitual[]>([])
  const [loading, setLoading] = useState(true)
  const [channeling, setChanneling] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!user?.faction || !user?.id) {
      console.log("[v0] ⚠️ Esperando facción...")
      setLoading(false)
      return
    }

    console.log("[v0] 🔮 Usuario listo - Facción:", user.faction)
    fetchRituals()
    fetchUserRituals()
  }, [mounted, user?.faction, user?.id])

  useEffect(() => {
    if (!mounted) return
    if (!gameState?.province_id) {
      console.log("[v0] ⚠️ Esperando province_id...")
      setLoading(false)
      return
    }

    console.log("[v0] 🔮 Province ready - Loading learned rituals")
    fetchLearnedRituals()
  }, [mounted, gameState?.province_id])

  const fetchRituals = async () => {
    if (!user?.faction) {
      console.log("[v0] ❌ No se puede cargar rituales: facción no disponible")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("[v0] 🔍 Facción enviada:", user.faction)

      const { data, error } = await supabase.from("master_rituals").select("*").eq("faction_restriction", user.faction)

      if (error) {
        console.error("[v0] ❌ Error fetching rituals:", error)
        throw error
      }

      console.log("[v0] ✅ Data recibida:", data?.length || 0, "rituales")
      if (data && data.length > 0) {
        console.table(data.map((r) => ({ nombre: r.name, turnos: r.channeling_turns, oro: r.gold_cost })))
      }

      const ritualsWithParsedData = (data || []).map((ritual) => ({
        ...ritual,
        sacrifice_units: ritual.sacrifice_units || {},
      }))

      setRituals(ritualsWithParsedData)
    } catch (error) {
      console.error("[v0] ❌ Error in fetchRituals:", error)
      setRituals([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRituals = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase.from("user_rituals").select("*").eq("user_id", user.id)

      if (error) throw error
      setUserRituals(data || [])
    } catch (error) {
      console.error("[v0] ❌ Error fetching user rituals:", error)
      setUserRituals([])
    }
  }

  const fetchLearnedRituals = async () => {
    if (!gameState?.province_id) {
      console.log("[v0] ❌ No se puede cargar rituales: province_id no disponible")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("[v0] 🔍 Fetching learned rituals for province:", gameState.province_id)

      const { data, error } = await supabase
        .from("master_rituals")
        .select("*, province_learned_rituals!inner(province_id)")
        .eq("province_learned_rituals.province_id", gameState.province_id)

      if (error) {
        console.error("[v0] ❌ Error fetching learned rituals:", error)
        throw error
      }

      console.log("[v0] ✅ Learned rituals loaded:", data?.length || 0)

      const ritualsWithParsedData = (data || []).map((ritual) => ({
        ...ritual,
        sacrifice_units: ritual.sacrifice_units || {},
      }))

      setRituals(ritualsWithParsedData)
    } catch (error) {
      console.error("[v0] ❌ Error in fetchLearnedRituals:", error)
      setRituals([])
    } finally {
      setLoading(false)
    }
  }

  const canStartRitual = (ritual: MasterRitual) => {
    if (!gameState) return false

    return (
      gameState.gold >= ritual.gold_cost &&
      gameState.mana >= ritual.mana_cost &&
      gameState.population >= ritual.population_cost
    )
  }

  const getRitualProgress = (ritual: MasterRitual) => {
    const userRitual = userRituals.find((ur) => ur.ritual_id === ritual.id && !ur.completed)
    if (!userRitual) return null

    const progress = (userRitual.current_turn / ritual.channeling_turns) * 100
    const turnsRemaining = ritual.channeling_turns - userRitual.current_turn

    return {
      progress,
      turnsRemaining,
      currentTurn: userRitual.current_turn,
    }
  }

  const handleStartRitual = async () => {
    if (!selectedRitual || !user) return

    try {
      setChanneling(true)

      if (!canStartRitual(selectedRitual)) {
        alert(language === "es" ? "Recursos insuficientes" : "Insufficient resources")
        return
      }

      const { error: updateError } = await supabase
        .from("provinces")
        .update({
          gold: gameState.gold - selectedRitual.gold_cost,
          mana: gameState.mana - selectedRitual.mana_cost,
          population: gameState.population - selectedRitual.population_cost,
        })
        .eq("user_id", user.id)

      if (updateError) throw updateError

      const { error: insertError } = await supabase.from("user_rituals").insert({
        user_id: user.id,
        ritual_id: selectedRitual.id,
        current_turn: 0,
        started_at: new Date().toISOString(),
        completed: false,
      })

      if (insertError) throw insertError

      alert(language === "es" ? "Ritual iniciado" : "Ritual started")
      await fetchUserRituals()
      setSelectedRitual(null)
    } catch (error) {
      console.error("[v0] Error starting ritual:", error)
      alert(language === "es" ? "Error al iniciar ritual" : "Error starting ritual")
    } finally {
      setChanneling(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Image src="/images/rituals/general/ritual-circle-magic.jpg" alt="Ritual magic" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl font-bold text-[#d4af37] mb-2">
            {language === "es" ? "Cámara de Rituales" : "Ritual Chamber"}
          </h1>
          <p className="text-gray-300">
            {language === "es"
              ? "Rituales aprendidos listos para ser iniciados"
              : "Learned rituals ready to be initiated"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
        </div>
      ) : rituals.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-12 text-center">
          <Skull className="h-16 w-16 mx-auto mb-4 text-[#d4af37]/30" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {language === "es" ? "No has aprendido rituales aún" : "You haven't learned any rituals yet"}
          </h3>
          <p className="text-sm text-gray-500">
            {language === "es"
              ? "Investiga rituales en el Centro de Investigación"
              : "Research rituals in the Research Center"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rituals.map((ritual) => {
            const progress = getRitualProgress(ritual)
            const canStart = canStartRitual(ritual)

            return (
              <Card
                key={ritual.id}
                className={`relative overflow-hidden cursor-pointer hover:scale-105 transition-transform ${
                  progress ? "border-2 border-[#d4af37]" : "border border-purple-500/30"
                }`}
                onClick={() => !progress && setSelectedRitual(ritual)}
              >
                <div className="relative h-96">
                  <Image src={ritual.image_url || "/placeholder.svg"} alt={ritual.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <Flame className="h-8 w-8 text-[#d4af37]" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-[#d4af37] mb-2">{ritual.name}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-4">{ritual.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {ritual.gold_cost > 0 && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                          💰 {ritual.gold_cost.toLocaleString()}
                        </Badge>
                      )}
                      {ritual.mana_cost > 0 && (
                        <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                          💎 {ritual.mana_cost.toLocaleString()}
                        </Badge>
                      )}
                      {ritual.population_cost > 0 && (
                        <Badge variant="outline" className="text-red-400 border-red-400/30">
                          👥 {ritual.population_cost.toLocaleString()}
                        </Badge>
                      )}
                    </div>

                    {progress ? (
                      <div className="space-y-2">
                        <Progress value={progress.progress} className="h-2" />
                        <p className="text-xs text-orange-400">
                          {language === "es" ? "Turnos restantes:" : "Turns remaining:"} {progress.turnsRemaining}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        {ritual.channeling_turns} {language === "es" ? "turnos necesarios" : "turns required"}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {selectedRitual && (
        <Dialog open={!!selectedRitual} onOpenChange={() => setSelectedRitual(null)}>
          <DialogContent className="bg-[#1a1a1a] border-[#d4af37] text-white max-w-md">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4">{selectedRitual.name}</h2>
            <p className="text-gray-300 text-sm mb-4">{selectedRitual.description}</p>

            <div className="space-y-4">
              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <h3 className="font-bold text-[#d4af37] mb-2">{language === "es" ? "Costes:" : "Costs:"}</h3>
                <div className="space-y-1 text-sm">
                  {selectedRitual.gold_cost > 0 && (
                    <p className="text-yellow-400">💰 {selectedRitual.gold_cost.toLocaleString()} Oro</p>
                  )}
                  {selectedRitual.mana_cost > 0 && (
                    <p className="text-purple-400">💎 {selectedRitual.mana_cost.toLocaleString()} Maná</p>
                  )}
                  {selectedRitual.population_cost > 0 && (
                    <p className="text-red-400">👥 {selectedRitual.population_cost.toLocaleString()} Población</p>
                  )}
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded border border-[#d4af37]/20">
                <p className="text-sm">
                  {language === "es" ? "Duración:" : "Duration:"}{" "}
                  <span className="font-bold text-orange-400">{selectedRitual.channeling_turns} turnos</span>
                </p>
              </div>

              <div className="bg-purple-900/20 p-4 rounded border border-purple-500/30">
                <h4 className="font-bold text-purple-400 mb-1">{language === "es" ? "Efecto:" : "Effect:"}</h4>
                <p className="text-sm text-gray-300">{selectedRitual.effect_description}</p>
              </div>

              <Button
                onClick={handleStartRitual}
                disabled={channeling || !canStartRitual(selectedRitual)}
                className="w-full bg-[#d4af37] hover:bg-[#f4cf5f] text-black font-bold py-3"
              >
                {channeling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {language === "es" ? "Iniciando..." : "Starting..."}
                  </>
                ) : (
                  <>{language === "es" ? "Iniciar Ritual" : "Start Ritual"}</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
