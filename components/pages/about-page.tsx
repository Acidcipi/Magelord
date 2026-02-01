"use client"
import { Info, Shield, Target } from "lucide-react"
import type { Language } from "@/lib/i18n"

export function AboutPage({ language }: { language: Language }) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6 bg-black/40 border border-[#d4af37]/20 rounded-lg">
      <div className="flex items-center gap-4 border-b border-[#d4af37]/30 pb-4">
        <Info className="h-8 w-8 text-[#d4af37]" />
        <h1 className="text-3xl font-bold text-[#d4af37]">
          {language === "es" ? "Acerca de MageLord" : "About MageLord"}
        </h1>
      </div>
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          MageLord es un simulador de estrategia persistente MMO diseñado para Archimagos que buscan un desafío técnico y económico. 
          Aquí, cada turno cuenta y cada decisión estratégica tiene un impacto real en el ranking global.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gradient-to-br from-amber-900/20 to-black border border-[#d4af37]/30 rounded-lg">
            <Target className="h-6 w-6 text-[#d4af37] mb-2" />
            <h3 className="font-bold text-[#d4af37] mb-1">Mecánicas Hardcore</h3>
            <p className="text-sm">Gestión de recursos por hora, mantenimiento de tropas y conquistas territoriales basadas en Networth.</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-lg">
            <Shield className="h-6 w-6 text-blue-400 mb-2" />
            <h3 className="font-bold text-blue-400 mb-1">Seguridad Arcana</h3>
            <p className="text-sm">Protección de novatos durante 72h y sistemas anti-farming para garantizar una competición justa.</p>
          </div>
        </div>
      </div>
    </div>
  )
}