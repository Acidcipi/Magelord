"use client"

/**
 * perfil-page.tsx
 * Sistema de Identidad del Archimago con 3 niveles:
 * 1. Perfil Privado (Configuración de Cuenta)
 * 2. Perfil Público (La Provincia)
 * 3. Ranking Personal (Estadísticas de Carrera)
 */

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import {
  User,
  Shield,
  Mail,
  Lock,
  Globe,
  Palette,
  Bell,
  Castle,
  Sword,
  Crown,
  Award,
  TrendingUp,
  Users,
  Trophy,
  MapPin,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PerfilPageProps {
  language?: Language
  user?: any
  gameState?: any
}

export function PerfilPage({ language = "es", user, gameState }: PerfilPageProps) {
  const t = useTranslation(language)
  const [activeTab, setActiveTab] = useState<"privado" | "publico" | "ranking">("publico")
  const [email] = useState(user?.email || "archimago@magelord.com")
  const [username] = useState(user?.username || "Cipi")
  const [role] = useState<string>(user?.role || "player")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [selectedTheme, setSelectedTheme] = useState("dark-infernal")
  const [lema, setLema] = useState("La oscuridad es mi aliada")

  const userData = {
    faction: gameState?.faction || "Sin Facción",
    class: gameState?.class || "Sin Clase",
    alignment: gameState?.alignment || "Neutral",
    networth: gameState?.networth || 0,
    militaryPower: gameState?.population_military || 0,
    acres: gameState?.land || 0,
    guild: "Sin Gremio", // TODO: Implement guild system
    title: "Novato", // TODO: Implement title system based on networth/achievements
    achievements: [],
  }

  const historicalRecords = {
    maxNetworth: 2500000,
    maxLandConquest: 1200,
    totalKills: 47,
    totalWins: 134,
    totalLosses: 28,
    winRate: 82.7,
  }

  const reputationLevel = {
    honor: 85,
    status: "Honorable",
    color: "text-green-500",
  }

  const roleLabels: Record<string, string> = {
    player: "Jugador",
    forum_admin: "Administrador de Foro",
    web_admin: "Administrador Web",
    admin: "Administrador",
    owner: "Propietario",
  }

  const roleColors: Record<string, string> = {
    player: "bg-gray-600",
    forum_admin: "bg-blue-600",
    web_admin: "bg-green-600",
    admin: "bg-purple-600",
    owner: "bg-red-600",
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-[#d4af37] flex items-center gap-3">
          <User className="h-10 w-10" />
          Identidad del Archimago
        </h1>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#d4af37]/20 pb-2">
          <button
            onClick={() => setActiveTab("publico")}
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
              activeTab === "publico"
                ? "bg-[#d4af37]/20 text-[#d4af37] border-b-2 border-[#d4af37]"
                : "text-[#d4af37]/60 hover:text-[#d4af37]/90"
            }`}
          >
            <Castle className="inline h-5 w-5 mr-2" />
            Perfil Público
          </button>
          <button
            onClick={() => setActiveTab("privado")}
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
              activeTab === "privado"
                ? "bg-[#d4af37]/20 text-[#d4af37] border-b-2 border-[#d4af37]"
                : "text-[#d4af37]/60 hover:text-[#d4af37]/90"
            }`}
          >
            <Shield className="inline h-5 w-5 mr-2" />
            Configuración Privada
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
              activeTab === "ranking"
                ? "bg-[#d4af37]/20 text-[#d4af37] border-b-2 border-[#d4af37]"
                : "text-[#d4af37]/60 hover:text-[#d4af37]/90"
            }`}
          >
            <TrendingUp className="inline h-5 w-5 mr-2" />
            Ranking Personal
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "publico" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Capa Estética */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-black border-[#d4af37]/30 p-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Capa Estética
            </h2>

            <div className="space-y-4">
              {/* Avatar con Marco */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-red-500 p-1">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Crown className="h-16 w-16 text-[#d4af37]" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-900 px-3 py-1 rounded-full text-xs font-bold text-[#d4af37] border border-[#d4af37]/50">
                    {userData.title}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#d4af37]">{username}</h3>
                <p className="text-sm italic text-[#d4af37]/70">{lema}</p>
              </div>

              {/* Slots Cosméticos */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-black/40 rounded border border-[#d4af37]/20">
                  <p className="text-xs text-[#d4af37]/60 mb-1">Slot Marco</p>
                  <p className="text-sm text-[#d4af37]">Marco Infernal</p>
                </div>
                <div className="p-3 bg-black/40 rounded border border-[#d4af37]/20">
                  <p className="text-xs text-[#d4af37]/60 mb-1">Slot Estandarte</p>
                  <p className="text-sm text-[#d4af37]">Banner Legiones</p>
                </div>
              </div>

              <Button className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f]">
                <Palette className="mr-2 h-4 w-4" />
                Personalizar Apariencia
              </Button>
            </div>
          </Card>

          {/* Ficha de Poder */}
          <Card className="bg-gradient-to-br from-red-900/20 to-black border-[#d4af37]/30 p-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <Sword className="h-6 w-6" />
              Ficha de Poder
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <span className="text-[#d4af37]/70">Facción:</span>
                <span className="text-[#d4af37] font-semibold">{userData.faction}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <span className="text-[#d4af37]/70">Clase:</span>
                <span className="text-[#d4af37] font-semibold">{userData.class}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <span className="text-[#d4af37]/70">Alineamiento:</span>
                <span className="text-[#d4af37] font-semibold">{userData.alignment}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <span className="text-[#d4af37]/70 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Networth:
                </span>
                <span className="text-[#d4af37] font-bold">{userData.networth.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <span className="text-[#d4af37]/70 flex items-center gap-2">
                  <Sword className="h-4 w-4" />
                  Poder Militar:
                </span>
                <span className="text-[#d4af37] font-bold">{userData.militaryPower.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <span className="text-[#d4af37]/70 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Acres:
                </span>
                <span className="text-[#d4af37] font-bold">{userData.acres.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <span className="text-[#d4af37]/70 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gremio:
                </span>
                <span className="text-purple-400 font-bold">{userData.guild}</span>
              </div>
            </div>
          </Card>

          {/* Medallero */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-[#d4af37]/30 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <Award className="h-6 w-6" />
              Medallero de Logros
            </h2>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {userData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg text-center border-2 ${
                    achievement.rarity === "legendary"
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
                      : achievement.rarity === "epic"
                        ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50"
                        : "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50"
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <p className="text-xs text-[#d4af37]">{achievement.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "privado" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Identidad Base */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-black border-[#d4af37]/30 p-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <User className="h-6 w-6" />
              Identidad Base
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#d4af37]/70 mb-1 block">Rango de Cuenta</label>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                    roleColors[role]
                  } text-white font-semibold`}
                >
                  <Shield className="h-5 w-5" />
                  {roleLabels[role] || role}
                </div>
                <p className="text-xs text-[#d4af37]/50 mt-1">Este campo es asignado por los administradores</p>
              </div>

              <div>
                <label className="text-sm text-[#d4af37]/70 mb-1 block">Email</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="flex-1 p-2 bg-black/60 border border-[#d4af37]/30 rounded text-[#d4af37]/70 cursor-not-allowed"
                  />
                  <Mail className="h-5 w-5 text-[#d4af37]/50" />
                </div>
                <p className="text-xs text-[#d4af37]/50 mt-1">Solo los administradores pueden modificar este campo</p>
              </div>

              <div>
                <label className="text-sm text-[#d4af37]/70 mb-1 block">Nombre de Usuario</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={username}
                    readOnly
                    disabled
                    className="flex-1 p-2 bg-black/60 border border-[#d4af37]/30 rounded text-[#d4af37]/70 cursor-not-allowed"
                  />
                  <User className="h-5 w-5 text-[#d4af37]/50" />
                </div>
                <p className="text-xs text-[#d4af37]/50 mt-1">Solo los administradores pueden modificar este campo</p>
              </div>

              <div className="pt-4 border-t border-[#d4af37]/20">
                <h3 className="text-lg font-bold text-[#d4af37] mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Cambiar Contraseña
                </h3>

                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Contraseña Actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 bg-black/40 border border-[#d4af37]/30 rounded text-[#d4af37]"
                  />
                  <input
                    type="password"
                    placeholder="Nueva Contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 bg-black/40 border border-[#d4af37]/30 rounded text-[#d4af37]"
                  />
                  <Button className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f]">Actualizar Contraseña</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferencias de Interfaz */}
          <Card className="bg-gradient-to-br from-green-900/20 to-black border-[#d4af37]/30 p-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Preferencias de Interfaz
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#d4af37]/70 mb-2 block flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Idioma
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="w-full p-2 bg-black/40 border border-[#d4af37]/30 rounded text-[#d4af37]"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-[#d4af37]/70 mb-2 block flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Tema Visual
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full p-2 bg-black/40 border border-[#d4af37]/30 rounded text-[#d4af37]"
                >
                  <option value="dark-infernal">Oscuro Profundo</option>
                  <option value="blood-infernal">Sangre Infernal</option>
                  <option value="golden-divine">Dorado Divino</option>
                  <option value="ice-mystic">Hielo Místico</option>
                </select>
              </div>

              <Button className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f]">Guardar Preferencias</Button>
            </div>
          </Card>

          {/* Centro de Alertas */}
          <Card className="bg-gradient-to-br from-orange-900/20 to-black border-[#d4af37]/30 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Centro de Alertas y Notificaciones
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-black/40 rounded cursor-pointer hover:bg-black/60 transition-colors">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-[#d4af37]">Ataques recibidos</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-black/40 rounded cursor-pointer hover:bg-black/60 transition-colors">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-[#d4af37]">Finalización de Rituales</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-black/40 rounded cursor-pointer hover:bg-black/60 transition-colors">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-[#d4af37]">Mensajes de Gremio</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-black/40 rounded cursor-pointer hover:bg-black/60 transition-colors">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-[#d4af37]">Subastas superadas (Mercado Negro)</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-black/40 rounded cursor-pointer hover:bg-black/60 transition-colors">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-[#d4af37]">Recursos al límite</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-black/40 rounded cursor-pointer hover:bg-black/60 transition-colors">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-[#d4af37]">Actualizaciones del juego</span>
              </label>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "ranking" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Récords Históricos */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-[#d4af37]/30 p-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Récords Históricos
            </h2>

            <div className="space-y-3">
              <div className="p-3 bg-black/40 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-[#d4af37]/70 text-sm">Máximo Networth Alcanzado</span>
                  <span className="text-[#d4af37] font-bold text-lg">
                    {historicalRecords.maxNetworth.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-[#d4af37]/70 text-sm">Mayor Conquista de Tierra</span>
                  <span className="text-[#d4af37] font-bold text-lg">{historicalRecords.maxLandConquest} acres</span>
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-[#d4af37]/70 text-sm">Total de Enemigos Derrotados</span>
                  <span className="text-red-500 font-bold text-lg">{historicalRecords.totalKills}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/40 rounded">
                  <p className="text-[#d4af37]/70 text-xs mb-1">Victorias</p>
                  <p className="text-green-500 font-bold text-2xl">{historicalRecords.totalWins}</p>
                </div>

                <div className="p-3 bg-black/40 rounded">
                  <p className="text-[#d4af37]/70 text-xs mb-1">Derrotas</p>
                  <p className="text-red-500 font-bold text-2xl">{historicalRecords.totalLosses}</p>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-green-900/40 to-black rounded">
                <div className="flex justify-between items-center">
                  <span className="text-[#d4af37] text-sm font-semibold">Win Rate</span>
                  <span className="text-green-400 font-bold text-2xl">{historicalRecords.winRate}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Evolución en la Ronda Actual */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-black border-[#d4af37]/30 p-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Evolución en la Ronda Actual
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded">
                <h3 className="text-sm text-[#d4af37]/70 mb-2">Crecimiento de Networth (7 días)</h3>
                <div className="h-32 flex items-end justify-between gap-1">
                  {[65, 72, 68, 80, 85, 90, 100].map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#d4af37] to-yellow-600 rounded-t"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#d4af37]/50">
                  <span>Día 1</span>
                  <span>Día 7</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/40 rounded">
                  <p className="text-[#d4af37]/70 text-xs mb-1">Ataques Realizados</p>
                  <p className="text-[#d4af37] font-bold text-xl">23</p>
                </div>

                <div className="p-3 bg-black/40 rounded">
                  <p className="text-[#d4af37]/70 text-xs mb-1">Defensas Exitosas</p>
                  <p className="text-green-500 font-bold text-xl">18</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Reputación Diplomática */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-black border-[#d4af37]/30 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Reputación Diplomática
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/40 rounded text-center">
                <p className="text-[#d4af37]/70 text-sm mb-2">Nivel de Honor</p>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={`${(reputationLevel.honor / 100) * 251.2} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-500">{reputationLevel.honor}</span>
                  </div>
                </div>
                <p className={`mt-2 font-bold ${reputationLevel.color}`}>{reputationLevel.status}</p>
              </div>

              <div className="p-4 bg-black/40 rounded">
                <h3 className="text-[#d4af37] font-semibold mb-3">Bonos Activos</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-green-400">
                    <span className="text-lg">+</span> 5% descuento en Mercado Global
                  </li>
                  <li className="flex items-center gap-2 text-green-400">
                    <span className="text-lg">+</span> Prioridad en alianzas
                  </li>
                  <li className="flex items-center gap-2 text-green-400">
                    <span className="text-lg">+</span> Acceso a subastas premium
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-black/40 rounded">
                <h3 className="text-[#d4af37] font-semibold mb-3">Penalizaciones</h3>
                <p className="text-sm text-[#d4af37]/60 italic">
                  No tienes penalizaciones activas. Mantén tu honor alto para evitar sanciones.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default PerfilPage
