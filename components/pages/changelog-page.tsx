"use client"
import { FileText, Zap } from "lucide-react"
import type { Language } from "@/lib/i18n"

export function ChangelogPage({ language }: { language: Language }) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-black/40 border border-[#d4af37]/20 rounded-lg">
      <h1 className="text-3xl font-bold text-[#d4af37] mb-6 flex items-center gap-2 border-b border-[#d4af37]/30 pb-3">
        <FileText className="h-8 w-8" /> Historial de Cambios (v0.8.4-Alpha)
      </h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-green-400 mb-4">✨ Novedades</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Sistema de Gremios con bonos de sinergia por facción.</li>
            <li>• Mercado Negro con subastas en tiempo real de artefactos.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-blue-400 mb-4">🔧 Mejoras Técnicas</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Optimización de la regeneración de turnos a ciclos de 15 minutos.</li>
            <li>• Implementación de suscripciones Realtime para tropas y recursos.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}