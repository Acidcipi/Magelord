"use client"

/**
 * Dashboard Component
 * Shows user's province information and resources after login
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Sparkles, Clock, Map, Users, Scale } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface DashboardProps {
  user: {
    id: number
    email: string
    username: string
    faction: string
    bio?: string
  }
  province: {
    id: number
    name: string
    gold: number
    mana: number
    turns: number
    land: number
    population: number
    alignment: string
  }
  language: Language
  onLogout: () => void
}

export function Dashboard({ user, province, language, onLogout }: DashboardProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-black">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-[#d4af37]">
                {t.dashboardTitle}: {user.username}
              </CardTitle>
              <CardDescription className="text-[#d4af37]/70">
                {t.province}: {province.name} | {t[user.faction as keyof typeof t] || user.faction}
              </CardDescription>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
            >
              {t.logout}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Resources Grid */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-[#d4af37]">{t.resources}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Gold */}
            <div className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-[#d4af37]">{t.gold}</h3>
              </div>
              <p className="text-2xl font-bold text-[#d4af37]">{province.gold.toLocaleString()}</p>
            </div>

            {/* Mana */}
            <div className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-[#d4af37]">{t.mana}</h3>
              </div>
              <p className="text-2xl font-bold text-[#d4af37]">{province.mana.toLocaleString()}</p>
            </div>

            {/* Turns */}
            <div className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-[#d4af37]">{t.turns}</h3>
              </div>
              <p className="text-2xl font-bold text-[#d4af37]">{province.turns}</p>
            </div>

            {/* Land */}
            <div className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Map className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-[#d4af37]">{t.land}</h3>
              </div>
              <p className="text-2xl font-bold text-[#d4af37]">{province.land.toLocaleString()}</p>
            </div>

            {/* Population */}
            <div className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-[#d4af37]">{t.population}</h3>
              </div>
              <p className="text-2xl font-bold text-[#d4af37]">{province.population.toLocaleString()}</p>
            </div>

            {/* Alignment */}
            <div className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-5 w-5 text-[#d4af37]" />
                <h3 className="font-semibold text-[#d4af37]">{t.alignment}</h3>
              </div>
              <p className="text-2xl font-bold text-[#d4af37] capitalize">{province.alignment}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Card (if exists) */}
      {user.bio && (
        <Card className="border-[#d4af37]/20 bg-black/60">
          <CardHeader>
            <CardTitle className="text-[#d4af37]">{t.bio}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#d4af37]/80">{user.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
