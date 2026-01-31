"use client"

import { useTranslation, type Language } from "@/lib/i18n"

interface UsuariosAdminPageProps {
  language: Language
}

export function UsuariosAdminPage({ language }: UsuariosAdminPageProps) {
  const t = useTranslation(language)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#ff6348]">{t.users} - Admin Panel</h1>
      <p className="text-gray-400">Manage all user accounts</p>

      <div className="bg-[#1a1a1a] border border-[#ff6348]/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#ff6348]/10 border-b border-[#ff6348]/20">
            <tr>
              <th className="p-3 text-left text-[#ff6348]">ID</th>
              <th className="p-3 text-left text-[#ff6348]">Username</th>
              <th className="p-3 text-left text-[#ff6348]">Email</th>
              <th className="p-3 text-left text-[#ff6348]">Roles</th>
              <th className="p-3 text-left text-[#ff6348]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#ff6348]/10">
              <td className="p-3 text-gray-400">1</td>
              <td className="p-3 text-[#ff6348]">TestUser</td>
              <td className="p-3 text-gray-400">test@example.com</td>
              <td className="p-3 text-gray-400">player</td>
              <td className="p-3">
                <button className="px-3 py-1 bg-[#ff6348] text-black rounded text-sm hover:bg-[#ff6348]/80">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
