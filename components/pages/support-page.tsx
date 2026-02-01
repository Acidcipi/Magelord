"use client"
import { Mail, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Language } from "@/lib/i18n"

export function SupportPage({ language }: { language: Language }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-black/40 border border-[#d4af37]/20 rounded-lg text-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#d4af37] mb-2">Soporte Técnico</h1>
        <p className="text-gray-400">¿Problemas con tus rituales o transacciones? Estamos aquí para ayudarte.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-lg flex flex-col items-center text-center">
          <Mail className="h-10 w-10 text-[#d4af37] mb-4" />
          <h3 className="font-bold mb-2">Correo Directo</h3>
          <p className="text-sm text-gray-400 mb-4">Respuesta técnica en 24-48 horas.</p>
          <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 w-full">
            support@magelord.com
          </Button>
        </div>
        <div className="p-6 bg-[#1a1a1a] border border-indigo-500/30 rounded-lg flex flex-col items-center text-center">
          <MessageSquare className="h-10 w-10 text-indigo-400 mb-4" />
          <h3 className="font-bold mb-2">Discord Community</h3>
          <p className="text-sm text-gray-400 mb-4">Resolución inmediata por moderadores y la comunidad.</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">Unirse al Discord</Button>
        </div>
      </div>
    </div>
  )
}