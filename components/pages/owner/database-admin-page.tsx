"use client"

import { type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Database, AlertTriangle } from "lucide-react"

interface DatabaseAdminPageProps {
  language: Language
}

export function DatabaseAdminPage({ language }: DatabaseAdminPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-cyan-400" />
        <h1 className="text-3xl font-bold text-cyan-400">
          {language === "es" ? "Gestión de Base de Datos" : "Database Management"}
        </h1>
      </div>
      <Card className="bg-red-500/10 border-red-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h3 className="text-xl font-bold text-red-400">
            {language === "es" ? "Acceso Crítico" : "Critical Access"}
          </h3>
        </div>
        <p className="text-[#d4af37]/70">
          {language === "es" 
            ? "Esta funcionalidad proporciona acceso directo a la base de datos. Sistema en desarrollo con protecciones de seguridad avanzadas."
            : "This functionality provides direct database access. System under development with advanced security protections."}
        </p>
      </Card>
    </div>
  )
}