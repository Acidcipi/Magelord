"use client"
import { Github, MessageSquare, Twitter } from "lucide-react"
import type { Language } from "@/lib/i18n"

export function SocialPage({ language }: { language: Language }) {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center space-y-8">
      <h1 className="text-4xl font-bold text-[#d4af37]">Comunidad de Archimagos</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <a href="#" className="p-8 bg-indigo-900/20 border border-indigo-500/30 rounded-xl hover:bg-indigo-900/40 transition-all">
          <MessageSquare className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="font-bold text-white">Discord</h3>
          <p className="text-xs text-indigo-300/70">Coordinación de ataques y soporte rápido.</p>
        </a>
        <a href="#" className="p-8 bg-gray-900/20 border border-gray-500/30 rounded-xl hover:bg-gray-900/40 transition-all">
          <Github className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-bold text-white">GitHub</h3>
          <p className="text-xs text-gray-400/70">Reporte de bugs y contribuciones al código.</p>
        </a>
      </div>
    </div>
  )
}