"use client"

import { useTranslation, type Language } from "@/lib/i18n"

interface LogsAdminPageProps {
  language: Language
}

export function LogsAdminPage({ language }: LogsAdminPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#ff6348]">{t.logs} - Admin Panel</h1>
      <p className="text-gray-400">View system and admin action logs</p>

      <div className="bg-[#1a1a1a] border border-[#ff6348]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#ff6348] mb-4">Recent Admin Actions</h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="p-2 bg-[#0f0f0f] border border-[#ff6348]/10 rounded text-gray-400">
            [2025-01-01 14:32:15] Admin 'SuperAdmin' banned user 'Cheater123'
          </div>
          <div className="p-2 bg-[#0f0f0f] border border-[#ff6348]/10 rounded text-gray-400">
            [2025-01-01 12:15:42] Admin 'SuperAdmin' assigned role 'forum_admin' to 'ModUser'
          </div>
        </div>
      </div>
    </div>
  )
}
