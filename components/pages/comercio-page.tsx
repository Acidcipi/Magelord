"use client"

import { useTranslation, type Language } from "@/lib/i18n"

interface ComercioPageProps {
  language: Language
}

export function ComercioPage({ language }: ComercioPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.trade}</h1>
      <p className="text-gray-400">Trade resources with other players and the market</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#d4af37] mb-4">Market Prices</h3>
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-[#0f0f0f] rounded">
              <span className="text-gray-400">Gold → Mana</span>
              <span className="text-[#d4af37]">1:2 ratio</span>
            </div>
            <div className="flex justify-between p-2 bg-[#0f0f0f] rounded">
              <span className="text-gray-400">Mana → Gold</span>
              <span className="text-purple-400">2:1 ratio</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#d4af37] mb-4">Active Trades</h3>
          <p className="text-gray-500 text-sm">No active trades</p>
        </div>
      </div>
    </div>
  )
}
