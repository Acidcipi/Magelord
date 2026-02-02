/* ============================================================================
   MAGELORD - MERCADO NEGRO (HUB PRINCIPAL)
   ============================================================================
   
   Página principal del Mercado Negro que muestra las 6 secciones disponibles.
   Los usuarios pueden hacer clic en una sección para navegar a ella.
   
   Secciones disponibles:
   1. Tienda de Artefactos - Armas y armaduras mágicas
   2. Taberna - Mercenarios y espías
   3. Criadero - Criaturas míticas
   4. Tienda Exótica - Objetos raros
   5. Salón de Héroes - Héroes legendarios
   6. Altar de los Dioses - Bendiciones divinas
   
   Autor: MageLord Team
   Última actualización: 2026-02-01
   
   ============================================================================ */

"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skull, Swords, AlertTriangle, Gem, Beer, Egg, Sparkles, Crown, Church, ArrowLeft } from "lucide-react"

// Importar las secciones individuales
import { TiendaArtefactos } from "@/components/mercado-negro/tienda-artefactos"
import { Taberna } from "@/components/mercado-negro/taberna"
import { Criadero } from "@/components/mercado-negro/criadero"
import { TiendaExotica } from "@/components/mercado-negro/tienda-exotica"
import { SalonHeroes } from "@/components/mercado-negro/salon-heroes"
import { AltarDioses } from "@/components/mercado-negro/altar-dioses"

/* ============================================================================
   TIPOS Y INTERFACES
   ============================================================================ */

interface MercadoNegroPageProps {
  language: Language
  province?: any
  user?: any
  gameState?: any
}

type BlackMarketSection =
  | "tienda-artefactos"
  | "taberna"
  | "criadero"
  | "tienda-exotica"
  | "salon-heroes"
  | "altar-dioses"
  | null

interface BlackMarketCard {
  id: BlackMarketSection
  name: string
  description: string
  image: string
  icon: any
}

/* ============================================================================
   COMPONENTE PRINCIPAL
   ============================================================================ */

export function MercadoNegroPage({ language, province, user, gameState }: MercadoNegroPageProps) {
  const t = useTranslation(language)
  const [activeSection, setActiveSection] = useState<BlackMarketSection>(null)

  /* ==========================================================================
     CONFIGURACIÓN DE SECCIONES
     ========================================================================== */
  
  const sections: BlackMarketCard[] = [
    {
      id: "tienda-artefactos",
      name: language === "es" ? "Tienda de Artefactos" : "Artifact Shop",
      description:
        language === "es"
          ? "Armas y armaduras mágicas con poderes únicos"
          : "Magical weapons and armor with unique powers",
      image: "/magical-artifacts-shop-dark-fantasy.jpg",
      icon: Gem,
    },
    {
      id: "taberna",
      name: language === "es" ? "Taberna" : "Tavern",
      description:
        language === "es"
          ? "Contrata mercenarios y espías para tus misiones"
          : "Hire mercenaries and spies for your missions",
      image: "/medieval-fantasy-tavern-dark-interior.jpg",
      icon: Beer,
    },
    {
      id: "criadero",
      name: language === "es" ? "Criadero" : "Breeding Grounds",
      description: language === "es" ? "Criaturas míticas y bestias de guerra" : "Mythical creatures and war beasts",
      image: "/fantasy-creature-breeding-dragon-eggs.jpg",
      icon: Egg,
    },
    {
      id: "tienda-exotica",
      name: language === "es" ? "Tienda Exótica" : "Exotic Shop",
      description: language === "es" ? "Objetos raros y recursos prohibidos" : "Rare items and forbidden resources",
      image: "/exotic-magical-items-shop-mysterious.jpg",
      icon: Sparkles,
    },
    {
      id: "salon-heroes",
      name: language === "es" ? "Salón de Héroes" : "Hall of Heroes",
      description:
        language === "es"
          ? "Recluta héroes legendarios para liderar tus ejércitos"
          : "Recruit legendary heroes to lead your armies",
      image: "/legendary-heroes-hall-epic-fantasy.jpg",
      icon: Crown,
    },
    {
      id: "altar-dioses",
      name: language === "es" ? "Altar de los Dioses" : "Altar of the Gods",
      description:
        language === "es" ? "Bendiciones divinas y favores celestiales" : "Divine blessings and celestial favors",
      image: "/divine-altar-gods-temple-mystical.jpg",
      icon: Church,
    },
  ]

  /* ==========================================================================
     RENDERIZADO DE SECCIÓN ACTIVA
     ========================================================================== */
  
  const renderSectionContent = () => {
    if (!activeSection) return null

    const props = { language, province, user, gameState }

    switch (activeSection) {
      case "tienda-artefactos":
        return <TiendaArtefactos {...props} />
      case "taberna":
        return <Taberna {...props} />
      case "criadero":
        return <Criadero {...props} />
      case "tienda-exotica":
        return <TiendaExotica {...props} />
      case "salon-heroes":
        return <SalonHeroes {...props} />
      case "altar-dioses":
        return <AltarDioses {...props} />
      default:
        return null
    }
  }

  /* ==========================================================================
     RENDER DEL HUB PRINCIPAL
     ========================================================================== */

  return (
    <div className="space-y-6">
      {/* ====================================================================
          HEADER - Banner principal del Mercado Negro
          ==================================================================== */}
      
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gray-700/50 rounded-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="h-10 w-10 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-300">
                {language === "es" ? "🌑 Mercado Negro" : "🌑 Black Market"}
              </h1>
              <p className="text-gray-500 text-sm">
                {language === "es"
                  ? "Comercio clandestino · Poder prohibido · Riquezas ocultas"
                  : "Clandestine trade · Forbidden power · Hidden riches"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          NAVEGACIÓN DE SECCIONES (solo visible cuando hay sección activa)
          ==================================================================== */}
      
      {activeSection && (
        <div className="bg-black/40 border border-gray-700/50 rounded-lg p-2">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 ${
                  activeSection === section.id
                    ? "bg-[#d4af37] text-black hover:bg-[#f4cf5f]"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.name}</span>
              </Button>
            ))}
            <Button
              onClick={() => setActiveSection(null)}
              variant="ghost"
              className="ml-auto text-gray-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "es" ? "Volver" : "Back"}
            </Button>
          </div>
        </div>
      )}

      {/* ====================================================================
          CONTENIDO PRINCIPAL
          ==================================================================== */}
      
      {!activeSection ? (
        <>
          {/* INFO PANEL - Información sobre el Mercado Negro */}
          <Card className="bg-gray-900/90 border-gray-700/50 p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <div className="text-sm text-gray-400 space-y-1">
                <p>
                  <strong className="text-red-400">
                    {language === "es" ? "⚔️ Mercado Clandestino:" : "⚔️ Clandestine Market:"}
                  </strong>{" "}
                  {language === "es"
                    ? "Aquí encontrarás lo que no se vende en el mercado oficial. Poder a precio de oro."
                    : "Here you'll find what's not sold in the official market. Power at the price of gold."}
                </p>
                <p>
                  <strong className="text-orange-400">
                    {language === "es" ? "💰 Precios Elevados:" : "💰 High Prices:"}
                  </strong>{" "}
                  {language === "es"
                    ? "Los objetos del Mercado Negro son costosos pero ofrecen ventajas únicas."
                    : "Black Market items are expensive but offer unique advantages."}
                </p>
                <p>
                  <strong className="text-yellow-400">
                    {language === "es" ? "🎲 Disponibilidad Limitada:" : "🎲 Limited Availability:"}
                  </strong>{" "}
                  {language === "es"
                    ? "Los artículos cambian constantemente. Si ves algo que te interesa, cómpralo rápido."
                    : "Items change constantly. If you see something you like, buy it quickly."}
                </p>
              </div>
            </div>
          </Card>

          {/* GRID DE SECCIONES - Tarjetas clickeables */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
              <Swords className="h-6 w-6" />
              {language === "es" ? "Secciones del Mercado Negro" : "Black Market Sections"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <Card
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="relative overflow-hidden border-2 border-[#d4af37]/30 hover:border-[#d4af37] cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-gray-900 to-black"
                  >
                    {/* Imagen de fondo */}
                    <div
                      className="h-48 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${section.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <Icon className="h-8 w-8 text-[#d4af37]" />
                        <h3 className="text-2xl font-bold text-[#d4af37]">{section.name}</h3>
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-4">
                      <p className="text-sm text-gray-400 mb-4">{section.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {language === "es" ? "Click para explorar" : "Click to explore"}
                        </span>
                        <Button
                          size="sm"
                          className="bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/50"
                        >
                          {language === "es" ? "Entrar →" : "Enter →"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        /* CONTENIDO DE SECCIÓN ACTIVA */
        renderSectionContent()
      )}
    </div>
  )
}
