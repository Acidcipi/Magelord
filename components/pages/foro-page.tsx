"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { useState } from "react"
import { Megaphone, Beer, Swords, BookOpen, Handshake, Search, Filter, Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ForoPageProps {
  language: Language
}

const FORUM_CATEGORIES = [
  {
    id: "announcements",
    name: "Pregón Real",
    icon: Megaphone,
    color: "#ff6b6b",
    description: "Anuncios oficiales y noticias importantes",
  },
  { id: "tavern", name: "La Taberna", icon: Beer, color: "#f59e0b", description: "Charlas generales y off-topic" },
  {
    id: "war",
    name: "Campo de Marte",
    icon: Swords,
    color: "#ef4444",
    description: "Estrategias de guerra y tácticas",
  },
  {
    id: "magic",
    name: "Escuela de Magia",
    icon: BookOpen,
    color: "#8b5cf6",
    description: "Hechizos, rituales e investigación",
  },
  {
    id: "recruitment",
    name: "Embajada",
    icon: Handshake,
    color: "#3b82f6",
    description: "Reclutamiento y diplomacia de gremios",
  },
]

export function ForoPage({ language }: ForoPageProps) {
  const t = useTranslation(language)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a1810] to-[#1a1a1a] border-b-2 border-[#d4af37]/30 p-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#d4af37] mb-2 font-serif">El Códice Arcano</h1>
          <p className="text-gray-400">Donde los Archimagos comparten sabiduría y estrategias</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        {/* Left Sidebar - Categories */}
        <div className="w-64 shrink-0 space-y-3">
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#d4af37]/20 rounded-lg p-4">
            <h3 className="text-[#d4af37] font-semibold mb-3 text-sm uppercase tracking-wider">Categorías</h3>

            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all mb-2 ${
                activeCategory === null
                  ? "bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]"
                  : "hover:bg-[#d4af37]/10 text-gray-400"
              }`}
            >
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Todos</span>
            </button>

            {FORUM_CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all mb-2 group ${
                    activeCategory === category.id
                      ? "bg-[#d4af37]/20 border border-[#d4af37]/50"
                      : "hover:bg-[#d4af37]/10 border border-transparent"
                  }`}
                  style={{
                    borderColor: activeCategory === category.id ? category.color : undefined,
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: category.color }} />
                  <span
                    className={`text-sm font-medium ${
                      activeCategory === category.id ? "text-[#d4af37]" : "text-gray-400 group-hover:text-[#d4af37]"
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#d4af37]/20 rounded-lg p-4">
            <h3 className="text-[#d4af37] font-semibold mb-3 text-sm uppercase tracking-wider">Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Hilos totales:</span>
                <span className="text-[#d4af37] font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mensajes hoy:</span>
                <span className="text-[#d4af37] font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Usuarios online:</span>
                <span className="text-green-500 font-semibold flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  {Math.floor(Math.random() * 50 + 100)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Filters */}
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#d4af37]/20 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar hilos por título o autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/30 rounded-lg pl-10 pr-4 py-2 text-[#d4af37] placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button className="bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
                <Send className="h-4 w-4 mr-2" />
                Nuevo Hilo
              </Button>
            </div>
          </div>

          {/* Empty State */}
          <Card className="p-12 text-center bg-[#1a1a1a]/50 border-[#d4af37]/10">
            <div className="text-gray-400 space-y-3">
              <Megaphone className="h-16 w-16 mx-auto text-[#d4af37]/30" />
              <p className="text-xl font-semibold text-[#d4af37]">
                {language === "es" ? "Foro en Construcción" : "Forum Under Construction"}
              </p>
              <p>
                {language === "es"
                  ? "Los hilos del foro se cargarán desde la base de datos próximamente"
                  : "Forum threads will be loaded from the database soon"}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
