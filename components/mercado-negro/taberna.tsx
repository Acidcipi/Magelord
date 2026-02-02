"use client"

import { useState } from "react"
import { type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beer, User, Swords, AlertTriangle } from "lucide-react"

interface TabernaProps {
  language: Language
  province?: any
  user?: any
  gameState?: any
}

export function Taberna({ language, province, user, gameState }: TabernaProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Beer className="h-8 w-8 text-[#d4af37]" />
        <div>
          <h2 className="text-2xl font-bold text-[#d4af37]">
            {language === "es" ? "Taberna" : "Tavern"}
          </h2>
          <p className="text-sm text-gray-400">
            {language === "es"
              ? "Contrata mercenarios y espías para tus misiones"
              : "Hire mercenaries and spies for your missions"}
          </p>
        </div>
      </div>

      <Card className="bg-gray-900/50 border-2 border-yellow-500/30 p-12">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
          <h3 className="text-2xl font-bold text-yellow-500">
            {language === "es" ? "En Construcción" : "Under Construction"}
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {language === "es"
              ? "Esta sección estará disponible próximamente. Prepara tu oro y regresa pronto."
              : "This section will be available soon. Prepare your gold and return soon."}
          </p>
        </div>
      </Card>
    </div>
  )
}