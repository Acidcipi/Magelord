"use client"

import { type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { UserX } from "lucide-react"

interface ForoBansAdminPageProps {
  language: Language
}

export function ForoBansAdminPage({ language }: ForoBansAdminPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <UserX className="h-8 w-8 text-red-400" />
        <h1 className="text-3xl font-bold text-red-400">
          {language === "es" ? "Baneos del Foro" : "Forum Bans"}
        </h1>
      </div>
      <Card className="bg-red-500/10 border-red-500/30 p-6">
        <p className="text-[#d4af37]/70">
          {language === "es" ? "Sistema de baneos del foro en desarrollo" : "Forum ban system under development"}
        </p>
      </Card>
    </div>
  )
}