"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Megaphone } from "lucide-react"
import { useState } from "react"

interface OwnerAnunciosPageProps {
  language: Language
}

export function OwnerAnunciosPage({ language }: OwnerAnunciosPageProps) {
  const t = useTranslation(language)
  const [message, setMessage] = useState("")

  const handleBroadcast = () => {
    alert("Anuncio global enviado a todos los jugadores!")
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#ff1744]">{t.globalAnnouncements}</h1>

      <div className="bg-[#1a1a1a] border border-[#ff1744]/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Megaphone className="h-8 w-8 text-[#ff1744]" />
          <h3 className="text-xl font-semibold text-[#ff1744]">Enviar Anuncio Global</h3>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu anuncio aquí..."
          className="w-full h-32 p-3 bg-[#0f0f0f] border border-[#ff1744]/20 rounded text-[#d4af37] resize-none"
        />
        <Button onClick={handleBroadcast} className="mt-3 bg-[#ff1744] text-white hover:bg-[#ff4569]">
          Enviar a Todos los Jugadores
        </Button>
      </div>

      <div className="bg-[#1a1a1a] border border-[#ff1744]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#ff1744] mb-4">Historial de Anuncios</h3>
        <div className="space-y-3">
          {[
            { texto: "¡Bienvenidos al nuevo servidor!", fecha: "2025-01-15 10:30" },
            { texto: "Mantenimiento completado", fecha: "2025-01-10 18:00" },
          ].map((anuncio, i) => (
            <div key={i} className="p-4 bg-[#0f0f0f] border border-[#ff1744]/10 rounded">
              <p className="text-[#d4af37]">{anuncio.texto}</p>
              <p className="text-gray-400 text-sm mt-1">{anuncio.fecha}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
