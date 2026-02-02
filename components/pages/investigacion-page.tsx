"use client"

import { useState, useEffect } from "react"
import type { Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookOpen, Clock, Coins, Zap, Scroll, Users, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface InvestigacionPageProps {
  language: Language
  user: any
  gameState: any
  onUpdate: () => Promise<void>
}

type ResearchTab = "UNIT" | "SPELL" | "RITUAL" | null

interface ResearchOption {
  id: string
  name: string
  description: string
  tier: number
  turns_cost: number
  image_url: string
  gold_cost?: number
  mana_cost?: number
  research_gold_cost?: number
  research_mana_cost?: number
  research_turns?: number
}

export function InvestigacionPage({ language, user, gameState, onUpdate }: InvestigacionPageProps) {
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  const [selectedCategory, setSelectedCategory] = useState<ResearchTab>(null)
  const [activeTab, setActiveTab] = useState<ResearchTab>("UNIT")
  const [researchOptions, setResearchOptions] = useState<ResearchOption[]>([])
  const [selectedOption, setSelectedOption] = useState<ResearchOption | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [researchQueue, setResearchQueue] = useState<any[]>([])
  const [accelerateModalOpen, setAccelerateModalOpen] = useState(false)
  const [turnsToInvest, setTurnsToInvest] = useState(1)
  const [selectedResearch, setSelectedResearch] = useState<any>(null)
  const [isAutomatic, setIsAutomatic] = useState(true)
  const [initialTurnsToInvest, setInitialTurnsToInvest] = useState(0)
  const [loadingOptions, setLoadingOptions] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSelectedCategory(null)
  }, [])

  useEffect(() => {
    if (mounted && gameState?.province_id && activeTab) {
      loadResearchOptionsForTab(activeTab)
    }
  }, [activeTab, mounted, gameState?.province_id])

  useEffect(() => {
    if (mounted && gameState?.province_id) {
      loadResearchQueue()
    }
  }, [mounted, gameState?.province_id])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (gameState?.province_id) {
        console.log("[v0] ⏰ Ticking research queue...")
        await supabase.rpc("tick_research_queue", { p_province_id: gameState.province_id })
        loadResearchQueue()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [gameState?.province_id])

  const loadResearchOptionsForTab = async (tab: string) => {
    if (!gameState) return

    setLoadingOptions(true)
    try {
      console.log("[v0] 📖 Loading research options for tab:", tab)

      const { data: existingOptions, error: optionsError } = await supabase
        .from("province_research_options")
        .select("*")
        .eq("province_id", gameState.province_id)
        .eq("category", tab)
        .maybeSingle()

      if (optionsError) {
        console.error("[v0] ❌ Error loading research options:", optionsError)
        setLoadingOptions(false)
        return
      }

      console.log("[v0] 📊 Existing options:", existingOptions)

      const shouldRegenerate =
        !existingOptions ||
        !existingOptions.generated_at ||
        Date.now() - new Date(existingOptions.generated_at).getTime() > 24 * 60 * 60 * 1000

      if (shouldRegenerate) {
        console.log("[v0] 🔄 Regenerating research options for category:", tab)
        const { error: rpcError } = await supabase.rpc("generate_research_options", {
          p_province_id: gameState.province_id,
          p_category: tab,
        })

        if (rpcError) {
          console.error("[v0] ❌ RPC generation error:", rpcError)
          toast({
            title: language === "es" ? "Error" : "Error",
            description: language === "es" ? "No se pudieron generar opciones" : "Could not generate options",
            variant: "destructive",
          })
          setLoadingOptions(false)
          return
        }

        const { data: newOptions } = await supabase
          .from("province_research_options")
          .select("*")
          .eq("province_id", gameState.province_id)
          .eq("category", tab)
          .maybeSingle()

        if (newOptions) {
          await fetchResearchOptionsData(newOptions)
        }
      } else {
        if (existingOptions && !existingOptions.option_3_id) {
          console.log("[v0] 🔄 Background regeneration: option_3_id is null")
          supabase
            .rpc("generate_research_options", {
              p_province_id: gameState.province_id,
              p_category: tab,
            })
            .then(({ error }) => {
              if (!error) {
                console.log("[v0] ✅ Background regeneration completed")
                loadResearchOptionsForTab(tab)
              }
            })
        }
        await fetchResearchOptionsData(existingOptions)
      }
    } catch (error) {
      console.error("[v0] ❌ loadResearchOptionsForTab error:", error)
    } finally {
      setLoadingOptions(false)
    }
  }

  const loadResearchQueue = async () => {
    if (!gameState?.province_id) return

    try {
      const { data, error } = await supabase
        .from("province_research_queue")
        .select("*")
        .eq("province_id", gameState.province_id)
        .gt("turns_remaining", 0)

      if (!error && data) {
        setResearchQueue(data || [])
      }
    } catch (error) {
      console.error("[v0] ❌ Error loading research queue:", error)
    }
  }

  const fetchResearchOptionsData = async (options: any) => {
    const ids = [options.option_1_id, options.option_2_id, options.option_3_id].filter(Boolean)

    console.log("[v0] 🔍 Loading options from IDs:", ids)
    console.log("[v0] 📊 Category:", activeTab)

    if (ids.length === 0) {
      console.log("[v0] ⚠️ No option IDs found - research completed")
      setResearchOptions([])
      return
    }

    let tableName = ""
    if (activeTab === "UNIT") {
      tableName = "master_units"
    } else if (activeTab === "SPELL") {
      tableName = "master_spells"
    } else if (activeTab === "RITUAL") {
      tableName = "master_rituals"
    }

    const { data, error } = await supabase.from(tableName).select("*").in("id", ids)

    if (error) {
      console.error("[v0] ❌ Error fetching master data:", error)
      setResearchOptions([])
      return
    }

    console.log("[v0] ✅ Loaded", data?.length, "research options from", tableName)
    console.log("[v0] 📊 First option full data:", data?.[0])
    console.log(
      "[v0] 💰 Costs - Gold:",
      data?.[0]?.research_gold_cost,
      "Mana:",
      data?.[0]?.research_mana_cost,
      "Turns:",
      data?.[0]?.research_turns,
    )
    setResearchOptions(data || [])
  }

  const handleResearch = async () => {
    if (!selectedOption || !gameState) return

    setLoading(true)
    try {
      const goldCost = selectedOption.research_gold_cost || 0
      const manaCost = selectedOption.research_mana_cost || 0
      const turnsCost = selectedOption.research_turns || 0

      const existingResearch = researchQueue.find((item) => item.target_id === selectedOption.id)

      if (existingResearch) {
        console.log("[v0] 📚 Research already exists, adding turns to existing queue ID:", existingResearch.id)

        if (!isAutomatic && initialTurnsToInvest > 0) {
          if (gameState.turns < initialTurnsToInvest) {
            toast({
              title: language === "es" ? "Turnos insuficientes" : "Insufficient turns",
              variant: "destructive",
            })
            setLoading(false)
            return
          }

          const { data: investResult, error: investError } = await supabase.rpc("invest_manual_turns", {
            p_queue_id: existingResearch.id,
            p_turns: initialTurnsToInvest,
          })

          if (investError) {
            console.error("[v0] ❌ Invest turns error:", investError)
            toast({
              title: language === "es" ? "Error" : "Error",
              description: investError.message,
              variant: "destructive",
            })
            setLoading(false)
            return
          }

          const isCompleted = investResult?.completed || false

          toast({
            title: isCompleted
              ? language === "es"
                ? "¡Investigación completada!"
                : "Research completed!"
              : language === "es"
                ? "Turnos añadidos al proyecto existente"
                : "Turns added to existing project",
            description: isCompleted
              ? language === "es"
                ? `${selectedOption.name} ha sido desbloqueado`
                : `${selectedOption.name} has been unlocked`
              : language === "es"
                ? `Se han invertido ${initialTurnsToInvest} turnos adicionales`
                : `${initialTurnsToInvest} additional turns invested`,
          })

          setConfirmModalOpen(false)
          setIsAutomatic(true)
          setInitialTurnsToInvest(0)

          await loadResearchQueue()
          if (isCompleted) {
            await loadResearchOptionsForTab(activeTab)
          }

          await reloadGameState()
        } else {
          toast({
            title: language === "es" ? "Investigación ya existe" : "Research already exists",
            description:
              language === "es" ? "Esta investigación ya está en tu cola" : "This research is already in your queue",
          })
          setConfirmModalOpen(false)
        }

        setLoading(false)
        return
      }

      if (gameState.gold < goldCost || gameState.mana < manaCost) {
        toast({
          title: language === "es" ? "Recursos insuficientes" : "Insufficient resources",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (!isAutomatic && initialTurnsToInvest > 0) {
        if (gameState.turns < initialTurnsToInvest) {
          toast({
            title: language === "es" ? "Turnos insuficientes" : "Insufficient turns",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
      }

      const { data: insertedResearch, error: insertError } = await supabase
        .from("province_research_queue")
        .insert({
          province_id: gameState.province_id,
          target_id: selectedOption.id,
          target_type: activeTab,
          target_name: selectedOption.name,
          turns_remaining: turnsCost,
          total_turns: turnsCost,
          started_at: new Date().toISOString(),
          is_active: isAutomatic,
        })
        .select()
        .single()

      if (insertError) {
        console.error("[v0] ❌ Insert error:", insertError)
        toast({
          title: language === "es" ? "Error" : "Error",
          description: insertError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      console.log("[v0] ✅ Research inserted with ID:", insertedResearch.id, "Name:", insertedResearch.target_name)

      const { error: updateError } = await supabase
        .from("provinces")
        .update({
          gold: gameState.gold - goldCost,
          mana: gameState.mana - manaCost,
        })
        .eq("id", gameState.province_id)

      if (updateError) {
        console.error("[v0] ❌ Province update error:", updateError)
        toast({
          title: language === "es" ? "Error" : "Error",
          description: updateError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      let researchCompleted = false
      if (!isAutomatic && initialTurnsToInvest > 0 && insertedResearch) {
        console.log("[v0] 💨 Investing initial turns:", initialTurnsToInvest, "on queue ID:", insertedResearch.id)
        const { data: investResult, error: investError } = await supabase.rpc("invest_manual_turns", {
          p_queue_id: insertedResearch.id,
          p_turns: initialTurnsToInvest,
        })

        if (investError) {
          console.error("[v0] ❌ Invest turns error:", investError)
          toast({
            title: language === "es" ? "Advertencia" : "Warning",
            description:
              language === "es"
                ? "Investigación iniciada pero no se pudieron invertir turnos iniciales"
                : "Research started but initial turns could not be invested",
            variant: "destructive",
          })
        } else if (investResult?.completed) {
          researchCompleted = true
          console.log("[v0] 🎉 Research completed immediately!")
        }
      }

      toast({
        title: researchCompleted
          ? language === "es"
            ? "¡Investigación completada!"
            : "Research completed!"
          : language === "es"
            ? "Investigación iniciada"
            : "Research started",
        description: researchCompleted
          ? language === "es"
            ? `${selectedOption.name} ha sido desbloqueado`
            : `${selectedOption.name} has been unlocked`
          : isAutomatic
            ? language === "es"
              ? `${selectedOption.name} - Próximo avance en 1 minuto`
              : `${selectedOption.name} - Next progress in 1 minute`
            : language === "es"
              ? `${selectedOption.name} estará lista en ${turnsCost} turnos${initialTurnsToInvest > 0 ? ` (${initialTurnsToInvest} turnos invertidos)` : ""}`
              : `${selectedOption.name} will be ready in ${turnsCost} turns${initialTurnsToInvest > 0 ? ` (${initialTurnsToInvest} turns invested)` : ""}`,
      })

      setConfirmModalOpen(false)
      setIsAutomatic(true)
      setInitialTurnsToInvest(0)

      await loadResearchQueue()
      if (researchCompleted) {
        await loadResearchOptionsForTab(activeTab)
      }

      await reloadGameState()
    } catch (error: any) {
      console.error("[v0] ❌ handleResearch error:", error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAccelerateResearch = async () => {
    if (!selectedResearch || !gameState) return

    setLoading(true)
    try {
      if (gameState.turns < turnsToInvest) {
        toast({
          title: language === "es" ? "Turnos insuficientes" : "Insufficient turns",
          variant: "destructive",
        })
        return
      }

      const { data: result, error } = await supabase.rpc("invest_manual_turns", {
        p_queue_id: selectedResearch.id,
        p_turns: turnsToInvest,
      })

      if (error) {
        toast({
          title: language === "es" ? "Error" : "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      const isCompleted = result?.completed || false
      console.log("[v0] 🚀 Research accelerated, completed:", isCompleted)

      toast({
        title: isCompleted
          ? language === "es"
            ? "¡Investigación completada!"
            : "Research completed!"
          : language === "es"
            ? "Turnos invertidos"
            : "Turns invested",
        description: isCompleted
          ? language === "es"
            ? `${selectedResearch.target_name} ha sido desbloqueado`
            : `${selectedResearch.target_name} has been unlocked`
          : language === "es"
            ? `Se han invertido ${turnsToInvest} turnos`
            : `${turnsToInvest} turns invested`,
      })

      setAccelerateModalOpen(false)
      setTurnsToInvest(1)

      await loadResearchQueue()
      if (isCompleted) {
        await loadResearchOptionsForTab(activeTab)
      }

      await reloadGameState()
    } catch (error: any) {
      console.error("[v0] ❌ handleAccelerateResearch error:", error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const reloadGameState = async () => {
    // Implement the logic to reload the game state here
    // This function should fetch the updated game state from the server
    // and update the gameState state accordingly
  }

  const handleToggleResearchMode = async (queueId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase.rpc("toggle_research_status", {
        p_queue_id: queueId,
        p_is_active: !currentActive,
      })

      if (error) {
        console.error("[v0] ❌ Toggle research status error:", error)
        toast({
          title: language === "es" ? "Error" : "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: language === "es" ? "Modo actualizado" : "Mode updated",
        description:
          language === "es"
            ? !currentActive
              ? "Investigación en modo automático"
              : "Investigación pausada (modo manual)"
            : !currentActive
              ? "Research in automatic mode"
              : "Research paused (manual mode)",
      })

      await loadResearchQueue()
    } catch (error: any) {
      console.error("[v0] ❌ handleToggleResearchMode error:", error)
    }
  }

  if (!mounted) return null

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <Image src="/images/research-laboratory-magic.jpg" alt="Research" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-[#d4af37]" />
              <h1 className="text-3xl font-bold text-[#d4af37]">
                {language === "es" ? "Centro de Investigación" : "Research Center"}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="relative overflow-hidden cursor-pointer hover:border-[#d4af37] transition-all group"
            onClick={() => {
              setSelectedCategory("UNIT")
              setActiveTab("UNIT")
            }}
          >
            <div className="relative h-96">
              <Image
                src="/images/fantasy-research-laboratory-ancient-library-magic-units.jpg"
                alt="Investigación de Unidades"
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.src = "/research-laboratory-units.jpg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute top-4 left-4">
                <Users className="h-12 w-12 text-[#d4af37]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Investigación de Unidades" : "Unit Research"}
                </h3>
                <p className="text-sm text-gray-300">
                  {language === "es"
                    ? "Descubre nuevas tropas y mejora tus ejércitos con unidades más poderosas"
                    : "Discover new troops and improve your armies with more powerful units"}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="relative overflow-hidden cursor-pointer hover:border-[#d4af37] transition-all group"
            onClick={() => {
              setSelectedCategory("SPELL")
              setActiveTab("SPELL")
            }}
          >
            <div className="relative h-96">
              <Image
                src="/images/spells/conclave-celestial/bendicion-luz.jpg"
                alt="Investigación de Hechizos"
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute top-4 left-4">
                <Sparkles className="h-12 w-12 text-[#d4af37]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Investigación de Hechizos" : "Spell Research"}
                </h3>
                <p className="text-sm text-gray-300">
                  {language === "es"
                    ? "Aprende nuevos hechizos y domina las artes arcanas para ganar ventaja en batalla"
                    : "Learn new spells and master the arcane arts to gain advantage in battle"}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="relative overflow-hidden cursor-pointer hover:border-[#d4af37] transition-all group"
            onClick={() => {
              setSelectedCategory("RITUAL")
              setActiveTab("RITUAL")
            }}
          >
            <div className="relative h-96">
              <Image
                src="/images/rituals/general/ritual-circle-magic.jpg"
                alt="Investigación de Rituales"
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute top-4 left-4">
                <Scroll className="h-12 w-12 text-[#d4af37]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-[#d4af37] mb-2">
                  {language === "es" ? "Investigación de Rituales" : "Ritual Research"}
                </h3>
                <p className="text-sm text-gray-300">
                  {language === "es"
                    ? "Desbloquea poderosos rituales que transformarán tu provincia para siempre"
                    : "Unlock powerful rituals that will transform your province forever"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Image src="/images/research-laboratory-magic.jpg" alt="Research" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-[#d4af37]" />
            <h1 className="text-3xl font-bold text-[#d4af37]">
              {language === "es" ? "Centro de Investigación" : "Research Center"}
            </h1>
          </div>
        </div>
        <Button
          onClick={() => setSelectedCategory(null)}
          className="absolute top-6 right-6 bg-[#d4af37] hover:bg-[#f4cf5f] text-black"
        >
          {language === "es" ? "← Volver" : "← Back"}
        </Button>
      </div>

      {researchQueue.length > 0 && (
        <Card className="bg-[#1a1a1a] border-[#d4af37]/30 p-6">
          <h3 className="text-xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {language === "es" ? "Investigaciones en Curso" : "Research in Progress"}
          </h3>
          <div className="space-y-4">
            {researchQueue.map((item) => {
              const progressPercent = ((item.total_turns - item.turns_remaining) / item.total_turns) * 100

              if (item.turns_remaining <= 0) {
                console.log("[v0] ⚠️ Research shows 0 turns remaining, forcing reload...")
                setTimeout(() => {
                  loadResearchQueue()
                  loadResearchOptionsForTab(activeTab)
                }, 1000)
              }

              return (
                <div key={item.id} className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#d4af37] font-semibold text-lg">
                          {language === "es" ? "Investigando" : "Researching"}: {item.target_name}
                        </span>
                        <span className="text-sm">
                          {item.is_active
                            ? "🟢 " + (language === "es" ? "Auto" : "Auto")
                            : "⏸️ " + (language === "es" ? "Pausado" : "Paused")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {language === "es" ? "Faltan" : "Remaining"}: {item.turns_remaining}{" "}
                        {language === "es" ? "turnos" : "turns"} ({progressPercent.toFixed(0)}%)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <Label htmlFor={`toggle-${item.id}`} className="text-xs text-gray-400">
                          {language === "es" ? "Auto" : "Auto"}
                        </Label>
                        <Switch
                          id={`toggle-${item.id}`}
                          checked={item.is_active}
                          onCheckedChange={() => handleToggleResearchMode(item.id, item.is_active)}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedResearch(item)
                          setTurnsToInvest(Math.min(item.turns_remaining, gameState?.turns || 1))
                          setAccelerateModalOpen(true)
                        }}
                        size="sm"
                        className="bg-[#d4af37] hover:bg-[#f4cf5f] text-black"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        {language === "es" ? "Acelerar" : "Accelerate"}
                      </Button>
                    </div>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResearchTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="UNIT">{language === "es" ? "Unidades" : "Units"}</TabsTrigger>
          <TabsTrigger value="SPELL">{language === "es" ? "Hechizos" : "Spells"}</TabsTrigger>
          <TabsTrigger value="RITUAL">{language === "es" ? "Rituales" : "Rituals"}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loadingOptions ? (
            <div className="text-center py-12 text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
              {language === "es" ? "Cargando opciones..." : "Loading options..."}
            </div>
          ) : researchOptions.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-[#d4af37]/30 p-12 text-center">
              <Image
                src="/completed-research.jpg"
                alt="Research completed"
                width={200}
                height={200}
                className="mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-400 text-lg">
                {language === "es"
                  ? "Investigación completada en esta categoría"
                  : "Research completed in this category"}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((index) => {
                const option = researchOptions[index]

                if (!option) {
                  return (
                    <Card key={index} className="relative overflow-hidden border-dashed border-[#d4af37]/30">
                      <div className="relative h-96 flex items-center justify-center bg-[#0f0f0f]">
                        <div className="text-center p-6">
                          <div className="text-6xl mb-4 opacity-30">🔒</div>
                          <h3 className="text-xl font-bold text-gray-500 mb-2">
                            {language === "es" ? "Ranura Vacía" : "Empty Slot"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {language === "es"
                              ? "No hay más opciones disponibles en este momento"
                              : "No more options available at this time"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                }

                return (
                  <Card
                    key={option.id}
                    className="relative overflow-hidden cursor-pointer hover:border-[#d4af37] transition-all group"
                    onClick={() => {
                      setSelectedOption(option)
                      setConfirmModalOpen(true)
                    }}
                  >
                    <div className="relative h-96">
                      <Image
                        src={option.image_url || "/placeholder.svg?height=400&width=400"}
                        alt={option.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          console.log("[v0] ❌ Image load error for:", option.image_url)
                          e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#d4af37] text-black">Tier {option.tier}</Badge>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-[#d4af37] mb-2">{option.name}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2 mb-4">{option.description}</p>

                        <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-[#d4af37]/30">
                          <h4 className="text-xs font-bold text-[#d4af37] mb-2 uppercase">
                            {language === "es" ? "Coste de Investigación:" : "Research Cost:"}
                          </h4>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm font-bold">
                                {(option.research_gold_cost || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-400 text-sm font-bold">
                                {(option.research_mana_cost || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-orange-400" />
                              <span className="text-orange-400 text-sm font-bold">
                                {option.research_turns || 0} {language === "es" ? "turnos" : "turns"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#d4af37]/30">
          <DialogHeader>
            <DialogTitle className="text-[#d4af37] text-2xl">
              {language === "es" ? "Confirmar Investigación" : "Confirm Research"}
            </DialogTitle>
            <DialogDescription>
              {language === "es"
                ? "Esta investigación consumirá recursos y tiempo. ¿Deseas continuar?"
                : "This research will consume resources and time. Do you want to continue?"}
            </DialogDescription>
          </DialogHeader>

          {selectedOption && (
            <div className="space-y-4">
              <div className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-[#d4af37] mb-3">{selectedOption.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === "es" ? "Coste de Oro:" : "Gold Cost:"}</span>
                    <span className="text-[#d4af37] font-semibold">{selectedOption.research_gold_cost || 0} 💰</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === "es" ? "Coste de Maná:" : "Mana Cost:"}</span>
                    <span className="text-blue-400 font-semibold">{selectedOption.research_mana_cost || 0} 🔮</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === "es" ? "Tiempo:" : "Time:"}</span>
                    <span className="text-purple-400 font-semibold">
                      {selectedOption.research_turns || 0} {language === "es" ? "turnos" : "turns"} ⏱️
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="automatic"
                    checked={isAutomatic}
                    onChange={(e) => {
                      setIsAutomatic(e.target.checked)
                      if (e.target.checked) setInitialTurnsToInvest(0)
                    }}
                    className="w-4 h-4"
                  />
                  <label htmlFor="automatic" className="text-sm text-[#d4af37] cursor-pointer">
                    {language === "es" ? "Automático (1 turno/minuto)" : "Automatic (1 turn/minute)"}
                  </label>
                </div>

                {!isAutomatic && (
                  <div className="space-y-2 pt-2 border-t border-[#d4af37]/10">
                    <Label htmlFor="initial-turns" className="text-sm text-gray-400">
                      {language === "es" ? "Invertir Turnos Iniciales:" : "Invest Initial Turns:"}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        id="initial-turns"
                        min={0}
                        max={Math.min(selectedOption.research_turns || 0, gameState?.turns || 0)}
                        step={1}
                        value={[initialTurnsToInvest]}
                        onValueChange={(v) => setInitialTurnsToInvest(v[0])}
                        className="flex-1"
                      />
                      <span className="text-[#d4af37] font-semibold min-w-[3rem] text-right">
                        {initialTurnsToInvest}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {language === "es"
                        ? `Tienes ${gameState?.turns || 0} turnos disponibles`
                        : `You have ${gameState?.turns || 0} turns available`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setConfirmModalOpen(false)} variant="outline">
              {language === "es" ? "Cancelar" : "Cancel"}
            </Button>
            <Button onClick={handleResearch} disabled={loading} className="bg-[#d4af37] hover:bg-[#f4cf5f] text-black">
              {loading
                ? language === "es"
                  ? "Procesando..."
                  : "Processing..."
                : language === "es"
                  ? "Confirmar"
                  : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={accelerateModalOpen} onOpenChange={setAccelerateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#d4af37]">
              {language === "es" ? "Acelerar Investigación" : "Accelerate Research"}
            </DialogTitle>
            <DialogDescription>
              {language === "es" ? "¿Cuántos turnos quieres invertir?" : "How many turns do you want to invest?"}
            </DialogDescription>
          </DialogHeader>

          {selectedResearch && (
            <div className="space-y-4">
              <div className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{language === "es" ? "Turnos disponibles" : "Available turns"}</span>
                  <span className="text-[#d4af37] font-bold">{gameState?.turns || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{language === "es" ? "Turnos restantes" : "Remaining turns"}</span>
                  <span className="text-[#d4af37] font-bold">{selectedResearch.turns_remaining}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  {language === "es" ? "Turnos a invertir" : "Turns to invest"}
                </label>
                <Slider
                  value={[turnsToInvest]}
                  onValueChange={(values) => setTurnsToInvest(values[0])}
                  max={Math.min(selectedResearch.turns_remaining, gameState?.turns || 0)}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1</span>
                  <span className="text-[#d4af37] font-bold">{turnsToInvest}</span>
                  <span>{Math.min(selectedResearch.turns_remaining, gameState?.turns || 0)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAccelerateModalOpen(false)}>
              {language === "es" ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              onClick={handleAccelerateResearch}
              disabled={loading}
              className="bg-[#d4af37] hover:bg-[#f4cf5f] text-black"
            >
              <Zap className="h-4 w-4 mr-2" />
              {loading
                ? language === "es"
                  ? "Procesando..."
                  : "Processing..."
                : language === "es"
                  ? "Invertir Turnos"
                  : "Invest Turns"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
