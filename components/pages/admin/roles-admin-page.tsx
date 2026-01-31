"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

interface RolesAdminPageProps {
  language: Language
}

export function RolesAdminPage({ language }: RolesAdminPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#ff6348]">{t.roles} - Admin Panel</h1>
      <p className="text-gray-400">Manage user roles and permissions</p>

      <div className="bg-[#1a1a1a] border border-[#ff6348]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#ff6348] mb-4">Assign Role</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 bg-[#0f0f0f] border border-[#ff6348]/20 rounded text-[#ff6348]"
          />
          <select className="w-full p-2 bg-[#0f0f0f] border border-[#ff6348]/20 rounded text-[#ff6348]">
            <option>player</option>
            <option>forum_admin</option>
            <option>web_admin</option>
            <option>admin</option>
            <option>owner</option>
          </select>
          <Button className="bg-[#ff6348] text-black hover:bg-[#ff6348]/80">Assign Role</Button>
        </div>
      </div>
    </div>
  )
}
