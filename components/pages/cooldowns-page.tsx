"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Clock, Zap, Target, Skull } from "lucide-react"

interface CooldownsPageProps {
  language: Language
}

export function CooldownsPage({ language }: CooldownsPageProps) {
  const t = useTranslation(language)

  const ACTIVE_COOLDOWNS = [
    {
      id: "apocalypse",
      name: language === "es" ? "Apocalipsis" : "Apocalypse",
      category: language === "es" ? "Hechizo de Élite" : "Elite Spell",
      timeRemaining: "04:20:15",
      icon: <Skull className="h-6 w-6" />,
      color: "text-red-400",
      bgColor: "from-red-900/20 to-black",
    },
    {
      id: "gold-theft",
      name: language === "es" ? "Robo de Oro" : "Gold Theft",
      category: language === "es" ? "Sabotaje" : "Sabotage",
      timeRemaining: "00:15:23",
      icon: <Target className="h-6 w-6" />,
      color: "text-yellow-400",
      bgColor: "from-yellow-900/20 to-black",
    },
    {
      id: "imp-summon",
      name: language === "es" ? "Invocación de Diablillos" : "Imp Summoning",
      category: language === "es" ? "Habilidad Especial" : "Special Ability",
      timeRemaining: "01:45:00",
      icon: <Zap className="h-6 w-6" />,
      color: "text-purple-400",
      bgColor: "from-purple-900/20 to-black",
    },
  ]

  const AVAILABLE_SOON = [
    {
      id: "blood-ritual",
      name: language === "es" ? "Ritual de Sangre" : "Blood Ritual",
      category: language === "es" ? "Hechizo de Élite" : "Elite Spell",
      timeRemaining: "00:05:42",
      icon: <Skull className="h-6 w-6" />,
      color: "text-green-400",
      bgColor: "from-green-900/20 to-black",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">
        {language === "es" ? "Cooldowns Activos" : "Active Cooldowns"}
      </h1>
      <p className="text-gray-400">
        {language === "es"
          ? "Panel de monitorización de habilidades en tiempo de recarga. Ciertas acciones críticas tienen un tiempo de espera obligatorio antes de poder ser ejecutadas nuevamente."
          : "Monitoring panel for abilities on cooldown. Certain critical actions have mandatory waiting periods before they can be executed again."}
      </p>

      {/* Active Cooldowns Section */}
      <div>
        <h2 className="text-xl font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {language === "es" ? "En Recarga" : "On Cooldown"}
        </h2>
        <div className="space-y-3">
          {ACTIVE_COOLDOWNS.map((cooldown) => (
            <Card
              key={cooldown.id}
              className={`bg-gradient-to-r ${cooldown.bgColor} border border-[#d4af37]/20 p-4 hover:border-[#d4af37]/40 transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cooldown.color}>{cooldown.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-[#d4af37]">{cooldown.name}</h3>
                    <p className="text-sm text-gray-400">{cooldown.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-orange-400">{cooldown.timeRemaining}</p>
                  <p className="text-xs text-gray-500">{language === "es" ? "Tiempo restante" : "Time remaining"}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Soon Section */}
      <div>
        <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {language === "es" ? "Disponible Pronto" : "Available Soon"}
        </h2>
        <div className="space-y-3">
          {AVAILABLE_SOON.map((cooldown) => (
            <Card
              key={cooldown.id}
              className={`bg-gradient-to-r ${cooldown.bgColor} border-2 border-green-500/50 p-4 animate-pulse`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cooldown.color}>{cooldown.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-[#d4af37]">{cooldown.name}</h3>
                    <p className="text-sm text-gray-400">{cooldown.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-green-400">{cooldown.timeRemaining}</p>
                  <p className="text-xs text-green-500">⚡ {language === "es" ? "¡Casi listo!" : "Almost ready!"}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-6">
        <h3 className="text-lg font-semibold text-[#d4af37] mb-3">
          {language === "es" ? "¿Cómo funcionan los Cooldowns?" : "How do Cooldowns work?"}
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            <span className="text-cyan-400 font-bold">
              {language === "es" ? "Hechizos de Élite:" : "Elite Spells:"}
            </span>{" "}
            {language === "es"
              ? "Los hechizos más poderosos requieren tiempo de recarga extenso (4-12 horas)."
              : "The most powerful spells require extensive cooldown time (4-12 hours)."}
          </p>
          <p>
            <span className="text-cyan-400 font-bold">{language === "es" ? "Sabotaje:" : "Sabotage:"}</span>{" "}
            {language === "es"
              ? "Acciones de espionaje y robo tienen cooldowns cortos (15-30 min)."
              : "Espionage and theft actions have short cooldowns (15-30 min)."}
          </p>
          <p>
            <span className="text-cyan-400 font-bold">
              {language === "es" ? "Habilidades Especiales:" : "Special Abilities:"}
            </span>{" "}
            {language === "es"
              ? "Habilidades únicas de tropas o artefactos tienen cooldowns variables."
              : "Unique abilities from troops or artifacts have variable cooldowns."}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          💡{" "}
          {language === "es"
            ? "Recibirás una notificación cuando un cooldown importante llegue a cero."
            : "You'll receive a notification when an important cooldown reaches zero."}
        </p>
      </Card>
    </div>
  )
}
