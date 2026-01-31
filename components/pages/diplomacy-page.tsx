"use client"

/**
 * Diplomacy Page - Rankings and alliances
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users2, Trophy } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface DiplomacyPageProps {
  language: Language
}

export function DiplomacyPage({ language }: DiplomacyPageProps) {
  const t = useTranslation(language)

  // Mock rankings data
  const rankings = [
    { rank: 1, player: "ArchMageSupreme", faction: "asuryan", networth: 150000 },
    { rank: 2, player: "DarkLord666", faction: "infernal", networth: 145000 },
    { rank: 3, player: "IceQueen", faction: "celestial", networth: 138000 },
    { rank: 4, player: "DragonKing", faction: "escama", networth: 125000 },
    { rank: 5, player: "NecroMaster", faction: "ultratumba", networth: 120000 },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-[#d4af37]/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-2xl text-[#d4af37] flex items-center gap-2">
            <Users2 className="h-6 w-6" />
            {t.diplomacyTitle}
          </CardTitle>
          <CardDescription className="text-[#d4af37]/70">{t.diplomacyDescription}</CardDescription>
        </CardHeader>
      </Card>

      {/* Rankings */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-xl text-[#d4af37] flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t.rankings}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rankings.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between p-3 rounded-lg border border-[#d4af37]/20 bg-black/40"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#d4af37] font-bold text-lg w-8">#{entry.rank}</span>
                  <div>
                    <p className="text-[#d4af37] font-medium">{entry.player}</p>
                    <p className="text-[#d4af37]/60 text-sm">{t[entry.faction as keyof typeof t]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#d4af37]/60 text-xs">{t.networth}</p>
                  <p className="text-[#d4af37] font-bold">{entry.networth.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alliances */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-xl text-[#d4af37]">{t.alliances}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#d4af37]/60 text-center py-8">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
