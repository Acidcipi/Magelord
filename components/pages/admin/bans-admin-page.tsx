"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

interface BansAdminPageProps {
  language: Language
}

export function BansAdminPage({ language }: BansAdminPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#ff6348]">{t.bans} - Admin Panel</h1>
      <p className="text-gray-400">Ban or suspend user accounts</p>

      <div className="bg-[#1a1a1a] border border-[#ff6348]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#ff6348] mb-4">Ban User</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 bg-[#0f0f0f] border border-[#ff6348]/20 rounded text-[#ff6348]"
          />
          <input
            type="text"
            placeholder="Reason"
            className="w-full p-2 bg-[#0f0f0f] border border-[#ff6348]/20 rounded text-[#ff6348]"
          />
          <select className="w-full p-2 bg-[#0f0f0f] border border-[#ff6348]/20 rounded text-[#ff6348]">
            <option>Permanent Ban</option>
            <option>7 Days Suspension</option>
            <option>30 Days Suspension</option>
          </select>
          <Button className="bg-red-600 hover:bg-red-700">Ban User</Button>
        </div>
      </div>
    </div>
  )
}
