"use client"

import { type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Flag, Check, X } from "lucide-react"

interface ForoReportesAdminPageProps {
  language: Language
}

export function ForoReportesAdminPage({ language }: ForoReportesAdminPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Flag className="h-8 w-8 text-yellow-400" />
        <h1 className="text-3xl font-bold text-yellow-400">
          {language === "es" ? "Reportes de Usuarios" : "User Reports"}
        </h1>
      </div>
      <Card className="bg-yellow-500/10 border-yellow-500/30 p-6">
        <p className="text-[#d4af37]/70">
          {language === "es" ? "Sistema de reportes en desarrollo" : "Report system under development"}
        </p>
      </Card>
    </div>
  )
}
