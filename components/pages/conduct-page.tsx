"use client"
import { ShieldAlert, Users } from "lucide-react"
import type { Language } from "@/lib/i18n"

export function ConductPage({ language }: { language: Language }) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#0a0a0a] border border-red-500/30 rounded-lg">
      <h1 className="text-3xl font-bold text-red-400 mb-6 flex items-center gap-2 border-b border-red-500/20 pb-4">
        <ShieldAlert className="h-8 w-8" /> Códice de Conducta
      </h1>
      <div className="space-y-6 text-gray-300">
        <p>El Reino de MageLord se basa en la competencia justa. El incumplimiento de estas normas conlleva el exilio permanente.</p>
        <div className="bg-red-900/10 p-4 rounded border border-red-500/10">
          <h3 className="font-bold text-red-300 mb-2">I. Respeto al Rival</h3>
          <p className="text-sm">La guerra es técnica, no personal. Prohibido el acoso verbal o doxing.</p>
        </div>
        <div className="bg-red-900/10 p-4 rounded border border-red-500/10">
          <h3 className="font-bold text-red-300 mb-2">II. Integridad del Juego</h3>
          <p className="text-sm">Prohibido el uso de scripts de automatización o explotación de fallos en las fórmulas.</p>
        </div>
      </div>
    </div>
  )
}