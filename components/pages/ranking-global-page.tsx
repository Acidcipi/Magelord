"use client"

import { useTranslation, type Language } from "@/lib/i18n"

interface RankingGlobalPageProps {
  language: Language
}

export function RankingGlobalPage({ language }: RankingGlobalPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.globalRanking}</h1>
      <p className="text-gray-400">Global player rankings across all servers</p>

      <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#d4af37]/10 border-b border-[#d4af37]/20">
            <tr>
              <th className="p-3 text-left text-[#d4af37]">{t.rank}</th>
              <th className="p-3 text-left text-[#d4af37]">{t.player}</th>
              <th className="p-3 text-left text-[#d4af37]">Server</th>
              <th className="p-3 text-left text-[#d4af37]">{t.networth}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#d4af37]/10">
              <td className="p-3 text-yellow-400 font-bold">1</td>
              <td className="p-3 text-[#d4af37]">Supreme Overlord</td>
              <td className="p-3 text-gray-400">EU-1</td>
              <td className="p-3 text-gray-300">15,250,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
