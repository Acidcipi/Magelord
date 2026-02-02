"use client"

import { type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"

interface ForoLogsAdminPageProps {
  language: Language
}

export function ForoLogsAdminPage({ language }: ForoLogsAdminPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Eye className="h-8 w-8 text-gray-400" />
        <h1 className="text-3xl font-bold text-gray-400">
          {language === "es" ? "Logs de Moderación" : "Moderation Logs"}
        </h1>
      </div>
      <Card className="bg-gray-500/10 border-gray-500/30 p-6">
        <p className="text-[#d4af37]/70">
          {language === "es" ? "Logs de moderación en desarrollo" : "Moderation logs under development"}
        </p>
      </Card>
    </div>
  )
}