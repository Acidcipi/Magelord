"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Filter, X } from "lucide-react"

interface MercadoGlobalPageProps {
  language: Language
  province?: any
  user?: any
}

interface TradeOffer {
  id: string
  seller: string
  sellerFaction: string
  resourceOffered: "gold" | "food" | "mana"
  amountOffered: number
  resourceRequested: "gold" | "food" | "mana"
  amountRequested: number
  postedAt: string
}

export function MercadoGlobalPage({ language, province, user }: MercadoGlobalPageProps) {
  const t = useTranslation(language)
  const [filterResource, setFilterResource] = useState<string>("all")
  const [myOffers, setMyOffers] = useState<TradeOffer[]>([])
  const [showCreateOffer, setShowCreateOffer] = useState(false)

  // Form state
  const [resourceToSell, setResourceToSell] = useState<"gold" | "food" | "mana">("gold")
  const [amountToSell, setAmountToSell] = useState(0)
  const [resourceToBuy, setResourceToBuy] = useState<"gold" | "food" | "mana">("food")
  const [amountToBuy, setAmountToBuy] = useState(0)

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case "gold":
        return "💰"
      case "food":
        return "🌾"
      case "mana":
        return "💎"
      default:
        return "❓"
    }
  }

  const getResourceName = (resource: string) => {
    if (language === "es") {
      switch (resource) {
        case "gold":
          return "Oro"
        case "food":
          return "Comida"
        case "mana":
          return "Maná"
      }
    } else {
      switch (resource) {
        case "gold":
          return "Gold"
        case "food":
          return "Food"
        case "mana":
          return "Mana"
      }
    }
  }

  const handleCreateOffer = () => {
    const tariff = Math.floor(amountToSell * 0.05) // 5% tax
    const effectiveAmount = amountToSell - tariff

    alert(
      language === "es"
        ? `Oferta creada: Vendes ${amountToSell} de ${getResourceName(resourceToSell)} por ${amountToBuy} de ${getResourceName(resourceToBuy)}.\n\nImpuesto del 5%: ${tariff}\nCantidad efectiva: ${effectiveAmount}\nCoste: 1 Turno`
        : `Offer created: You sell ${amountToSell} ${getResourceName(resourceToSell)} for ${amountToBuy} ${getResourceName(resourceToBuy)}.\n\n5% Tax: ${tariff}\nEffective amount: ${effectiveAmount}\nCost: 1 Turn`,
    )

    setShowCreateOffer(false)
    setAmountToSell(0)
    setAmountToBuy(0)
  }

  const handleAcceptOffer = (offer: TradeOffer) => {
    alert(
      language === "es"
        ? `Has aceptado la oferta de ${offer.seller}.\nRecibes: ${offer.amountOffered.toLocaleString()} ${getResourceName(offer.resourceOffered)}\nPagas: ${offer.amountRequested.toLocaleString()} ${getResourceName(offer.resourceRequested)}\nCoste: 1 Turno`
        : `You accepted ${offer.seller}'s offer.\nYou receive: ${offer.amountOffered.toLocaleString()} ${getResourceName(offer.resourceOffered)}\nYou pay: ${offer.amountRequested.toLocaleString()} ${getResourceName(offer.resourceRequested)}\nCost: 1 Turn`,
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2010] to-[#1a1a1a] border-2 border-[#d4af37]/40 rounded-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#d4af37]/20 p-4 rounded-full border-2 border-[#d4af37]">
              <Users className="h-10 w-10 text-[#d4af37]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#d4af37]">
                {language === "es" ? "🌐 Mercado Global" : "🌐 Global Market"}
              </h1>
              <p className="text-gray-400 text-sm">
                {language === "es"
                  ? "Intercambio de recursos Peer-to-Peer entre jugadores"
                  : "Peer-to-Peer resource exchange between players"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateOffer(true)}
            className="bg-gradient-to-r from-[#d4af37] to-[#f4cf5f] hover:from-[#f4cf5f] hover:to-[#d4af37] text-black font-bold px-6 py-3 text-lg shadow-lg"
          >
            {language === "es" ? "✨ Crear Oferta" : "✨ Create Offer"}
          </Button>
        </div>
      </div>

      {/* Info Panel */}
      <Card className="bg-blue-900/20 border-blue-500/30 p-4">
        <div className="flex items-start gap-3">
          <Users className="h-6 w-6 text-blue-400 flex-shrink-0" />
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <strong className="text-blue-400">{language === "es" ? "💼 Sistema P2P:" : "💼 P2P System:"}</strong>{" "}
              {language === "es"
                ? "Comercia directamente con otros jugadores para equilibrar tus recursos."
                : "Trade directly with other players to balance your resources."}
            </p>
            <p>
              <strong className="text-yellow-400">{language === "es" ? "💸 Impuesto del 5%:" : "💸 5% Tax:"}</strong>{" "}
              {language === "es"
                ? "El sistema cobra una comisión del 5% sobre el recurso vendido."
                : "The system charges a 5% fee on the resource sold."}
            </p>
            <p>
              <strong className="text-orange-400">{language === "es" ? "⏱️ Coste de Turnos:" : "⏱️ Turn Cost:"}</strong>{" "}
              {language === "es"
                ? "Publicar o aceptar una oferta consume 1 Turno."
                : "Publishing or accepting an offer consumes 1 Turn."}
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-5 w-5 text-[#d4af37]" />
        <span className="text-sm text-gray-400">{language === "es" ? "Filtrar por:" : "Filter by:"}</span>
        <div className="flex gap-2">
          {["all", "gold", "food", "mana"].map((res) => (
            <Button
              key={res}
              onClick={() => setFilterResource(res)}
              variant={filterResource === res ? "default" : "outline"}
              className={`${
                filterResource === res ? "bg-[#d4af37] text-black" : "bg-transparent border-[#d4af37]/30 text-[#d4af37]"
              } hover:bg-[#d4af37]/20`}
              size="sm"
            >
              {res === "all"
                ? language === "es"
                  ? "Todos"
                  : "All"
                : `${getResourceIcon(res)} ${getResourceName(res)}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Offers List */}
      {/* Removed MOCK_OFFERS - will be populated from database */}
      <Card className="p-12 text-center bg-[#1a1a1a]/50 border-[#d4af37]/10">
        <div className="text-gray-400 space-y-3">
          <Users className="h-16 w-16 mx-auto text-[#d4af37]/30" />
          <p className="text-xl font-semibold text-[#d4af37]">
            {language === "es" ? "Ofertas Disponibles" : "Available Offers"}
          </p>
          <p>
            {language === "es"
              ? "Las ofertas de comercio se cargarán desde la base de datos próximamente"
              : "Trade offers will be loaded from the database soon"}
          </p>
        </div>
      </Card>

      {/* My Offers Section */}
      <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-4">
        <h3 className="text-lg font-semibold text-[#d4af37] mb-3">
          {language === "es" ? "📌 Mis Ofertas" : "📌 My Offers"}
        </h3>
        {myOffers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {language === "es" ? "No tienes ofertas activas." : "You have no active offers."}
          </p>
        ) : (
          <div className="space-y-2">
            {myOffers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between bg-[#0f0f0f] p-3 rounded">
                <span className="text-sm text-gray-300">
                  {offer.amountOffered.toLocaleString()} {getResourceName(offer.resourceOffered)} →{" "}
                  {offer.amountRequested.toLocaleString()} {getResourceName(offer.resourceRequested)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-900/20 bg-transparent"
                >
                  {language === "es" ? "Cancelar" : "Cancel"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create Offer Modal */}
      {showCreateOffer && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowCreateOffer(false)}
        >
          <Card className="bg-[#1a1a1a] border-[#d4af37] p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#d4af37]">
                  {language === "es" ? "Crear Oferta" : "Create Offer"}
                </h2>
                <button onClick={() => setShowCreateOffer(false)}>
                  <X className="h-6 w-6 text-gray-400 hover:text-[#d4af37]" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {language === "es" ? "Recurso a Vender:" : "Resource to Sell:"}
                  </label>
                  <select
                    value={resourceToSell}
                    onChange={(e) => setResourceToSell(e.target.value as any)}
                    className="w-full bg-[#0f0f0f] border border-[#d4af37]/30 text-[#d4af37] rounded p-2"
                  >
                    <option value="gold">
                      {getResourceIcon("gold")} {getResourceName("gold")}
                    </option>
                    <option value="food">
                      {getResourceIcon("food")} {getResourceName("food")}
                    </option>
                    <option value="mana">
                      {getResourceIcon("mana")} {getResourceName("mana")}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {language === "es" ? "Cantidad:" : "Amount:"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amountToSell}
                    onChange={(e) => setAmountToSell(Number(e.target.value))}
                    className="w-full bg-[#0f0f0f] border border-[#d4af37]/30 text-[#d4af37] rounded p-2"
                  />
                </div>

                <div className="text-center text-2xl text-gray-400">↓</div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {language === "es" ? "Recurso a Recibir:" : "Resource to Receive:"}
                  </label>
                  <select
                    value={resourceToBuy}
                    onChange={(e) => setResourceToBuy(e.target.value as any)}
                    className="w-full bg-[#0f0f0f] border border-[#d4af37]/30 text-[#d4af37] rounded p-2"
                  >
                    <option value="gold">
                      {getResourceIcon("gold")} {getResourceName("gold")}
                    </option>
                    <option value="food">
                      {getResourceIcon("food")} {getResourceName("food")}
                    </option>
                    <option value="mana">
                      {getResourceIcon("mana")} {getResourceName("mana")}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {language === "es" ? "Cantidad:" : "Amount:"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amountToBuy}
                    onChange={(e) => setAmountToBuy(Number(e.target.value))}
                    className="w-full bg-[#0f0f0f] border border-[#d4af37]/30 text-[#d4af37] rounded p-2"
                  />
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                  <p className="text-xs text-yellow-400">
                    ⚠️ {language === "es" ? "Impuesto del 5%:" : "5% Tax:"}{" "}
                    {Math.floor(amountToSell * 0.05).toLocaleString()}
                  </p>
                  <p className="text-xs text-yellow-400">
                    💰 {language === "es" ? "Recibirás:" : "You'll receive:"}{" "}
                    {(amountToSell - Math.floor(amountToSell * 0.05)).toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-400 mt-1">
                    ⏱️ {language === "es" ? "Coste: 1 Turno" : "Cost: 1 Turn"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCreateOffer}
                disabled={amountToSell <= 0 || amountToBuy <= 0}
                className="w-full bg-[#d4af37] hover:bg-[#f4cf5f] text-black font-bold"
              >
                {language === "es" ? "Publicar Oferta" : "Publish Offer"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
