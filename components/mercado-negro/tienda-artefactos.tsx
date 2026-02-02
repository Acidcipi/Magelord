/* ============================================================================
   MAGELORD - TIENDA DE ARTEFACTOS (Mercado Negro)
   ============================================================================
   
   Sección del Mercado Negro especializada en armas y armaduras mágicas.
   Sistema de subastas por tiempo limitado.
   
   Funcionalidades:
   - Ver artefactos en subasta activa
   - Pujar por artefactos
   - Ver historial de pujas
   - Sistema de tiempo real con countdown
   
   Autor: MageLord Team
   Última actualización: 2026-02-01
   
   ============================================================================ */

"use client"

import { useState, useEffect } from "react"
import { type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gem, Swords, Shield, Timer, TrendingUp, AlertTriangle, Crown } from "lucide-react"

/* ============================================================================
   TIPOS Y INTERFACES
   ============================================================================ */

interface TiendaArtefactosProps {
  language: Language
  province?: any
  user?: any
  gameState?: any
}

interface Artifact {
  id: string
  name: string
  type: "weapon" | "armor" | "accessory"
  rarity: "común" | "raro" | "épico" | "legendario"
  description: string
  stats: string[]
  startingBid: number
  currentBid: number
  highestBidder: string | null
  expiresAt: Date
  imageUrl?: string
}

/* ============================================================================
   COMPONENTE PRINCIPAL
   ============================================================================ */

export function TiendaArtefactos({ language, province, user, gameState }: TiendaArtefactosProps) {
  
  /* ==========================================================================
     ESTADO DEL COMPONENTE
     ========================================================================== */
  
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [bidAmount, setBidAmount] = useState(0)
  const [showBidModal, setShowBidModal] = useState(false)

  /* ==========================================================================
     CARGA DE DATOS (TODO: Conectar con Supabase)
     ========================================================================== */
  
  useEffect(() => {
    // TODO: Cargar artefactos desde la base de datos
    // const { data, error } = await supabase.from('black_market_auctions')...
    
    // MOCK DATA temporal
    const mockArtifacts: Artifact[] = [
      {
        id: "1",
        name: language === "es" ? "Espada Flamígera" : "Flaming Sword",
        type: "weapon",
        rarity: "épico",
        description: language === "es" 
          ? "Espada forjada en las llamas del Monte Ignis. Causa daño de fuego adicional."
          : "Sword forged in the flames of Mount Ignis. Deals additional fire damage.",
        stats: [
          language === "es" ? "+50 Ataque" : "+50 Attack",
          language === "es" ? "+25 Daño de Fuego" : "+25 Fire Damage",
          language === "es" ? "10% de quemar al enemigo" : "10% to burn enemy"
        ],
        startingBid: 100000,
        currentBid: 450000,
        highestBidder: "DarkLord_88",
        expiresAt: new Date(Date.now() + 3.5 * 60 * 60 * 1000), // 3.5 horas
      },
      {
        id: "2",
        name: language === "es" ? "Armadura de Sombras" : "Shadow Armor",
        type: "armor",
        rarity: "legendario",
        description: language === "es"
          ? "Armadura tejida con las sombras de la noche eterna. Otorga invisibilidad parcial."
          : "Armor woven with the shadows of eternal night. Grants partial invisibility.",
        stats: [
          language === "es" ? "+100 Defensa" : "+100 Defense",
          language === "es" ? "+30% Evasión" : "+30% Evasion",
          language === "es" ? "Invisibilidad al atacar de noche" : "Invisibility when attacking at night"
        ],
        startingBid: 500000,
        currentBid: 1200000,
        highestBidder: "ShadowMaster",
        expiresAt: new Date(Date.now() + 1.2 * 60 * 60 * 1000), // 1.2 horas
      },
    ]
    
    setArtifacts(mockArtifacts)
  }, [language])

  /* ==========================================================================
     UTILIDADES
     ========================================================================== */
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "común": return "text-gray-400 border-gray-400"
      case "raro": return "text-blue-400 border-blue-400"
      case "épico": return "text-purple-400 border-purple-400"
      case "legendario": return "text-yellow-400 border-yellow-400"
      default: return "text-gray-400 border-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weapon": return <Swords className="h-5 w-5" />
      case "armor": return <Shield className="h-5 w-5" />
      default: return <Gem className="h-5 w-5" />
    }
  }

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    
    if (diff <= 0) return language === "es" ? "Expirado" : "Expired"
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  const handleBid = () => {
    if (!selectedArtifact) return
    
    // TODO: Implementar lógica de puja con Supabase
    alert(
      language === "es"
        ? `¡Puja realizada! Has pujado ${bidAmount.toLocaleString()} oro por ${selectedArtifact.name}`
        : `Bid placed! You bid ${bidAmount.toLocaleString()} gold for ${selectedArtifact.name}`
    )
    
    setShowBidModal(false)
    setBidAmount(0)
    setSelectedArtifact(null)
  }

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <div className="space-y-6">
      {/* ====================================================================
          HEADER DE LA SECCIÓN
          ==================================================================== */}
      
      <div className="flex items-center gap-3">
        <Gem className="h-8 w-8 text-[#d4af37]" />
        <div>
          <h2 className="text-2xl font-bold text-[#d4af37]">
            {language === "es" ? "Tienda de Artefactos" : "Artifact Shop"}
          </h2>
          <p className="text-sm text-gray-400">
            {language === "es" 
              ? "Armas y armaduras mágicas con poderes únicos" 
              : "Magical weapons and armor with unique powers"}
          </p>
        </div>
      </div>

      {/* ====================================================================
          PANEL DE INFORMACIÓN
          ==================================================================== */}
      
      <Card className="bg-purple-900/20 border-purple-500/30 p-4">
        <div className="flex items-start gap-3">
          <Crown className="h-6 w-6 text-purple-400 flex-shrink-0" />
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <strong className="text-purple-400">
                {language === "es" ? "⚔️ Artefactos Únicos:" : "⚔️ Unique Artifacts:"}
              </strong>{" "}
              {language === "es"
                ? "Cada artefacto es único y otorga bonificaciones especiales en combate."
                : "Each artifact is unique and grants special combat bonuses."}
            </p>
            <p>
              <strong className="text-yellow-400">
                {language === "es" ? "💎 Sistema de Subastas:" : "💎 Auction System:"}
              </strong>{" "}
              {language === "es"
                ? "Puja por los artefactos. El mayor postor al finalizar el tiempo gana."
                : "Bid on artifacts. The highest bidder when time expires wins."}
            </p>
            <p>
              <strong className="text-orange-400">
                {language === "es" ? "⏰ Tiempo Limitado:" : "⏰ Limited Time:"}
              </strong>{" "}
              {language === "es"
                ? "Las subastas expiran después de 24 horas. ¡No pierdas tu oportunidad!"
                : "Auctions expire after 24 hours. Don't miss your chance!"}
            </p>
          </div>
        </div>
      </Card>

      {/* ====================================================================
          GRID DE ARTEFACTOS EN SUBASTA
          ==================================================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {artifacts.map((artifact) => {
          const rarityColor = getRarityColor(artifact.rarity)
          const typeIcon = getTypeIcon(artifact.type)
          const timeRemaining = getTimeRemaining(artifact.expiresAt)
          
          return (
            <Card
              key={artifact.id}
              className={`bg-gradient-to-br from-gray-900 to-black border-2 ${rarityColor} overflow-hidden hover:scale-[1.02] transition-all`}
            >
              {/* Header del artefacto */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {typeIcon}
                    <div>
                      <h3 className={`text-lg font-bold ${rarityColor.split(' ')[0]}`}>
                        {artifact.name}
                      </h3>
                      <p className="text-xs text-gray-400 capitalize">
                        {artifact.rarity} · {artifact.type === "weapon" 
                          ? (language === "es" ? "Arma" : "Weapon")
                          : artifact.type === "armor" 
                            ? (language === "es" ? "Armadura" : "Armor")
                            : (language === "es" ? "Accesorio" : "Accessory")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timer */}
                  <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                    <Timer className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{timeRemaining}</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-400">{artifact.description}</p>
                
                {/* Stats */}
                <div className="space-y-1">
                  {artifact.stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">{stat}</span>
                    </div>
                  ))}
                </div>

                {/* Información de puja */}
                <div className="bg-black/30 rounded p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {language === "es" ? "Puja inicial:" : "Starting bid:"}
                    </span>
                    <span className="text-yellow-400 font-semibold">
                      {artifact.startingBid.toLocaleString()} 💰
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {language === "es" ? "Puja actual:" : "Current bid:"}
                    </span>
                    <span className="text-yellow-400 font-bold text-lg">
                      {artifact.currentBid.toLocaleString()} 💰
                    </span>
                  </div>

                  {artifact.highestBidder && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {language === "es" ? "Mayor postor:" : "Highest bidder:"}
                      </span>
                      <span className="text-purple-400">{artifact.highestBidder}</span>
                    </div>
                  )}
                </div>

                {/* Botón de pujar */}
                <Button
                  onClick={() => {
                    setSelectedArtifact(artifact)
                    setBidAmount(artifact.currentBid + Math.floor(artifact.currentBid * 0.1))
                    setShowBidModal(true)
                  }}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4cf5f] hover:from-[#f4cf5f] hover:to-[#d4af37] text-black font-bold"
                >
                  {language === "es" ? "💎 Pujar" : "💎 Place Bid"}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* ====================================================================
          MODAL DE PUJA
          ==================================================================== */}
      
      {showBidModal && selectedArtifact && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowBidModal(false)}
        >
          <Card
            className="bg-[#1a1a1a] border-[#d4af37] p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Gem className="h-8 w-8 text-[#d4af37]" />
                <h3 className="text-2xl font-bold text-[#d4af37]">
                  {language === "es" ? "Realizar Puja" : "Place Bid"}
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-gray-300">
                  <strong>{selectedArtifact.name}</strong>
                </p>
                <p className="text-sm text-gray-400">
                  {language === "es" ? "Puja actual:" : "Current bid:"}{" "}
                  <span className="text-yellow-400 font-bold">
                    {selectedArtifact.currentBid.toLocaleString()} 💰
                  </span>
                </p>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {language === "es" ? "Tu puja (mínimo +10%):" : "Your bid (minimum +10%):"}
                  </label>
                  <input
                    type="number"
                    min={selectedArtifact.currentBid * 1.1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full bg-[#0f0f0f] border border-[#d4af37]/30 text-[#d4af37] rounded p-2"
                  />
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                  <p className="text-xs text-yellow-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {language === "es"
                      ? "Si otro jugador puja más alto, perderás la subasta."
                      : "If another player bids higher, you'll lose the auction."}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowBidModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-400"
                >
                  {language === "es" ? "Cancelar" : "Cancel"}
                </Button>
                <Button
                  onClick={handleBid}
                  disabled={bidAmount < selectedArtifact.currentBid * 1.1}
                  className="flex-1 bg-[#d4af37] hover:bg-[#f4cf5f] text-black font-bold"
                >
                  {language === "es" ? "Confirmar Puja" : "Confirm Bid"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ====================================================================
          MENSAJE SI NO HAY ARTEFACTOS
          ==================================================================== */}
      
      {artifacts.length === 0 && (
        <Card className="p-12 text-center bg-[#1a1a1a]/50">
          <Gem className="h-16 w-16 mx-auto text-[#d4af37]/30 mb-4" />
          <p className="text-gray-400">
            {language === "es"
              ? "No hay subastas activas en este momento. Vuelve más tarde."
              : "No active auctions at this time. Check back later."}
          </p>
        </Card>
      )}
    </div>
  )
}
