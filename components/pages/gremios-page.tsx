"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users, Crown, X, TrendingUp, Award } from "lucide-react"

interface GremiosPageProps {
  language: Language
}

interface Guild {
  id: number
  name: string
  leader: string
  members: number
  maxMembers: number
  networth: number
  alignment: string
  description: string
  bonus: string
}

export function GremiosPage({ language }: GremiosPageProps) {
  const t = useTranslation(language)
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null)
  const [showCreateGuild, setShowCreateGuild] = useState(false)
  const [tab, setTab] = useState<"top" | "myguild">("top")

  const guilds: Guild[] = []
  const myGuild = null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-[#d4af37]" />
          <h1 className="text-3xl font-bold text-[#d4af37]">{t.guilds}</h1>
        </div>
        <Button onClick={() => setShowCreateGuild(true)} className="bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
          <Crown className="mr-2 h-4 w-4" />
          {language === "es" ? "Crear Gremio" : "Create Guild"}
        </Button>
      </div>

      <p className="text-gray-400">
        {language === "es"
          ? "Únete o crea un gremio. Los gremios son la unidad política básica del juego."
          : "Join or create a guild. Guilds are the basic political unit of the game."}
      </p>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#d4af37]/20">
        <button
          onClick={() => setTab("top")}
          className={`px-6 py-3 font-semibold transition-colors ${
            tab === "top" ? "text-[#d4af37] border-b-2 border-[#d4af37]" : "text-gray-400 hover:text-[#d4af37]"
          }`}
        >
          {language === "es" ? "Mejores Gremios" : "Top Guilds"}
        </button>
        <button
          onClick={() => setTab("myguild")}
          className={`px-6 py-3 font-semibold transition-colors ${
            tab === "myguild" ? "text-[#d4af37] border-b-2 border-[#d4af37]" : "text-gray-400 hover:text-[#d4af37]"
          }`}
        >
          {language === "es" ? "Mi Gremio" : "My Guild"}
        </button>
      </div>

      {/* Top Guilds */}
      {tab === "top" && (
        <div className="space-y-3">
          {guilds.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {language === "es" ? "No hay gremios disponibles" : "No guilds available"}
            </div>
          ) : (
            guilds.map((guild, index) => (
              <Card
                key={guild.id}
                className="bg-[#1a1a1a] border-[#d4af37]/20 hover:border-[#d4af37]/50 cursor-pointer transition-all p-4"
                onClick={() => setSelectedGuild(guild)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#d4af37]/20 rounded-full">
                      <span className="text-2xl font-bold text-[#d4af37]">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-[#d4af37]">{guild.name}</h3>
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          {guild.alignment}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {language === "es" ? "Líder:" : "Leader:"} {guild.leader}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          {guild.members}/{guild.maxMembers} {language === "es" ? "miembros" : "members"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="h-3 w-3" />
                          {guild.networth.toLocaleString()} NW
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
                    {language === "es" ? "Solicitar" : "Request Join"}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* My Guild */}
      {tab === "myguild" && (
        <div className="space-y-4">
          <Card className="bg-[#1a1a1a] border-[#d4af37]/20 p-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                {language === "es" ? "No perteneces a ningún gremio" : "You don't belong to any guild"}
              </p>
              <Button onClick={() => setShowCreateGuild(true)} className="bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
                <Crown className="mr-2 h-4 w-4" />
                {language === "es" ? "Crear Gremio" : "Create Guild"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Guild Detail Modal */}
      {selectedGuild && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGuild(null)}
        >
          <Card
            className="bg-[#1a1a1a] border-[#d4af37] w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-[#d4af37]">{selectedGuild.name}</h2>
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                      {selectedGuild.alignment}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {language === "es" ? "Líder:" : "Leader:"} {selectedGuild.leader}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuild(null)}
                  className="text-gray-400 hover:text-[#d4af37] transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded p-4">
                <p className="text-gray-300">{selectedGuild.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded p-3 text-center">
                  <Users className="h-6 w-6 text-[#d4af37] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#d4af37]">
                    {selectedGuild.members}/{selectedGuild.maxMembers}
                  </p>
                  <p className="text-xs text-gray-500">{language === "es" ? "Miembros" : "Members"}</p>
                </div>
                <div className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded p-3 text-center">
                  <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">{selectedGuild.networth.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Networth</p>
                </div>
                <div className="bg-[#0f0f0f] border border-[#d4af37]/20 rounded p-3 text-center">
                  <Award className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-purple-400">{selectedGuild.bonus}</p>
                  <p className="text-xs text-gray-500">{language === "es" ? "Bonus" : "Bonus"}</p>
                </div>
              </div>

              <Button className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
                {language === "es" ? "Solicitar Unirse" : "Request to Join"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Create Guild Modal */}
      {showCreateGuild && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateGuild(false)}
        >
          <Card className="bg-[#1a1a1a] border-[#d4af37] w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#d4af37]">
                  {language === "es" ? "Crear Nuevo Gremio" : "Create New Guild"}
                </h2>
                <button
                  onClick={() => setShowCreateGuild(false)}
                  className="text-gray-400 hover:text-[#d4af37] transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <p className="text-sm text-blue-300">
                  {language === "es"
                    ? "Coste de creación: 50,000 de Oro y 10 Turnos"
                    : "Creation cost: 50,000 Gold and 10 Turns"}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#d4af37] mb-1">
                    {language === "es" ? "Nombre del Gremio:" : "Guild Name:"}
                  </label>
                  <Input
                    placeholder={language === "es" ? "Nombre del gremio" : "Guild name"}
                    className="bg-black/40 border-[#d4af37]/30 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d4af37] mb-1">
                    {language === "es" ? "Descripción:" : "Description:"}
                  </label>
                  <Textarea
                    placeholder={language === "es" ? "Describe tu gremio..." : "Describe your guild..."}
                    className="bg-black/40 border-[#d4af37]/30 text-white min-h-[100px]"
                  />
                </div>

                <Button className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
                  <Crown className="mr-2 h-4 w-4" />
                  {language === "es" ? "Fundar Gremio" : "Found Guild"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
