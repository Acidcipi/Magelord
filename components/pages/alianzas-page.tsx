"use client"

import { useTranslation, type Language } from "@/lib/i18n"

interface AlianzasPageProps {
  language: Language
}

export function AlianzasPage({ language }: AlianzasPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.alliances}</h1>
      <p className="text-gray-400">Form strategic alliances with other provinces</p>

      <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#d4af37] mb-4">Your Alliances</h3>
        <p className="text-gray-500">You have no active alliances</p>
        <button className="mt-4 px-4 py-2 bg-[#d4af37] text-black rounded hover:bg-[#f4cf5f] font-semibold">
          Propose Alliance
        </button>
      </div>
    </div>
  )
}
