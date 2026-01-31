"use client"

/**
 * Army Page - Recruit and manage troops
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swords, Target, Shield, Home as Horse, Bot } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface ArmyPageProps {
  language: Language
}

export function ArmyPage({ language }: ArmyPageProps) {
  const t = useTranslation(language)

  const troops = [
    {
      name: t.archer,
      description: t.archerDesc,
      icon: Target,
      cost: { gold: 100, population: 1 },
      turns: 1,
      attack: 15,
      defense: 5,
      color: "text-green-500",
    },
    {
      name: t.spearman,
      description: t.spearmanDesc,
      icon: Shield,
      cost: { gold: 150, population: 1 },
      turns: 1,
      attack: 10,
      defense: 15,
      color: "text-blue-500",
    },
    {
      name: t.knight,
      description: t.knightDesc,
      icon: Horse,
      cost: { gold: 500, population: 2 },
      turns: 3,
      attack: 30,
      defense: 25,
      color: "text-yellow-500",
    },
    {
      name: t.golem,
      description: t.golemDesc,
      icon: Bot,
      cost: { gold: 800, mana: 100 },
      turns: 4,
      attack: 40,
      defense: 35,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-[#d4af37]/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-2xl text-[#d4af37] flex items-center gap-2">
            <Swords className="h-6 w-6" />
            {t.armyTitle}
          </CardTitle>
          <CardDescription className="text-[#d4af37]/70">{t.armyDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {troops.map((troop, index) => {
              const Icon = troop.icon
              return (
                <Card key={index} className="border-[#d4af37]/20 bg-black/40">
                  <CardHeader>
                    <CardTitle className={`text-lg flex items-center gap-2 ${troop.color}`}>
                      <Icon className="h-5 w-5" />
                      {troop.name}
                    </CardTitle>
                    <CardDescription className="text-[#d4af37]/60">{troop.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-[#d4af37]/80 space-y-1">
                      <div className="flex justify-between">
                        <span>{t.cost}:</span>
                        <span>
                          {troop.cost.gold} {t.gold}
                          {"mana" in troop.cost && `, ${troop.cost.mana} ${t.mana}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.attack}:</span>
                        <span className="text-red-400">{troop.attack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.defense}:</span>
                        <span className="text-blue-400">{troop.defense}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.buildTime}:</span>
                        <span>
                          {troop.turns} {t.turns_unit}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700">{t.recruitButton}</Button>
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
