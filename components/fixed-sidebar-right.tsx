"use client"

/**
 * Fixed Right Sidebar (300px)
 * Shows real economy data and activity log
 */

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Hammer, Swords, Wand2, Send, Users, TrendingUp, Coins, Sparkles, Clock } from "lucide-react"

interface FixedSidebarRightProps {
  language: Language
  setActivePage: (page: string) => void
  gameState?: any
}

export function FixedSidebarRight({ language, setActivePage, gameState }: FixedSidebarRightProps) {
  const t = useTranslation(language)
  const [mounted, setMounted] = useState(false)
  const [timeUntilNextTurn, setTimeUntilNextTurn] = useState(60)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const turnInterval = setInterval(() => {
      setTimeUntilNextTurn((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)

    return () => clearInterval(turnInterval)
  }, [])

  if (!mounted) {
    return null
  }

  const mines = gameState?.mines || gameState?.buildings?.mines || 0
  const towers = gameState?.towers || gameState?.buildings?.towers || 0
  const goldPerTurn = mines * 500
  const manaPerTurn = towers * 100

  return (
    <aside className="w-[300px] h-[calc(100vh-73px)] sticky top-[73px] border-l border-[#d4af37]/20 bg-[#0f0f0f] overflow-y-auto">
      <div className="p-4 space-y-4">
        <h3 className="text-[#d4af37] font-bold text-lg mb-4">{t.quickActions}</h3>
        <div className="space-y-2">
          <Button
            onClick={() => setActivePage("construir")}
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20"
          >
            <Hammer className="mr-2 h-4 w-4" />
            {t.construct}
          </Button>

          <Button
            onClick={() => setActivePage("reclutar")}
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20"
          >
            <Swords className="mr-2 h-4 w-4" />
            {t.recruit}
          </Button>

          <Button
            onClick={() => setActivePage("magia")}
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {t.magic}
          </Button>

          <Button
            onClick={() => setActivePage("mensajes")}
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20"
          >
            <Send className="mr-2 h-4 w-4" />
            {t.messages}
          </Button>

          <Button
            onClick={() => setActivePage("gremios")}
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20"
          >
            <Users className="mr-2 h-4 w-4" />
            {t.guilds}
          </Button>

          <Button
            onClick={() => setActivePage("rankings")}
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            {t.rankings}
          </Button>
        </div>

        <Card className="p-4 bg-[#1a1a1a] border border-[#d4af37]/20">
          <h4 className="text-[#d4af37] font-semibold mb-3 text-sm">
            {language === "es" ? "Balance de Turno" : "Turn Balance"}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-gray-400">{language === "es" ? "Oro" : "Gold"}</span>
              </div>
              <span className="text-sm font-semibold text-green-400">+{goldPerTurn.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-gray-400">{language === "es" ? "Maná" : "Mana"}</span>
              </div>
              <span className="text-sm font-semibold text-purple-400">+{manaPerTurn.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/10">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#d4af37]" />
                <span className="text-xs text-gray-400">{language === "es" ? "Próximo turno" : "Next turn"}</span>
              </div>
              <span className="text-sm font-bold text-[#d4af37]">{timeUntilNextTurn}s</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#d4af37]/10">
            <p className="text-xs text-gray-500 text-center">
              {language === "es"
                ? `${mines} minas × 500 = ${goldPerTurn} oro/turno`
                : `${mines} mines × 500 = ${goldPerTurn} gold/turn`}
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              {language === "es"
                ? `${towers} torres × 100 = ${manaPerTurn} maná/turno`
                : `${towers} towers × 100 = ${manaPerTurn} mana/turn`}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-[#1a1a1a] border border-[#d4af37]/20">
          <h4 className="text-[#d4af37] font-semibold mb-3 text-sm">
            {language === "es" ? "Diario de la Provincia" : "Province Journal"}
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs">
              <span className="text-green-400 mt-0.5">✓</span>
              <span className="text-gray-400 flex-1">
                {language === "es" ? "Entrenamiento completado" : "Training completed"}
              </span>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <span className="text-blue-400 mt-0.5">◆</span>
              <span className="text-gray-400 flex-1">
                {language === "es" ? "Construcción finalizada" : "Construction finished"}
              </span>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <span className="text-purple-400 mt-0.5">★</span>
              <span className="text-gray-400 flex-1">
                {language === "es" ? "Exploración exitosa" : "Successful exploration"}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#d4af37]/10">
            <p className="text-xs text-gray-500 text-center italic">
              {language === "es" ? "Los últimos 3 eventos de tu provincia" : "The last 3 events in your province"}
            </p>
          </div>
        </Card>

        {/* Advertisement */}
        <div className="p-4 bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20 rounded-lg text-center">
          <p className="text-gray-400 text-xs mb-2">{t.advertisement}</p>
          <p className="text-[#d4af37] text-sm font-semibold mb-3">{t.upgradeMessage}</p>
          <button className="w-full bg-[#d4af37] text-black py-2 px-4 rounded-md hover:bg-[#f4cf5f] transition-colors font-bold text-sm">
            {t.upgradeNow}
          </button>
        </div>
      </div>
    </aside>
  )
}
