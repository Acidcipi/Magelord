"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Sparkles, Flame, ShieldIcon, Coins, Zap, Loader2, Lock } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"

interface HechizosPageProps {
  language: Language
  gameState: any
  user: any
}

interface MasterSpell {
  id: string
  name: string
  description: string
  category: "Economía" | "Combate"
  spell_type: "Instantáneo" | "Pasivo"
  base_mana_cost: number
  mana_cost_per_turn?: number
  min_magic_level: number
  faction_restriction?: string
  school?: string
  image_url?: string
}

interface LearnedSpell {
  spell_id: string
  province_id: string
}

export function HechizosPage({ language, gameState, user }: HechizosPageProps) {
  const t = useTranslation(language)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"economy" | "combat" | "enchantments">("economy")
  const [selectedSpell, setSelectedSpell] = useState<MasterSpell | null>(null)
  const [spells, setSpells] = useState<MasterSpell[]>([])
  const [learnedSpells, setLearnedSpells] = useState<LearnedSpell[]>([])
  const [loading, setLoading] = useState(true)
  const [casting, setCasting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!user?.faction || !gameState?.province_id) {
      console.log("[v0] ⚠️ Esperando facción y provincia...")
      setLoading(false)
      return
    }

    console.log("[v0] 🔮 Buscando hechizos para:", user.faction)
    fetchSpells()
    fetchLearnedSpells()
  }, [mounted, user?.faction, gameState?.province_id])

  const fetchSpells = async () => {
    if (!user?.faction) {
      console.log("[v0] ❌ No se puede cargar hechizos: facción no disponible")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("[v0] 🔍 Buscando hechizos para:", user.faction)

      const { data, error } = await supabase
        .from("master_spells")
        .select("*")
        .filter("faction_restriction::text", "eq", user.faction)

      if (error) {
        console.error("[v0] ❌ Error fetching spells:", error)
        throw error
      }

      console.log("[v0] ✅ Hechizos encontrados:", data?.length || 0)
      if (data && data.length > 0) {
        console.log("[v0] 📋 Hechizos cargados:", data)
      }

      setSpells(data || [])
    } catch (error) {
      console.error("[v0] ❌ Error in fetchSpells:", error)
      setSpells([])
    } finally {
      setLoading(false)
    }
  }

  const fetchLearnedSpells = async () => {
    if (!gameState?.province_id) return

    try {
      console.log("[v0] 🔍 Buscando hechizos aprendidos para provincia:", gameState.province_id)

      const { data, error } = await supabase
        .from("province_learned_spells")
        .select("*")
        .eq("province_id", gameState.province_id)

      if (error) {
        console.error("[v0] ❌ Error fetching learned spells:", error)
        throw error
      }

      console.log("[v0] ✅ Hechizos aprendidos:", data?.length || 0)
      setLearnedSpells(data || [])
    } catch (error) {
      console.error("[v0] ❌ Error in fetchLearnedSpells:", error)
      setLearnedSpells([])
    }
  }

  const getFilteredSpells = () => {
    if (activeTab === "economy") {
      return spells.filter((s) => s.category === "Economía")
    } else if (activeTab === "combat") {
      return spells.filter((s) => s.category === "Combate" && s.spell_type !== "Pasivo")
    } else {
      return spells.filter((s) => s.spell_type === "Pasivo")
    }
  }

  const isSpellLearned = (spellId: string) => {
    return learnedSpells.some((ls) => ls.spell_id === spellId)
  }

  const playerMagicLevel = user?.magic_level || 1

  const canCastSpell = (spell: MasterSpell) => {
    return (
      isSpellLearned(spell.id) &&
      playerMagicLevel >= spell.min_magic_level &&
      gameState?.mana >= (spell.spell_type === "Pasivo" ? spell.mana_cost_per_turn || 0 : spell.base_mana_cost)
    )
  }

  const handleCastSpell = async () => {
    if (!selectedSpell || !user) return

    try {
      setCasting(true)

      if (gameState.mana < selectedSpell.base_mana_cost) {
        alert(language === "es" ? "Maná insuficiente" : "Insufficient mana")
        return
      }

      // TODO: Implement spell casting logic here
      alert(language === "es" ? "Hechizo lanzado con éxito" : "Spell cast successfully")

      setSelectedSpell(null)
    } catch (error) {
      console.error("[v0] Error casting spell:", error)
      alert(language === "es" ? "Error al lanzar hechizo" : "Error casting spell")
    } finally {
      setCasting(false)
    }
  }

  const filteredSpells = getFilteredSpells()

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-400">
            {language === "es" ? "Libro de Hechizos" : "Spellbook"}
          </h1>
          <p className="text-gray-400">
            {language === "es" ? "Tu biblioteca de poder arcano" : "Your library of arcane power"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">{language === "es" ? "Nivel de Magia" : "Magic Level"}</p>
          <p className="text-3xl font-bold text-purple-400">{playerMagicLevel}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-[#1a1a1a] border border-[#d4af37]/20">
          <TabsTrigger value="economy" className="data-[state=active]:bg-purple-600">
            <Coins className="h-4 w-4 mr-2" />
            {language === "es" ? "Economía" : "Economy"}
          </TabsTrigger>
          <TabsTrigger value="combat" className="data-[state=active]:bg-purple-600">
            <Flame className="h-4 w-4 mr-2" />
            {language === "es" ? "Combate" : "Combat"}
          </TabsTrigger>
          <TabsTrigger value="enchantments" className="data-[state=active]:bg-purple-600">
            <ShieldIcon className="h-4 w-4 mr-2" />
            {language === "es" ? "Encantamientos" : "Enchantments"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : filteredSpells.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-12 text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-400/30" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {language === "es" ? "No hay hechizos disponibles" : "No spells available"}
              </h3>
              <p className="text-gray-500">
                {language === "es"
                  ? "Investiga nuevos hechizos en la sección de Investigación"
                  : "Research new spells in the Research section"}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSpells.map((spell) => {
                const isLearned = isSpellLearned(spell.id)
                const canCast = canCastSpell(spell)

                return (
                  <Card
                    key={spell.id}
                    className={`bg-[#1a1a1a] border-[#d4af37]/20 overflow-hidden cursor-pointer transition-all hover:border-purple-400/50 hover:scale-105 ${
                      !isLearned ? "opacity-50" : ""
                    }`}
                    onClick={() => isLearned && setSelectedSpell(spell)}
                  >
                    {spell.image_url && (
                      <AspectRatio ratio={16 / 9} className="bg-[#0f0f0f]">
                        <Image
                          src={spell.image_url || "/placeholder.svg"}
                          alt={spell.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </AspectRatio>
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-400">{spell.name}</h3>
                          {spell.school && <p className="text-xs text-gray-500 mt-1">{spell.school}</p>}
                        </div>
                        {!isLearned && <Lock className="h-5 w-5 text-gray-500 flex-shrink-0" />}
                      </div>
                      <Badge variant="outline" className="w-fit mt-2">
                        {spell.spell_type}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <p className="text-sm text-gray-300 line-clamp-3">{spell.description}</p>
                    </CardContent>

                    <CardFooter className="pt-3 border-t border-[#d4af37]/10 flex items-center justify-between">
                      <div>
                        {(spell.spell_type === "Pasivo"
                          ? (spell.mana_cost_per_turn || 0) > 0
                          : spell.base_mana_cost > 0) && (
                          <>
                            <p className="text-xs text-gray-500">{language === "es" ? "Coste" : "Cost"}</p>
                            <p className="text-sm font-bold text-blue-400">
                              {spell.spell_type === "Pasivo"
                                ? `${spell.mana_cost_per_turn || 0}/turno`
                                : spell.base_mana_cost}{" "}
                              💎
                            </p>
                          </>
                        )}
                      </div>
                      {!isLearned ? (
                        <Button size="sm" disabled className="bg-gray-700 text-gray-400">
                          <Lock className="h-3 w-3 mr-1" />
                          {language === "es" ? "No investigado" : "Not researched"}
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700" disabled={!canCast}>
                          {language === "es" ? "Lanzar" : "Cast"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedSpell && (
        <Dialog open={!!selectedSpell} onOpenChange={() => setSelectedSpell(null)}>
          <DialogContent className="bg-[#1a1a1a] border-purple-500/50 text-white max-w-2xl">
            <DialogDescription className="sr-only">
              {language === "es" ? "Detalles del hechizo seleccionado" : "Selected spell details"}
            </DialogDescription>
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-400">{selectedSpell.name}</h2>
                {selectedSpell.school && <p className="text-sm text-gray-400">{selectedSpell.school}</p>}
                <Badge variant="outline" className="mt-2">
                  {selectedSpell.spell_type}
                </Badge>
              </div>

              <div className="bg-[#0f0f0f] p-4 rounded border border-purple-500/20">
                <p className="text-gray-300 text-center">{selectedSpell.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                  <p className="text-xs text-gray-400">
                    {selectedSpell.spell_type === "Pasivo"
                      ? language === "es"
                        ? "Coste por Turno"
                        : "Cost per Turn"
                      : language === "es"
                        ? "Coste de Lanzamiento"
                        : "Cast Cost"}
                  </p>
                  <p className="text-2xl font-bold text-blue-400">
                    {selectedSpell.spell_type === "Pasivo"
                      ? selectedSpell.mana_cost_per_turn
                      : selectedSpell.base_mana_cost}
                  </p>
                  <p className="text-xs text-gray-400">Maná</p>
                </div>
                <div className="text-center p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <p className="text-xs text-gray-400">{language === "es" ? "Nivel Requerido" : "Required Level"}</p>
                  <p
                    className={`text-2xl font-bold ${playerMagicLevel >= selectedSpell.min_magic_level ? "text-green-400" : "text-red-400"}`}
                  >
                    {selectedSpell.min_magic_level}
                  </p>
                  <p className="text-xs text-gray-400">{language === "es" ? "Magia" : "Magic"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedSpell(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                  disabled={casting}
                >
                  {language === "es" ? "Cancelar" : "Cancel"}
                </Button>
                <Button
                  onClick={handleCastSpell}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={casting || !canCastSpell(selectedSpell)}
                >
                  {casting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  {language === "es" ? "Lanzar Hechizo" : "Cast Spell"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
