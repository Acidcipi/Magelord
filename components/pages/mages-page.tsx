"use client"

/**
 * Mages Page - Train mages and manage spells
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2, Flame, Snowflake, Zap, Leaf, Sparkles } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface MagesPageProps {
  language: Language
}

export function MagesPage({ language }: MagesPageProps) {
  const t = useTranslation(language)

  const mages = [
    {
      name: t.fireMage,
      description: t.fireMageDesc,
      icon: Flame,
      cost: { gold: 800, mana: 200 },
      turns: 4,
      color: "text-red-500",
    },
    {
      name: t.iceMage,
      description: t.iceMageDesc,
      icon: Snowflake,
      cost: { gold: 800, mana: 200 },
      turns: 4,
      color: "text-cyan-500",
    },
    {
      name: t.lightningMage,
      description: t.lightningMageDesc,
      icon: Zap,
      cost: { gold: 900, mana: 250 },
      turns: 5,
      color: "text-yellow-500",
    },
    {
      name: t.natureMage,
      description: t.natureMageDesc,
      icon: Leaf,
      cost: { gold: 750, mana: 180 },
      turns: 3,
      color: "text-green-500",
    },
    {
      name: t.arcaneMage,
      description: t.arcaneMageDesc,
      icon: Sparkles,
      cost: { gold: 1000, mana: 300 },
      turns: 6,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-[#d4af37]/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-2xl text-[#d4af37] flex items-center gap-2">
            <Wand2 className="h-6 w-6" />
            {t.magesTitle}
          </CardTitle>
          <CardDescription className="text-[#d4af37]/70">{t.magesDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {mages.map((mage, index) => {
              const Icon = mage.icon
              return (
                <Card key={index} className="border-[#d4af37]/20 bg-black/40">
                  <CardHeader>
                    <CardTitle className={`text-lg flex items-center gap-2 ${mage.color}`}>
                      <Icon className="h-5 w-5" />
                      {mage.name}
                    </CardTitle>
                    <CardDescription className="text-[#d4af37]/60">{mage.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-[#d4af37]/80">
                      <div className="flex justify-between mb-1">
                        <span>{t.cost}:</span>
                        <span>
                          {mage.cost.gold} {t.gold}, {mage.cost.mana} {t.mana}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.buildTime}:</span>
                        <span>
                          {mage.turns} {t.turns_unit}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">{t.trainButton}</Button>
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
