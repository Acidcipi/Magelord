"use client"

import { useTranslation, type Language } from "@/lib/i18n"

interface DefensasPageProps {
  language: Language
}

export function DefensasPage({ language }: DefensasPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.defenses}</h1>
      <p className="text-gray-400">Manage your defensive structures and troops</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Defense Rating</h3>
          <p className="text-5xl font-bold text-cyan-400">1,245</p>
          <p className="text-gray-500 text-sm mt-2">+12% from walls and towers</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#d4af37] mb-4">Garrison Troops</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Spearmen:</span>
              <span className="text-[#d4af37]">450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Archers:</span>
              <span className="text-[#d4af37]">320</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
