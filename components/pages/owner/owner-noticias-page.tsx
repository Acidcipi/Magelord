"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

interface OwnerNoticiasPageProps {
  language: Language
}

export function OwnerNoticiasPage({ language }: OwnerNoticiasPageProps) {
  const t = useTranslation(language)
  const [noticias, setNoticias] = useState([
    { id: 1, titulo: "Nueva actualización del juego", fecha: "2025-01-15", autor: "Admin" },
    { id: 2, titulo: "Mantenimiento programado", fecha: "2025-01-10", autor: "Admin" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#ff1744]">{t.manageNews}</h1>
        <Button className="bg-[#ff1744] text-white hover:bg-[#ff4569]">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Noticia
        </Button>
      </div>

      <div className="bg-[#1a1a1a] border border-[#ff1744]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#ff1744] mb-4">Noticias Publicadas</h3>
        <div className="space-y-3">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="flex justify-between items-center p-4 bg-[#0f0f0f] border border-[#ff1744]/10 rounded"
            >
              <div>
                <h4 className="text-[#d4af37] font-semibold">{noticia.titulo}</h4>
                <p className="text-gray-400 text-sm">
                  {noticia.fecha} • Por {noticia.autor}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-[#d4af37] text-[#d4af37] bg-transparent">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-red-500 text-red-500 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
