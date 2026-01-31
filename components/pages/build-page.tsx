"use client"

/**
 * Build Page - Construct and upgrade buildings
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Castle, Coins, Mountain, Swords, Shield, Users, Sparkles } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface BuildPageProps {
  language: Language
}

export function BuildPage({ language }: BuildPageProps) {
  const t = useTranslation(language)

  const buildings = [
    {
      name: t.mageTower,
      description: t.mageTowerDesc,
      icon: Sparkles,
      cost: { gold: 1000, stone: 500 },
      turns: 5,
      color: "purple",
    },
    {
      name: t.goldMine,
      description: t.goldMineDesc,
      icon: Coins,
      cost: { gold: 500, stone: 300 },
      turns: 3,
      color: "yellow",
    },
    {
      name: t.barracks,
      description: t.barracksDesc,
      icon: Swords,
      cost: { gold: 800, stone: 600 },
      turns: 4,
      color: "red",
    },
    {
      name: t.wall,
      description: t.wallDesc,
      icon: Shield,
      cost: { gold: 1200, stone: 1000 },
      turns: 6,
      color: "blue",
    },
    {
      name: t.quarry,
      description: t.quarryDesc,
      icon: Mountain,
      cost: { gold: 600, stone: 200 },
      turns: 3,
      color: "gray",
    },
    {
      name: t.farm,
      description: t.farmDesc,
      icon: Users,
      cost: { gold: 400, stone: 300 },
      turns: 2,
      color: "green",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-[#d4af37]/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-2xl text-[#d4af37] flex items-center gap-2">
            <Castle className="h-6 w-6" />
            {t.buildingsTitle}
          </CardTitle>
          <CardDescription className="text-[#d4af37]/70">{t.buildingsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {buildings.map((building, index) => {
              const Icon = building.icon
              return (
                <Card key={index} className="border-[#d4af37]/20 bg-black/40">
                  <CardHeader>
                    <CardTitle className="text-[#d4af37] text-lg flex items-center gap-2">
                      <Icon className={`h-5 w-5 text-${building.color}-500`} />
                      {building.name}
                    </CardTitle>
                    <CardDescription className="text-[#d4af37]/60">{building.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-[#d4af37]/80">
                      <div className="flex justify-between mb-1">
                        <span>{t.cost}:</span>
                        <span>
                          {building.cost.gold} {t.gold}, {building.cost.stone} {t.stone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.buildTime}:</span>
                        <span>
                          {building.turns} {t.turns_unit}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-[#d4af37] text-black hover:bg-[#d4af37]/90">
                      {t.constructButton}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
