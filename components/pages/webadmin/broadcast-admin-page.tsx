"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

interface BroadcastAdminPageProps {
  language: Language
}

export function BroadcastAdminPage({ language }: BroadcastAdminPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#4ecdc4]">{t.broadcast} - Admin</h1>
      <p className="text-gray-400">Send messages to all players</p>

      <div className="bg-[#1a1a1a] border border-[#4ecdc4]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#4ecdc4] mb-4">Broadcast Message</h3>
        <div className="space-y-3">
          <textarea
            placeholder="Message to all players"
            rows={5}
            className="w-full p-2 bg-[#0f0f0f] border border-[#4ecdc4]/20 rounded text-[#4ecdc4]"
          />
          <Button className="bg-[#4ecdc4] text-black hover:bg-[#4ecdc4]/80">Send to All Players</Button>
        </div>
      </div>
    </div>
  )
}
