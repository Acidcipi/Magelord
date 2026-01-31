"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { useState } from "react"
import { Sparkles, Sword, ShoppingBag, Wrench, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoticiasPageProps {
  language: Language
}

type NewsCategory = "all" | "updates" | "community" | "diplomacy" | "events"

interface NewsArticle {
  id: string
  title: string
  category: NewsCategory
  date: string
  readTime: number
  excerpt: string
  content: string
  image: string
  featured?: boolean
  tag?: string
}

export function NoticiasPage({ language }: NoticiasPageProps) {
  const t = useTranslation(language)
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("all")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: "ERA 2.0: El Renacer de la Magia Ancestral",
      category: "updates",
      date: "2025-01-15",
      readTime: 8,
      excerpt:
        "El equilibrio de poder ha sido restablecido. Las Torres de Maná ahora producen un 20% más de energía arcana.",
      content: `La Era 2.0 marca un punto de inflexión en la historia de MageLord. Tras meses de investigación arcana, los archimagos han descubierto antiguos conocimientos que aumentan la eficiencia de las Torres de Maná en un 20%.

## Cambios Principales:
- **Torres de Maná**: +20% producción base
- **Rituales**: Coste reducido en un 15%
- **Nuevo Sistema de Combate**: Introducción de formaciones tácticas

### Impacto en la Economía
Este cambio revolucionará la economía del servidor. Los jugadores enfocados en magia verán un aumento significativo en su poder, mientras que las facciones militares necesitarán adaptarse.

El cambio entra en vigor el próximo reset de servidor.`,
      image: "/epic-fantasy-magical-towers-glowing-with-arcane-en.jpg",
      featured: true,
      tag: "PARCHE V2.0",
    },
    {
      id: "2",
      title: "Batalla Épica: [HELL] vs [LIGHT] en el Valle Oscuro",
      category: "community",
      date: "2025-01-14",
      readTime: 5,
      excerpt:
        "Una guerra épica entre dos de los gremios más poderosos del servidor resultó en 150,000 bajas combinadas.",
      content: "La batalla más grande de la historia reciente...",
      image: "/epic-fantasy-battle-armies-clashing-dark-vs-light.jpg",
      tag: "GUERRA",
    },
    {
      id: "3",
      title: "Nuevos Artefactos Legendarios en el Mercado Negro",
      category: "updates",
      date: "2025-01-13",
      readTime: 4,
      excerpt: "Tres artefactos de rareza Legendaria han aparecido en las subastas. ¿Quién los reclamará?",
      content: "Los coleccionistas están en alerta máxima...",
      image: "/fantasy-legendary-magical-artifacts-glowing-on-dar.jpg",
      tag: "MERCADO",
    },
    {
      id: "4",
      title: "Balance Pass: Ajustes a Unidades Tier 4",
      category: "updates",
      date: "2025-01-12",
      readTime: 6,
      excerpt: "Los Dragones y Demonios reciben ajustes para equilibrar el meta competitivo.",
      content: "Después de analizar millones de batallas...",
      image: "/fantasy-dragons-and-demons-combat-balancing.jpg",
      tag: "TÉCNICO",
    },
    {
      id: "5",
      title: "Pacto Histórico: Alianza de 5 Gremios",
      category: "diplomacy",
      date: "2025-01-11",
      readTime: 3,
      excerpt: "Cinco gremios Top 20 han firmado un Pacto de No Agresión que cambia el panorama político.",
      content: "La diplomacia alcanza un nuevo nivel...",
      image: "/fantasy-guild-alliance-meeting-medieval-banners.jpg",
      tag: "DIPLOMACIA",
    },
    {
      id: "6",
      title: "Evento Especial: Cacería del Dragón Ancestral",
      category: "events",
      date: "2025-01-10",
      readTime: 4,
      excerpt: "Un dragón ancestral ha sido avistado. El gremio que lo derrote recibirá recompensas legendarias.",
      content: "Un evento global de una semana...",
      image: "/ancient-dragon-boss-raid-fantasy-epic.jpg",
      tag: "EVENTO",
    },
  ]

  const filteredArticles = newsArticles.filter(
    (article) => activeCategory === "all" || article.category === activeCategory,
  )

  const featuredArticle = newsArticles.find((a) => a.featured)
  const regularArticles = filteredArticles.filter((a) => !a.featured)

  const getCategoryIcon = (category: NewsCategory) => {
    switch (category) {
      case "updates":
        return <Wrench className="h-4 w-4" />
      case "community":
        return <Sword className="h-4 w-4" />
      case "diplomacy":
        return <Sparkles className="h-4 w-4" />
      case "events":
        return <ShoppingBag className="h-4 w-4" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: NewsCategory) => {
    switch (category) {
      case "updates":
        return "text-blue-400"
      case "community":
        return "text-red-400"
      case "diplomacy":
        return "text-purple-400"
      case "events":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const microLogs = [
    { date: "2h ago", text: "Ajustado coste de mantenimiento de dragones: -5% oro" },
    { date: "5h ago", text: "Corregido bug visual en Torres de Maná nivel 5" },
    { date: "8h ago", text: "Reducido lag en batallas con +500 unidades" },
    { date: "12h ago", text: "Añadida traducción al portugués brasileño" },
  ]

  const upcomingEvents = [
    { date: "Jan 20", event: "Reset de Era 3.0" },
    { date: "Jan 25", event: "Torneo de Gremios" },
    { date: "Feb 1", event: "Evento: Luna de Sangre" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      {featuredArticle && (
        <div
          className="relative h-[500px] bg-cover bg-center cursor-pointer overflow-hidden group"
          style={{
            backgroundImage: `url('${featuredArticle.image}')`,
          }}
          onClick={() => setSelectedArticle(featuredArticle)}
        >
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
            <div className="container mx-auto max-w-6xl">
              {/* Tag with animated glow */}
              <div className="inline-block mb-4">
                <div className="bg-[#d4af37] text-black px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                  {featuredArticle.tag}
                </div>
              </div>

              {/* Title with serif font and gradient */}
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                {featuredArticle.title}
              </h1>

              {/* Executive summary */}
              <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">{featuredArticle.excerpt}</p>

              {/* Read time */}
              <div className="mt-6 text-gray-400 text-sm">Lectura: {featuredArticle.readTime} min</div>
            </div>
          </div>

          {/* Hover zoom effect hint */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            Click para leer más →
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#d4af37]/20 shadow-lg">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { key: "all", label: "TODAS" },
              { key: "updates", label: "ACTUALIZACIONES" },
              { key: "community", label: "COMUNIDAD" },
              { key: "diplomacy", label: "DIPLOMACIA" },
              { key: "events", label: "EVENTOS" },
            ].map((cat) => (
              <Button
                key={cat.key}
                variant={activeCategory === cat.key ? "default" : "ghost"}
                onClick={() => setActiveCategory(cat.key as NewsCategory)}
                className={`whitespace-nowrap ${
                  activeCategory === cat.key
                    ? "bg-[#d4af37] text-black hover:bg-[#f4cf5f]"
                    : "text-[#d4af37] hover:bg-[#d4af37]/10"
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <div
                  key={article.id}
                  className="group bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg overflow-hidden cursor-pointer hover:border-[#d4af37] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                  onClick={() => setSelectedArticle(article)}
                >
                  {/* Image with zoom hover effect */}
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Category icon badge */}
                    {article.tag && (
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#d4af37]">
                        {article.tag}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Category icon + name */}
                    <div className={`flex items-center gap-2 mb-2 text-sm ${getCategoryColor(article.category)}`}>
                      {getCategoryIcon(article.category)}
                      <span className="uppercase tracking-wide font-semibold">{article.category}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#d4af37] mb-2 line-clamp-2 group-hover:text-[#f4cf5f] transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{article.excerpt}</p>

                    {/* Footer: Date + Read time */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(article.date).toLocaleDateString("es-ES")}</span>
                      <span>📖 {article.readTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Últimos Cambios (Micro-logs) */}
            <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-4">
              <h3 className="text-lg font-bold text-[#d4af37] mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Últimos Cambios
              </h3>
              <div className="space-y-3">
                {microLogs.map((log, idx) => (
                  <div key={idx} className="border-l-2 border-[#d4af37]/30 pl-3">
                    <p className="text-xs text-gray-500 mb-1">{log.date}</p>
                    <p className="text-sm text-gray-300">{log.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendario de Eventos */}
            <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-4">
              <h3 className="text-lg font-bold text-[#d4af37] mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Eventos
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded text-xs font-bold">{evt.date}</div>
                    <p className="text-sm text-gray-300">{evt.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Online Players Stats */}
            <div className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30 rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#d4af37] mb-1">1,240</div>
                <div className="text-sm text-gray-400">Archimagos Online</div>
                <div className="mt-2 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4cf5f] w-3/4 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedArticle(null)
            }
          }}
        >
          <div className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="sticky top-4 right-4 float-right bg-[#d4af37] text-black p-2 rounded-full hover:bg-[#f4cf5f] transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Article hero image */}
            <div
              className="relative h-96 bg-cover bg-center"
              style={{ backgroundImage: `url('${selectedArticle.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
            </div>

            {/* Article content */}
            <div className="p-8">
              {/* Tag */}
              {selectedArticle.tag && (
                <div className="inline-block bg-[#d4af37] text-black px-3 py-1 rounded-full text-sm font-bold mb-4">
                  {selectedArticle.tag}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl font-serif font-bold text-[#d4af37] mb-4 leading-tight">
                {selectedArticle.title}
              </h1>

              {/* Meta info */}
              <div className="flex gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-[#d4af37]/20">
                <span>
                  {new Date(selectedArticle.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>Lectura: {selectedArticle.readTime} minutos</span>
              </div>

              {/* Excerpt */}
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-serif italic">{selectedArticle.excerpt}</p>

              {/* Full content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">{selectedArticle.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticiasPage
