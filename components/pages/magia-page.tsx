"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"

interface MasterSpell {
  id: string
  name: string
  description: string
  base_mana_cost: number
  effect_type: string
  effect_value: number
  duration_turns: number
  cooldown_turns: number
  faction_restriction: string | null
  tier: number
  image_url: string | null
}

interface MagiaPageProps {
  language: Language
  gameState?: any
  user?: any
}

export function MagiaPage({ language, gameState, user }: MagiaPageProps) {
  const t = useTranslation(language)
  const { toast } = useToast()
  const [spells, setSpells] = useState<MasterSpell[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSpells()
  }, [user?.faction, gameState?.province_id])

  const fetchSpells = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("master_spells")
        .select("*, province_learned_spells!inner(province_id)")
        .eq("province_learned_spells.province_id", gameState?.province_id)
        .order("tier", { ascending: true })

      if (error) {
        console.error("[v0] ❌ Error fetching spells:", error)
        toast({
          title: language === "es" ? "Error" : "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      console.log("[v0] ✨ Loaded learned spells from database:", data?.length || 0)
      setSpells(data || [])
    } catch (error: any) {
      console.error("[v0] ❌ Error fetching spells:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCastSpell = async (spell: MasterSpell) => {
    const currentMana = Number(gameState?.mana || 0)

    if (currentMana < spell.base_mana_cost) {
      toast({
        title: language === "es" ? "Maná Insuficiente" : "Insufficient Mana",
        description:
          language === "es"
            ? `Necesitas ${spell.base_mana_cost} de maná. Tienes ${currentMana}.`
            : `You need ${spell.base_mana_cost} mana. You have ${currentMana}.`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: language === "es" ? "Hechizo Lanzado" : "Spell Cast",
      description:
        language === "es" ? `Has lanzado ${spell.name} correctamente` : `You have successfully cast ${spell.name}`,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#d4af37]">{language === "es" ? "Libro de Hechizos" : "Spellbook"}</h1>
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <img
          src="/images/spells/general/magic-spells.jpg"
          alt="Magic spells"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent rounded-lg" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl font-bold text-[#d4af37] mb-2">
            {language === "es" ? "Libro de Hechizos" : "Spellbook"}
          </h1>
          <p className="text-gray-300">
            {language === "es"
              ? "Domina las artes arcanas y lanza poderosos hechizos"
              : "Master the arcane arts and cast powerful spells"}
          </p>
        </div>
      </div>

      {gameState && (
        <Card className="bg-[#1a1a1a] border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="text-[#d4af37] font-semibold">
                {language === "es" ? "Maná Disponible:" : "Available Mana:"}
              </span>
            </div>
            <span className="text-2xl font-bold text-purple-400">{Number(gameState?.mana || 0).toLocaleString()}</span>
          </div>
        </Card>
      )}

      {spells.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-8 text-center">
          <p className="text-gray-400">
            {language === "es" ? "No hay hechizos disponibles para tu facción" : "No spells available for your faction"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spells.map((spell) => {
            const canAfford = Number(gameState?.mana || 0) >= spell.base_mana_cost

            return (
              <Card
                key={spell.id}
                className={`bg-gradient-to-br from-purple-900/20 to-[#1a1a1a] border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all ${
                  !canAfford ? "opacity-60" : ""
                }`}
              >
                {spell.image_url && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={spell.image_url || "/placeholder.svg"}
                      alt={spell.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent" />

                    {/* Content overlay on image */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-purple-300 drop-shadow-lg">{spell.name}</h3>
                        <span className="text-xs bg-purple-500/80 text-white px-2 py-1 rounded backdrop-blur-sm">
                          {language === "es" ? `Nivel ${spell.tier}` : `Tier ${spell.tier}`}
                        </span>
                      </div>

                      <p className="text-gray-200 text-sm drop-shadow-lg line-clamp-2">{spell.description}</p>

                      <div className="flex gap-2 text-xs">
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-purple-500/30">
                          <p className="text-gray-300">{language === "es" ? "Coste" : "Cost"}</p>
                          <p className="text-purple-300 font-bold">
                            {spell.base_mana_cost} {language === "es" ? "Maná" : "Mana"}
                          </p>
                        </div>
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-blue-500/30">
                          <p className="text-gray-300">{language === "es" ? "Duración" : "Duration"}</p>
                          <p className="text-blue-300 font-bold">
                            {spell.duration_turns} {language === "es" ? "turnos" : "turns"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
