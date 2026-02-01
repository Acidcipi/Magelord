"use client"
import { Scroll, ShieldAlert } from "lucide-react"
import type { Language } from "@/lib/i18n"

export function TermsPage({ language }: { language: Language }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-8 bg-[#0f0f0f] border-2 border-[#d4af37]/30 rounded-xl text-gray-300">
      <div className="flex items-center gap-3 border-b border-[#d4af37]/20 pb-4">
        <Scroll className="h-8 w-8 text-[#d4af37]" />
        <h1 className="text-3xl font-bold text-[#d4af37]">Términos de Servicio</h1>
      </div>
      <div className="space-y-4">
        <section>
          <h2 className="text-[#d4af37] font-bold text-lg">1. Cuentas y Multicuenta</h2>
          <p className="text-sm">Está estrictamente prohibido poseer más de una cuenta por jugador. El uso de multicuentas para el beneficio de una principal resultará en el baneo permanente de IP.</p>
        </section>
        <section className="bg-red-900/10 p-4 border border-red-500/20 rounded">
          <h2 className="text-red-400 font-bold text-lg flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> 2. Automatización
          </h2>
          <p className="text-sm text-red-200/70">El uso de scripts, bots o cualquier software que automatice acciones (como el gasto de turnos) está prohibido y es detectado por el sistema de seguridad.</p>
        </section>
        <section>
          <h2 className="text-[#d4af37] font-bold text-lg">3. Transacciones P2P</h2>
          <p className="text-sm">El mercado global aplica un impuesto del 5% para prevenir el lavado de oro entre cuentas amigas.</p>
        </section>
      </div>
    </div>
  )
}