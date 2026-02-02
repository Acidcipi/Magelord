"use client"

import { type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { AlertCircle, Shield } from "lucide-react"

interface EmergencyAdminPageProps {
  language: Language
}

export function EmergencyAdminPage({ language }: EmergencyAdminPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <h1 className="text-3xl font-bold text-red-400">
          🚨 {language === "es" ? "Panel de Emergencia" : "Emergency Panel"}
        </h1>
      </div>
      <Card className="bg-red-500/10 border-red-500/30 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-red-400" />
            <h3 className="text-xl font-bold text-red-400">
              {language === "es" ? "Herramientas Críticas" : "Critical Tools"}
            </h3>
          </div>
          <ul className="text-[#d4af37]/70 space-y-2">
            <li>• {language === "es" ? "Reinicio de emergencia del servidor" : "Emergency server restart"}</li>
            <li>• {language === "es" ? "Rollback de base de datos" : "Database rollback"}</li>
            <li>• {language === "es" ? "Suspensión temporal del juego" : "Temporary game suspension"}</li>
            <li>• {language === "es" ? "Modo mantenimiento" : "Maintenance mode"}</li>
          </ul>
          <p className="text-yellow-400 font-semibold">
            {language === "es" 
              ? "⚠️ Sistema en desarrollo con protocolos de seguridad extremos"
              : "⚠️ System under development with extreme security protocols"}
          </p>
        </div>
      </Card>
    </div>
  )
}