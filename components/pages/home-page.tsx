"use client"

/**
 * Home Page - Main dashboard after login
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface HomePageProps {
  user: {
    id: number
    username: string
    faction: string
  }
  province: {
    name: string
    alignment: string
  }
  language: Language
}

export function HomePage({ user, province, language }: HomePageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-4">
      <Card className="border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-black">
        <CardHeader>
          <CardTitle className="text-2xl text-[#d4af37]">{province.name}</CardTitle>
          <CardDescription className="text-[#d4af37]/70">
            {t[user.faction as keyof typeof t] || user.faction} | {province.alignment}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-[#d4af37]">{t.home}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-[#d4af37]/20 bg-black/40">
              <h3 className="font-bold text-[#d4af37] mb-2">{t.buildTitle}</h3>
              <p className="text-[#d4af37]/70 text-sm">{t.buildDescription}</p>
            </div>
            <div className="p-4 rounded-lg border border-[#d4af37]/20 bg-black/40">
              <h3 className="font-bold text-[#d4af37] mb-2">{t.magicTitle}</h3>
              <p className="text-[#d4af37]/70 text-sm">{t.magicDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
