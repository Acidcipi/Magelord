"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

interface FixesAdminPageProps {
  language: Language
}

export function FixesAdminPage({ language }: FixesAdminPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#4ecdc4]">{t.fixes} - Admin</h1>
      <p className="text-gray-400">Apply fixes and adjustments to player accounts</p>

      <div className="bg-[#1a1a1a] border border-[#4ecdc4]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#4ecdc4] mb-4">Reset Turns</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Player username"
            className="w-full p-2 bg-[#0f0f0f] border border-[#4ecdc4]/20 rounded text-[#4ecdc4]"
          />
          <input
            type="number"
            placeholder="New turn count"
            className="w-full p-2 bg-[#0f0f0f] border border-[#4ecdc4]/20 rounded text-[#4ecdc4]"
          />
          <Button className="bg-[#4ecdc4] text-black hover:bg-[#4ecdc4]/80">Apply Fix</Button>
        </div>
      </div>
    </div>
  )
}
