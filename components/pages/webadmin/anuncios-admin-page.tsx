"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

interface AnunciosAdminPageProps {
  language: Language
}

export function AnunciosAdminPage({ language }: AnunciosAdminPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#4ecdc4]">{t.announcements} - Admin</h1>
      <p className="text-gray-400">Create game-wide announcements</p>

      <div className="bg-[#1a1a1a] border border-[#4ecdc4]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#4ecdc4] mb-4">New Announcement</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Announcement message"
            className="w-full p-2 bg-[#0f0f0f] border border-[#4ecdc4]/20 rounded text-[#4ecdc4]"
          />
          <select className="w-full p-2 bg-[#0f0f0f] border border-[#4ecdc4]/20 rounded text-[#4ecdc4]">
            <option>Priority: Normal</option>
            <option>Priority: High</option>
            <option>Priority: Critical</option>
          </select>
          <Button className="bg-[#4ecdc4] text-black hover:bg-[#4ecdc4]/80">Send Announcement</Button>
        </div>
      </div>
    </div>
  )
}
