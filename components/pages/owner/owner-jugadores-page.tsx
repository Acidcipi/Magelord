"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Edit, Ban } from "lucide-react"

interface OwnerJugadoresPageProps {
  language: Language
}

export function OwnerJugadoresPage({ language }: OwnerJugadoresPageProps) {
  const t = useTranslation(language)

  const mockPlayers = [
    { id: 1, username: "DarkMage", email: "dark@example.com", faction: "infernal", status: "active", role: "player" },
    {
      id: 2,
      username: "LightKnight",
      email: "light@example.com",
      faction: "celestial",
      status: "active",
      role: "player",
    },
    { id: 3, username: "ShadowLord", email: "shadow@example.com", faction: "sangre", status: "banned", role: "player" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#ff1744]">{t.managePlayers}</h1>

      <div className="bg-[#1a1a1a] border border-[#ff1744]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#ff1744] mb-4">Tabla de Usuarios</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#ff1744]/20">
                <th className="text-left p-3 text-[#ff1744]">ID</th>
                <th className="text-left p-3 text-[#ff1744]">Usuario</th>
                <th className="text-left p-3 text-[#ff1744]">Email</th>
                <th className="text-left p-3 text-[#ff1744]">Facción</th>
                <th className="text-left p-3 text-[#ff1744]">Rol</th>
                <th className="text-left p-3 text-[#ff1744]">Estado</th>
                <th className="text-left p-3 text-[#ff1744]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockPlayers.map((player) => (
                <tr key={player.id} className="border-b border-[#d4af37]/10">
                  <td className="p-3 text-gray-400">{player.id}</td>
                  <td className="p-3 text-[#d4af37]">{player.username}</td>
                  <td className="p-3 text-gray-400">{player.email}</td>
                  <td className="p-3 text-[#d4af37]">{player.faction}</td>
                  <td className="p-3 text-gray-400">{player.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        player.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {player.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-[#d4af37] text-[#d4af37] bg-transparent">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500 bg-transparent">
                        <Ban className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
