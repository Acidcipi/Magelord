"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Shield, Castle, Wand2, Gem } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"

interface DefensaPageProps {
  language: Language
  gameState: any
  user: any
  onUpdate?: () => Promise<void>
}

export function DefensaPage({ language, gameState, user, onUpdate }: DefensaPageProps) {
  const t = useTranslation(language)
  const { toast } = useToast()

  const [unitDefensePercentages, setUnitDefensePercentages] = useState<Record<string, number>>({})
  const [activeSpell, setActiveSpell] = useState<string>("")
  const [activeArtifact, setActiveArtifact] = useState<string>("")
  const [learnedSpells, setLearnedSpells] = useState<any[]>([])
  const isDragging = useRef<boolean>(false)

  useEffect(() => {
    if (gameState?.units?.length > 0 && !isDragging.current) {
      const shouldUpdate = gameState.units.some((u: any) => {
        const dbValue = Number(u.defense_assignment_pct) ?? 50
        const currentValue = unitDefensePercentages[u.unit_id]
        return currentValue === undefined || currentValue !== dbValue
      })

      if (shouldUpdate) {
        const initial: Record<string, number> = {}
        gameState.units.forEach((u: any) => {
          initial[u.unit_id] = Number(u.defense_assignment_pct) ?? 50
        })
        setUnitDefensePercentages(initial)
        console.log("[v0] 🛡️ Initialized defense percentages from DB:", initial)
      }
    }
  }, [gameState.units])

  useEffect(() => {
    const fetchLearnedSpells = async () => {
      if (!gameState?.province_id) return

      try {
        const { data, error } = await supabase
          .from("master_spells")
          .select("*, province_learned_spells!inner(province_id)")
          .eq("province_learned_spells.province_id", gameState.province_id)

        if (!error && data) {
          setLearnedSpells(data)
          console.log("[v0] ✅ Loaded learned defense spells:", data.length)
        }
      } catch (error) {
        console.error("[v0] ❌ Error fetching learned spells:", error)
      }
    }

    fetchLearnedSpells()
  }, [gameState?.province_id])

  useEffect(() => {
    const loadDefensiveSettings = async () => {
      if (!gameState?.province_id) return

      try {
        const { data, error } = await supabase
          .from("provinces")
          .select("defensive_spell_id, defensive_artifact_id")
          .eq("id", gameState.province_id)
          .single()

        if (!error && data) {
          if (data.defensive_spell_id) {
            setActiveSpell(data.defensive_spell_id)
            console.log("[v0] 🛡️ Loaded defensive spell:", data.defensive_spell_id)
          }
          if (data.defensive_artifact_id) {
            setActiveArtifact(data.defensive_artifact_id)
            console.log("[v0] 🛡️ Loaded defensive artifact:", data.defensive_artifact_id)
          }
        }
      } catch (error) {
        console.error("[v0] ❌ Error loading defensive settings:", error)
      }
    }

    loadDefensiveSettings()
  }, [gameState?.province_id])

  const calculateTotalDefensivePower = () => {
    let totalPower = 0

    if (!gameState?.units) return 0

    gameState.units.forEach((unit: any) => {
      const quantity = Number(unit.quantity || 0)
      const defense = Number(unit.master_units?.defense || unit.defense || 0)
      const percentage = unitDefensePercentages[unit.unit_id] || 0
      const assignedUnits = Math.floor(quantity * (percentage / 100))

      totalPower += defense * assignedUnits
    })

    return totalPower
  }

  const walls = Number(gameState?.buildings?.walls || 0)
  const fortresses = Number(gameState?.buildings?.fortresses || 0)
  const totalDefensivePower = calculateTotalDefensivePower()

  const handleSaveConfiguration = async () => {
    try {
      const payload = gameState.units.map((unit: any) => ({
        unit_id: unit.unit_id,
        percent: unitDefensePercentages[unit.unit_id] || 0,
      }))

      const { error } = await supabase.rpc("update_province_defense", {
        p_province_id: gameState.province_id,
        p_assignments: payload,
        p_spell_id: activeSpell || null,
        p_artifact_id: activeArtifact || null,
      })

      if (error) {
        console.error("[v0] ❌ Error saving defense configuration:", error.message)
        toast({
          title: language === "es" ? "Error" : "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      console.log("[v0] ✅ Defense configuration saved with spell:", activeSpell)

      toast({
        title: language === "es" ? "Configuración Guardada" : "Configuration Saved",
        description:
          language === "es"
            ? "Tu configuración defensiva ha sido actualizada"
            : "Your defensive configuration has been updated",
      })

      if (onUpdate) {
        await onUpdate()
      }
    } catch (error: any) {
      console.error("[v0] ❌ Error saving configuration:", error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleSaveUnit = async (unitId: string) => {
    try {
      const percentage = unitDefensePercentages[unitId] || 0

      const { error } = await supabase
        .from("province_units")
        .update({ defense_assignment_pct: percentage })
        .eq("province_id", gameState.province_id)
        .eq("unit_id", unitId)

      if (error) {
        console.error("[v0] ❌ Error saving unit defense configuration:", error.message)
        toast({
          title: language === "es" ? "Error" : "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: language === "es" ? "Configuración Guardada" : "Configuration Saved",
        description:
          language === "es"
            ? "La configuración de esta unidad ha sido actualizada"
            : "This unit's configuration has been updated",
      })

      if (onUpdate) {
        await onUpdate()
      }
    } catch (error: any) {
      console.error("[v0] ❌ Error saving unit configuration:", error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const AVAILABLE_SPELLS = [
    {
      id: "firewall",
      name: language === "es" ? "Muro de Fuego" : "Fire Wall",
      desc: language === "es" ? "Daño directo a invasores" : "Direct damage to invaders",
    },
    {
      id: "confusion",
      name: language === "es" ? "Niebla de Confusión" : "Confusion Fog",
      desc: language === "es" ? "Aumenta fallos enemigos" : "Increases enemy failures",
    },
    {
      id: "manashield",
      name: language === "es" ? "Escudo de Maná" : "Mana Shield",
      desc: language === "es" ? "Reduce daño mágico" : "Reduces magic damage",
    },
  ]

  const AVAILABLE_ARTIFACTS = [
    {
      id: "banner",
      name: language === "es" ? "Estandarte de Resistencia" : "Banner of Resistance",
      effect: "+10% Moral",
    },
    { id: "horn", name: language === "es" ? "Cuerno de Guerra" : "War Horn", effect: "+5% Defense" },
  ]

  const units = gameState?.units || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">
        {language === "es" ? "Configuración Defensiva" : "Defensive Configuration"}
      </h1>
      <p className="text-gray-400">
        {language === "es"
          ? "Prepara tu provincia contra invasiones enemigas"
          : "Prepare your province against enemy invasions"}
      </p>

      <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-6">
        <div className="relative h-48 -m-6 mb-4 overflow-hidden rounded-t-lg">
          <img
            src="/medieval-fantasy-fortress-with-soldiers-defending-.jpg"
            alt="Defensive forces"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-[#d4af37]" />
          <h3 className="text-xl font-semibold text-[#d4af37]">
            {language === "es" ? "Asignación de Tropas por Unidad" : "Troop Assignment by Unit"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {units.length === 0 ? (
            <p className="text-gray-400 col-span-full">
              {language === "es" ? "No tienes unidades entrenadas" : "You have no trained units"}
            </p>
          ) : (
            units.map((unit: any) => {
              const quantity = Number(unit.quantity || 0)
              const defense = Number(unit.master_units?.defense || unit.defense || 0)
              const unitName = unit.master_units?.name || unit.name || "Unknown"
              const percentage = unitDefensePercentages[unit.unit_id] || 0
              const assignedUnits = Math.floor(quantity * (percentage / 100))
              const defensePower = defense * assignedUnits

              return (
                <div key={unit.unit_id} className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-[#d4af37] font-semibold">{unitName}</h4>
                      <p className="text-sm text-gray-400">
                        {language === "es" ? "Disponibles" : "Available"}: {quantity.toLocaleString()} |
                        {language === "es" ? " Defensa" : " Defense"}: {defense}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#d4af37] font-bold text-lg">{percentage}%</p>
                      <p className="text-sm text-gray-400">
                        {assignedUnits.toLocaleString()} {language === "es" ? "asignadas" : "assigned"}
                      </p>
                    </div>
                  </div>

                  <Slider
                    value={[percentage]}
                    onValueChange={(values) => {
                      isDragging.current = true
                      setUnitDefensePercentages({
                        ...unitDefensePercentages,
                        [unit.unit_id]: values[0],
                      })
                    }}
                    onValueCommit={() => {
                      setTimeout(() => {
                        isDragging.current = false
                      }, 100)
                    }}
                    max={100}
                    step={5}
                    className="w-full"
                  />

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {language === "es" ? "Poder Defensivo" : "Defensive Power"}: {defensePower.toLocaleString()}
                    </span>
                    <span>
                      ⚠️{" "}
                      {language === "es"
                        ? `${quantity - assignedUnits} disponibles para ataque`
                        : `${quantity - assignedUnits} available for attack`}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {units.length > 0 && (
          <Button
            onClick={handleSaveConfiguration}
            className="w-full mt-4 bg-[#d4af37] hover:bg-[#f4cf5f] text-black font-bold py-3"
          >
            <Shield className="h-5 w-5 mr-2" />
            {language === "es" ? "Guardar Configuración de Todas las Unidades" : "Save All Units Configuration"}
          </Button>
        )}
      </Card>

      <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-6">
        <div className="relative h-48 -m-6 mb-4 overflow-hidden rounded-t-lg">
          <img
            src="/medieval-fantasy-stone-walls-and-fortifications-to.jpg"
            alt="Defensive structures"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Castle className="h-6 w-6 text-[#d4af37]" />
          <h3 className="text-xl font-semibold text-[#d4af37]">
            {language === "es" ? "Infraestructura Defensiva" : "Defensive Infrastructure"}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0f0f0f] p-4 rounded border border-[#d4af37]/10">
            <h4 className="text-[#d4af37] font-semibold mb-2">{language === "es" ? "Murallas" : "Walls"}</h4>
            <p className="text-2xl font-bold text-[#d4af37]">{walls.toLocaleString()}</p>
            <p className="text-sm text-gray-500">
              -{Math.floor(walls * 0.015)}% {language === "es" ? "Pérdida de Tierra" : "Land Loss"}
            </p>
          </div>

          <div className="bg-[#0f0f0f] p-4 rounded border border-[#d4af37]/10">
            <h4 className="text-[#d4af37] font-semibold mb-2">{language === "es" ? "Fuertes" : "Forts"}</h4>
            <p className="text-2xl font-bold text-[#d4af37]">{fortresses.toLocaleString()}</p>
            <p className="text-sm text-gray-500">
              -{Math.floor(fortresses * 0.0125)}% {language === "es" ? "Bajas Militares" : "Military Casualties"}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
          <p className="text-blue-400 text-sm">
            <strong>{language === "es" ? "Bono de Facción:" : "Faction Bonus:"}</strong>{" "}
            {user?.faction === "Ingenios de Hierro"
              ? "+20% " + (language === "es" ? "Efectividad de Murallas" : "Wall Effectiveness")
              : language === "es"
                ? "No aplicable"
                : "Not applicable"}
          </p>
        </div>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-6">
        <div className="relative h-48 -m-6 mb-4 overflow-hidden rounded-t-lg">
          <img
            src="/fantasy-wizard-casting-protective-magic-shield-spe.jpg"
            alt="Magical defenses"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-purple-400">
            {language === "es" ? "Salvaguarda Mágica" : "Magical Ward"}
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-[#d4af37] mb-2">{language === "es" ? "Hechizo Activo:" : "Active Spell:"}</h4>
            <select
              value={activeSpell}
              onChange={(e) => setActiveSpell(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#d4af37]/30 text-[#d4af37] rounded p-3"
            >
              <option value="" className="bg-[#0f0f0f] text-[#d4af37]">
                {language === "es" ? "Ninguno" : "None"}
              </option>
              {learnedSpells.map((spell) => (
                <option key={spell.id} value={spell.id} className="bg-[#0f0f0f] text-[#d4af37]">
                  {spell.name} ({spell.base_mana_cost} {language === "es" ? "Maná" : "Mana"})
                </option>
              ))}
            </select>
          </div>

          {activeSpell && (
            <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
              <p className="text-purple-400 text-sm">
                ✨{" "}
                {language === "es"
                  ? "Hechizo activo y protegiendo tu provincia"
                  : "Spell active and protecting your province"}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-6">
        <div className="relative h-48 -m-6 mb-4 overflow-hidden rounded-t-lg">
          <img
            src="/fantasy-magical-artifacts-relics-glowing-gems-anci.jpg"
            alt="Magical artifacts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Gem className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-yellow-400">
            {language === "es" ? "Reliquias y Objetos" : "Relics and Artifacts"}
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-[#d4af37] mb-2">{language === "es" ? "Artefacto Equipado:" : "Equipped Artifact:"}</h4>
            <select
              value={activeArtifact}
              onChange={(e) => setActiveArtifact(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#d4af37]/30 text-[#d4af37] rounded p-3"
            >
              <option value="" className="bg-[#0f0f0f] text-[#d4af37]">
                {language === "es" ? "Ninguno" : "None"}
              </option>
              {AVAILABLE_ARTIFACTS.map((artifact) => (
                <option key={artifact.id} value={artifact.id} className="bg-[#0f0f0f] text-[#d4af37]">
                  {artifact.name} ({artifact.effect})
                </option>
              ))}
            </select>
          </div>

          {activeArtifact && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-yellow-400 text-sm">
                💎{" "}
                {language === "es"
                  ? "Artefacto activo otorgando bonificación pasiva"
                  : "Artifact active granting passive bonus"}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-[#d4af37]/10 to-[#1a1a1a] border-[#d4af37]/50 p-6">
        <h3 className="text-xl font-semibold text-[#d4af37] mb-4">
          {language === "es" ? "Poder Defensivo Total" : "Total Defensive Power"}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">{language === "es" ? "Poder de Tropas" : "Troop Power"}</p>
            <p className="text-3xl font-bold text-[#d4af37]">{totalDefensivePower.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">{language === "es" ? "Bonus Edificios" : "Building Bonus"}</p>
            <p className="text-3xl font-bold text-green-400">+{Math.floor((walls + fortresses) * 0.01)}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">{language === "es" ? "Bonus Mágico" : "Magic Bonus"}</p>
            <p className="text-3xl font-bold text-purple-400">{activeSpell ? "+15%" : "0%"}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          {language === "es"
            ? "Fórmula: Σ(Defensa_Unidad × Cantidad × %_Asignado) + Bonus Muralla + Bonus Hechizo"
            : "Formula: Σ(Unit_Defense × Quantity × %_Assigned) + Wall Bonus + Spell Bonus"}
        </p>
      </Card>

      <Button
        onClick={handleSaveConfiguration}
        className="w-full bg-[#d4af37] hover:bg-[#f4cf5f] text-black font-bold py-3"
      >
        <Shield className="h-5 w-5 mr-2" />
        {language === "es" ? "Guardar Configuración Defensiva" : "Save Defensive Configuration"}
      </Button>
    </div>
  )
}
