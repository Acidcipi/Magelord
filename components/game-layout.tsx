"use client"

import type React from "react"

/**
 * Game Layout Component
 * Main layout for authenticated users with 25-50-25 structure:
 * - Left Sidebar (25%): Resources and stats
 * - Center Content (50%): Main game content
 * - Right Sidebar (25%): Quick actions
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Sparkles, Clock, Map, Users, Shield, Swords, Mountain } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface GameLayoutProps {
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
  children: React.ReactNode
}

export function GameLayout({ user, province, language, children }: GameLayoutProps) {
  const t = useTranslation(language)

  // Mock data for stone, defense, attack (would come from backend)
  const stone = 5000
  const defense = 150
  const attack = 80

  return (
    <div className="flex gap-4 p-4">
      {/* Left Sidebar - Resources (25%) */}
      <div className="w-1/4 space-y-4">
        <Card className="border-[#d4af37]/30 bg-black/80 sticky top-20">
          <CardHeader>
            <CardTitle className="text-[#d4af37] text-lg">{t.resources}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Gold */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="text-[#d4af37] font-medium">{t.gold}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{province.gold.toLocaleString()}</span>
            </div>

            {/* Stone */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-gray-500/20">
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-gray-500" />
                <span className="text-[#d4af37] font-medium">{t.stone}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{stone.toLocaleString()}</span>
            </div>

            {/* Mana */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-purple-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-[#d4af37] font-medium">{t.mana}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{province.mana.toLocaleString()}</span>
            </div>

            {/* Population */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-orange-500/20">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                <span className="text-[#d4af37] font-medium">{t.population}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{province.population.toLocaleString()}</span>
            </div>

            {/* Turns */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-blue-500/20">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-[#d4af37] font-medium">{t.turns}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{province.turns}/200</span>
            </div>

            {/* Land */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-green-500" />
                <span className="text-[#d4af37] font-medium">{t.land}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{province.land.toLocaleString()}</span>
            </div>

            {/* Defense */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-blue-400/20">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-[#d4af37] font-medium">{t.defense}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{defense}</span>
            </div>

            {/* Attack */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-red-500/20">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-red-500" />
                <span className="text-[#d4af37] font-medium">{t.attack}</span>
              </div>
              <span className="text-[#d4af37] font-bold">{attack}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center Content (50%) */}
      <div className="w-1/2">{children}</div>

      {/* Right Sidebar - Quick Actions (25%) */}
      <div className="w-1/4 space-y-4">
        <Card className="border-[#d4af37]/30 bg-black/80 sticky top-20">
          <CardHeader>
            <CardTitle className="text-[#d4af37] text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full bg-[#d4af37] text-black hover:bg-[#d4af37]/90">{t.constructButton}</Button>
            <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
              {t.trainButton} {t.mages}
            </Button>
            <Button className="w-full bg-red-600 text-white hover:bg-red-700">
              {t.recruitButton} {t.army}
            </Button>
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Quick Turn</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
