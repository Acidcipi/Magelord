"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Zap, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface HechizosActivosPageProps {
  language: Language
  gameState?: any
}

export function HechizosActivosPage({ language, gameState }: HechizosActivosPageProps) {
  const t = useTranslation(language)
  const [cooldowns, setCooldowns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCooldowns()
  }, [gameState?.province_id])

  const fetchCooldowns = async () => {
    if (!gameState?.province_id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("province_cooldowns")
        .select("*, master_spells(name, base_mana_cost)")
        .eq("province_id", gameState.province_id)
        .order("expires_at", { ascending: true })

      if (error) {
        console.error("[v0] Error fetching cooldowns:", error)
        setCooldowns([])
      } else {
        setCooldowns(data || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching cooldowns:", error)
      setCooldowns([])
    } finally {
      setLoading(false)
    }
  }

  const calculateTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return "00:00:00"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#d4af37]">
          {language === "es" ? "Hechizos Activos" : "Active Spells"}
        </h1>
        <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
            <p className="text-gray-400">{language === "es" ? "Cargando..." : "Loading..."}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{language === "es" ? "Hechizos Activos" : "Active Spells"}</h1>
      <p className="text-gray-400">
        {language === "es"
          ? "Panel de monitorización de habilidades en tiempo de recarga. Ciertas acciones críticas tienen un tiempo de espera obligatorio antes de poder ser ejecutadas nuevamente."
          : "Monitoring panel for abilities on cooldown. Certain critical actions have mandatory waiting periods before they can be executed again."}
      </p>

      {cooldowns.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-64 h-64">
              <img
                src="/fantasy-wizard-meditating-empty-magical-chamber-.jpg"
                alt="No cooldowns"
                className="w-full h-full object-cover rounded-lg opacity-50"
              />
            </div>
            <div>
              <AlertCircle className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#d4af37] mb-2">
                {language === "es" ? "No Hay Hechizos en Recarga" : "No Spells on Cooldown"}
              </h3>
              <p className="text-gray-400">
                {language === "es"
                  ? "Todos tus hechizos están listos para ser lanzados. ¡El poder mágico está a tu disposición!"
                  : "All your spells are ready to be cast. Magical power is at your disposal!"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {cooldowns.map((cooldown) => (
            <Card
              key={cooldown.id}
              className="bg-gradient-to-r from-purple-900/20 to-black border border-[#d4af37]/20 p-4 hover:border-[#d4af37]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-purple-400">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#d4af37]">
                      {cooldown.master_spells?.name || "Unknown Spell"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {language === "es" ? "Hechizo" : "Spell"} | {language === "es" ? "Coste" : "Cost"}:{" "}
                      {cooldown.master_spells?.base_mana_cost || 0} Maná
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-orange-400">
                    {calculateTimeRemaining(cooldown.expires_at)}
                  </p>
                  <p className="text-xs text-gray-500">{language === "es" ? "Tiempo restante" : "Time remaining"}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-6">
        <h3 className="text-lg font-semibold text-[#d4af37] mb-3">
          {language === "es" ? "¿Cómo funcionan los Cooldowns?" : "How do Cooldowns work?"}
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            <span className="text-cyan-400 font-bold">
              {language === "es" ? "Hechizos de Élite:" : "Elite Spells:"}
            </span>{" "}
            {language === "es"
              ? "Los hechizos más poderosos requieren tiempo de recarga extenso (4-12 horas)."
              : "The most powerful spells require extensive cooldown time (4-12 hours)."}
          </p>
          <p>
            <span className="text-cyan-400 font-bold">{language === "es" ? "Sabotaje:" : "Sabotage:"}</span>{" "}
            {language === "es"
              ? "Acciones de espionaje y robo tienen cooldowns cortos (15-30 min)."
              : "Espionage and theft actions have short cooldowns (15-30 min)."}
          </p>
          <p>
            <span className="text-cyan-400 font-bold">
              {language === "es" ? "Habilidades Especiales:" : "Special Abilities:"}
            </span>{" "}
            {language === "es"
              ? "Habilidades únicas de tropas o artefactos tienen cooldowns variables."
              : "Unique abilities from troops or artifacts have variable cooldowns."}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          💡{" "}
          {language === "es"
            ? "Recibirás una notificación cuando un cooldown importante llegue a cero."
            : "You'll receive a notification when an important cooldown reaches zero."}
        </p>
      </Card>
    </div>
  )
}
