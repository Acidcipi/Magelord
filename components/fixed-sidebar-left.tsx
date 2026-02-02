"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Coins, Sparkles, Clock, Mountain, Users, Shield, Swords, Trophy } from "lucide-react"
import { FACTIONS, type Faction } from "@/lib/factions"
import type { GameState } from "@/lib/game-state"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { CataclysmCountdown } from "@/components/cataclysm-countdown"

interface FixedSidebarLeftProps {
  language: Language
  gameState: GameState | null
  user: any
}

export function FixedSidebarLeft({ language, gameState, user }: FixedSidebarLeftProps) {
  const t = useTranslation(language)
  const [isMounted, setIsMounted] = useState(false)
  const faction = gameState?.faction as Faction
  const factionData = faction ? FACTIONS[faction] : null

  const [topPlayers, setTopPlayers] = useState<any[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchTopPlayers = async () => {
      const { data, error } = await supabase
        .from("provinces")
        .select("id, name, networth")
        .order("networth", { ascending: false })
        .limit(5)

      if (data && !error) {
        setTopPlayers(data)
      }
    }

    // Cargar inmediatamente
    fetchTopPlayers()
    
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchTopPlayers, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <aside className="w-[300px] border-r border-[#d4af37]/20 bg-[#0f0f0f]">
      <div className="p-4 border-b border-[#d4af37]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
        <h3 className="text-white font-bold text-lg mb-1">{gameState?.name || "Mi Provincia"}</h3>
        <p className="text-amber-400 text-sm font-semibold mb-1">{String(gameState?.faction || "Unknown")}</p>
        <p className="text-slate-400 text-xs">
          {String(gameState?.class_type || "Unknown")} â€¢ {String(gameState?.alignment || "Neutral")}
        </p>
      </div>

      {factionData && (
        <div className="p-4 border-b border-[#d4af37]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
          <h3 className="text-[#d4af37] font-bold text-sm mb-2">{t.yourFaction}</h3>
          <div
            className="p-3 rounded-lg border-2 text-center"
            style={{
              borderColor: factionData.color,
              background: `linear-gradient(135deg, ${factionData.color}15, ${factionData.color}05)`,
            }}
          >
            <div className="text-4xl mb-1">{factionData.icon}</div>
            <div className="font-bold text-base" style={{ color: factionData.color }}>
              {factionData.name}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-[#d4af37]/20">
        <CataclysmCountdown />
      </div>

      {/* Resources Section */}
      <div className="p-4 border-b border-[#d4af37]/20">
        <h3 className="text-[#d4af37] font-bold text-lg mb-4">{t.resources}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-[#d4af37]/10">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-300 text-sm">{t.gold}</span>
            </div>
            <span className="text-[#d4af37] font-bold">{Number(gameState?.gold || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-[#d4af37]/10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-gray-300 text-sm">{t.mana}</span>
            </div>
            <span className="text-purple-400 font-bold">{Number(gameState?.mana || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-[#d4af37]/10">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-gray-300 text-sm">{t.turns}</span>
            </div>
            <span className="text-blue-400 font-bold">{Number(gameState?.turns || 0)}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-[#d4af37]/10">
            <div className="flex items-center gap-2">
              <Mountain className="h-4 w-4 text-green-500" />
              <span className="text-gray-300 text-sm">{t.land}</span>
            </div>
            <span className="text-green-400 font-bold">{Number(gameState?.acres || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-[#d4af37]/10">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-gray-300 text-sm">{t.population}</span>
            </div>
            <span className="text-orange-400 font-bold">{Number(gameState?.population || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-[#d4af37]/10">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-500" />
              <span className="text-gray-300 text-sm">{t.defense}</span>
            </div>
            <span className="text-cyan-400 font-bold">{Number(gameState?.defense || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-[#d4af37]/10">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-red-500" />
              <span className="text-gray-300 text-sm">{t.attack}</span>
            </div>
            <span className="text-red-400 font-bold">{Number(gameState?.attack || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Advertising Section */}
      <div className="p-4 border-b border-[#d4af37]/20">
        <h3 className="text-[#d4af37] font-bold text-sm mb-3">{t.advertisementNew}</h3>
        <div className="bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-xs mb-2">{t.premiumUpgrade}</p>
          <p className="text-[#d4af37] text-sm font-semibold mb-3">{t.upgradeMessage}</p>
          <button className="w-full bg-[#d4af37] text-black py-2 px-4 rounded-md hover:bg-[#f4cf5f] transition-colors font-bold text-sm">
            {t.upgradeNow}
          </button>
        </div>
      </div>

      {/* Top 5 Ranking */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-[#d4af37]" />
          <h3 className="text-[#d4af37] font-bold text-sm">{language === "es" ? "Top 5 Poder" : "Top 5 Power"}</h3>
        </div>
        <div className="space-y-2">
          {topPlayers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">{language === "es" ? "Cargando..." : "Loading..."}</p>
          ) : (
            topPlayers.map((player, index) => (
              <div
                key={player.id}
                className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border border-[#d4af37]/20 rounded-lg p-3 hover:border-[#d4af37]/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#d4af37] font-bold text-lg">#{index + 1}</span>
                  <span className="text-gray-300 text-sm font-semibold truncate flex-1">{player.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{language === "es" ? "Poder" : "Power"}</span>
                  <span className="text-[#d4af37] font-bold">{Number(player.networth ?? 0).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}