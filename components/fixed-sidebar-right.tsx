/* ============================================================================
   MAGELORD - FIXED SIDEBAR RIGHT (BARRA LATERAL DERECHA FIJA)
   ============================================================================
   
   Componente de barra lateral derecha de 300px que muestra:
   - Acciones rápidas (Construir, Reclutar, Magia, etc.)
   - Balance de recursos por turno
   - Contador hasta el próximo turno
   - Eventos recientes de la provincia
   
   Ubicación: /components/fixed-sidebar-right.tsx
   
   NOTA: Este componente usa una lógica SIMPLE de contador que funciona
   correctamente. NO refrescar next_turn_at constantemente - eso causa bugs.
   
   ============================================================================ */

"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Hammer, Swords, Wand2, Send, Users, TrendingUp, Coins, Sparkles, Clock } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

/* ============================================================================
   INTERFACES
   ============================================================================ */

interface FixedSidebarRightProps {
  language: Language
  setActivePage: (page: string) => void
  gameState?: any
}

interface ProvinceEvent {
  event_type: string
  event_description: string
  time_ago: string
}

/* ============================================================================
   COMPONENTE PRINCIPAL
   ============================================================================ */

export function FixedSidebarRight({ language, setActivePage, gameState }: FixedSidebarRightProps) {
  const t = useTranslation(language)
  
  /* ==========================================================================
     ESTADOS
     ========================================================================== */
  
  const [mounted, setMounted] = useState(false)
  const [timeUntilNextTurn, setTimeUntilNextTurn] = useState(60)
  const [recentEvents, setRecentEvents] = useState<ProvinceEvent[]>([])

  /* ==========================================================================
     EFECTO: Mounted
     ========================================================================== */
  
  useEffect(() => {
    setMounted(true)
  }, [])

  /* ==========================================================================
     EFECTO: Cargar eventos recientes cada 30 segundos
     ========================================================================== */
  
  useEffect(() => {
    const loadRecentEvents = async () => {
      if (!gameState?.province_id) return

      const { data, error } = await supabase.rpc('get_recent_events', {
        p_province_id: gameState.province_id
      })

      if (data && !error) {
        setRecentEvents(data)
      }
    }

    loadRecentEvents()
    const interval = setInterval(loadRecentEvents, 30000)
    
    return () => clearInterval(interval)
  }, [gameState?.province_id])

  /* ==========================================================================
     EFECTO: Contador de turnos (VERSIÓN SIMPLE QUE FUNCIONA)
     ========================================================================== */
  
  useEffect(() => {
    if (!gameState?.next_turn_at) return

    const calculateSecondsRemaining = () => {
      const nextTurnDate = new Date(gameState.next_turn_at)
      const now = new Date()
      const diff = nextTurnDate.getTime() - now.getTime()
      const seconds = Math.max(0, Math.floor(diff / 1000))
      return seconds
    }

    // Actualizar inmediatamente
    setTimeUntilNextTurn(calculateSecondsRemaining())

    // Actualizar cada segundo
    const interval = setInterval(() => {
      setTimeUntilNextTurn(calculateSecondsRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState?.next_turn_at])

  /* ==========================================================================
     RENDERIZADO CONDICIONAL
     ========================================================================== */
  
  if (!mounted) {
    return null
  }

  /* ==========================================================================
     CÁLCULOS DE RECURSOS
     ========================================================================== */
  
  const mines = gameState?.mines || gameState?.buildings?.mines || 0
  const towers = gameState?.towers || gameState?.buildings?.towers || 0
  const population = gameState?.population || 0
  const taxRate = gameState?.tax_rate || 0
  
  const goldFromMines = mines * 500
  const goldFromTaxes = Math.floor((population * taxRate) / 100)
  const goldPerTurn = goldFromMines + goldFromTaxes
  const manaPerTurn = towers * 100

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <aside className="w-[300px] h-[calc(100vh-73px)] sticky top-[73px] border-l border-[#d4af37]/20 bg-[#0f0f0f] overflow-y-auto">
      <div className="p-4 space-y-4">
        
        {/* ==================================================================
            ACCIONES RÁPIDAS
            ================================================================== */}
        
        <h3 className="text-[#d4af37] font-bold text-lg mb-4">{t.quickActions}</h3>
        
        <div className="space-y-2">
          <Button
            onClick={() => setActivePage("construir")}
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20"
          >
            <Hammer className="mr-2 h-4 w-4" />
            {t.build}
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

        {/* ==================================================================
            BALANCE DE TURNO
            ================================================================== */}
        
        <Card className="p-4 bg-[#1a1a1a] border border-[#d4af37]/20">
          <h4 className="text-[#d4af37] font-semibold mb-3 text-sm">
            {language === "es" ? "Balance de Turno" : "Turn Balance"}
          </h4>
          
          <div className="space-y-3">
            {/* Oro por turno */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-gray-400">
                  {language === "es" ? "Oro" : "Gold"}
                </span>
              </div>
              <span className="text-sm font-semibold text-green-400">
                +{goldPerTurn.toLocaleString()}
              </span>
            </div>

            {/* Maná por turno */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-gray-400">
                  {language === "es" ? "Maná" : "Mana"}
                </span>
              </div>
              <span className="text-sm font-semibold text-purple-400">
                +{manaPerTurn.toLocaleString()}
              </span>
            </div>

            {/* Contador de próximo turno */}
            <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/10">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#d4af37]" />
                <span className="text-xs text-gray-400">
                  {language === "es" ? "Próximo turno" : "Next turn"}
                </span>
              </div>
              <span className="text-sm font-bold text-[#d4af37]">
                {timeUntilNextTurn}s
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#d4af37]/10">
            <p className="text-xs text-gray-500 text-center">
              {language === "es" 
                ? "Los recursos se generan automáticamente" 
                : "Resources are generated automatically"}
            </p>
          </div>
        </Card>

        {/* ==================================================================
            EVENTOS RECIENTES
            ================================================================== */}
        
        {recentEvents.length > 0 && (
          <Card className="p-4 bg-[#1a1a1a] border border-[#d4af37]/20">
            <h4 className="text-[#d4af37] font-semibold mb-3 text-sm">
              {language === "es" ? "📜 Eventos Recientes" : "📜 Recent Events"}
            </h4>
            
            <div className="space-y-2">
              {recentEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="text-xs text-gray-400 border-b border-gray-800 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {/* Icono según tipo de evento */}
                    {event.event_type === 'training' && (
                      <Swords className="h-3 w-3 text-blue-400" />
                    )}
                    {event.event_type === 'construction' && (
                      <Hammer className="h-3 w-3 text-orange-400" />
                    )}
                    {event.event_type === 'exploration' && (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    )}
                    
                    {/* Descripción del evento */}
                    <span>{event.event_description}</span>
                  </div>
                  
                  {/* Tiempo transcurrido */}
                  <span className="text-gray-600 text-xs ml-5">
                    {event.time_ago}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </aside>
  )
}