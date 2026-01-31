"use client"

/**
 * Dynamic Game Navbar with Role-based Menus and SMOOTH HOVER
 */

import { Button } from "@/components/ui/button"
import { LogOut, ChevronDown } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"
import type { UserRole } from "@/lib/roles"
import { getRolePermissions } from "@/lib/roles"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface GameNavbarDynamicProps {
  activePage: string
  setActivePage: (page: string) => void
  language: Language
  setLanguage: (lang: Language) => void
  onLogout: () => void
  username: string
  userRoles: UserRole[]
}

export function GameNavbarDynamic({
  activePage,
  setActivePage,
  language,
  setLanguage,
  onLogout,
  username,
  userRoles,
}: GameNavbarDynamicProps) {
  const t = useTranslation(language)
  const permissions = getRolePermissions(userRoles)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (menu: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpenMenu(menu)
  }

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-[#d4af37]/20 bg-[#0a0a0a]/98 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 text-[#d4af37] font-bold text-xl cursor-pointer hover:text-[#f4cf5f] transition-colors"
          onClick={() => setActivePage("noticias")}
        >
          <Image
            src="/images/icono-mago-magelord.jpg"
            alt="MageLord"
            width={40}
            height={40}
            className="rounded-full border-2 border-[#d4af37]"
          />
          MageLord
        </div>

        {/* Main Navigation with Dropdowns */}
        <div className="flex gap-1 items-center">
          {/* NOTICIAS button */}
          <Button
            onClick={() => setActivePage("noticias")}
            variant="ghost"
            className="text-[#d4af37] hover:bg-[#d4af37]/10"
          >
            {t.news}
          </Button>

          {/* PROVINCIA Dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("provincia")} onMouseLeave={handleMouseLeave}>
            <Button variant="ghost" className="text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-1">
              {t.province}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {openMenu === "provincia" && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => setActivePage("estado")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.provinceState}
                </button>
                <button
                  onClick={() => setActivePage("exploracion")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {language === "es" ? "Exploración" : "Exploration"}
                </button>
                <button
                  onClick={() => setActivePage("construir")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.construct}
                </button>
                <button
                  onClick={() => setActivePage("demoler")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.demolish}
                </button>
                <button
                  onClick={() => setActivePage("investigacion")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.research}
                </button>
              </div>
            )}
          </div>

          {/* EJERCITO Dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("ejercito")} onMouseLeave={handleMouseLeave}>
            <Button variant="ghost" className="text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-1">
              {t.army}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {openMenu === "ejercito" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => setActivePage("reclutar")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {language === "es" ? "Entrenamiento" : "Training"}
                </button>
                <button
                  onClick={() => setActivePage("sala-guerra")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.warRoom}
                </button>
                <button
                  onClick={() => setActivePage("historial")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.history}
                </button>
                <button
                  onClick={() => setActivePage("defensa")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {language === "es" ? "Defensa" : "Defense"}
                </button>
              </div>
            )}
          </div>

          {/* MAGIA Dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("magia")} onMouseLeave={handleMouseLeave}>
            <Button variant="ghost" className="text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-1">
              {t.magic}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {openMenu === "magia" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => setActivePage("libro-hechizos")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  Libro de Hechizos
                </button>
                <button
                  onClick={() => setActivePage("rituales")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  Rituales
                </button>
                <button
                  onClick={() => setActivePage("cooldowns")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  Cooldowns
                </button>
              </div>
            )}
          </div>

          {/* COMERCIO Dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("comercio")} onMouseLeave={handleMouseLeave}>
            <Button variant="ghost" className="text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-1">
              {t.trade}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {openMenu === "comercio" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => setActivePage("mercado-global")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.globalMarket}
                </button>
                <button
                  onClick={() => setActivePage("mercado-negro")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.blackMarket}
                </button>
              </div>
            )}
          </div>

          {/* DIPLOMACIA Dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("diplomacia")} onMouseLeave={handleMouseLeave}>
            <Button variant="ghost" className="text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-1">
              {t.diplomacy}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {openMenu === "diplomacia" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => setActivePage("mensajes")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.messages}
                </button>
                <button
                  onClick={() => setActivePage("gremios")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.guilds}
                </button>
                <button
                  onClick={() => setActivePage("rankings")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.rankings}
                </button>
                <button
                  onClick={() => setActivePage("alianzas")}
                  className="w-full text-left px-4 py-2 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                >
                  {t.alliances}
                </button>
              </div>
            )}
          </div>

          {/* FORO button */}
          <Button
            onClick={() => setActivePage("foro")}
            variant="ghost"
            className="text-[#d4af37] hover:bg-[#d4af37]/10"
          >
            {t.forum}
          </Button>

          {/* PERFIL button */}
          <Button
            onClick={() => setActivePage("perfil")}
            variant="ghost"
            className="text-[#d4af37] hover:bg-[#d4af37]/10"
          >
            {t.profile}
          </Button>

          {/* OWNER Panel Dropdown */}
          {userRoles.includes("owner") && (
            <div className="relative" onMouseEnter={() => handleMouseEnter("owner")} onMouseLeave={handleMouseLeave}>
              <Button
                variant="ghost"
                className="text-green-500 hover:bg-green-500/10 flex items-center gap-1 font-bold"
              >
                Owner
                <ChevronDown className="h-3 w-3" />
              </Button>
              {openMenu === "owner" && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a1a1a] border border-green-500/30 rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => setActivePage("owner-noticias")}
                    className="w-full text-left px-4 py-2 text-green-500 hover:bg-green-500/10 transition-colors"
                  >
                    Gestionar Noticias
                  </button>
                  <button
                    onClick={() => setActivePage("owner-anuncios")}
                    className="w-full text-left px-4 py-2 text-green-500 hover:bg-green-500/10 transition-colors"
                  >
                    Anuncios Globales
                  </button>
                  <button
                    onClick={() => setActivePage("owner-jugadores")}
                    className="w-full text-left px-4 py-2 text-green-500 hover:bg-green-500/10 transition-colors"
                  >
                    Gestionar Jugadores
                  </button>
                  <button
                    onClick={() => setActivePage("owner-logs")}
                    className="w-full text-left px-4 py-2 text-green-500 hover:bg-green-500/10 transition-colors"
                  >
                    Logs del Sistema
                  </button>
                </div>
              )}
            </div>
          )}

          {/* WEB ADMIN Panel Dropdown */}
          {userRoles.includes("web_admin") && (
            <div className="relative" onMouseEnter={() => handleMouseEnter("webadmin")} onMouseLeave={handleMouseLeave}>
              <Button variant="ghost" className="text-blue-600 hover:bg-blue-600/10 flex items-center gap-1 font-bold">
                Admin Web
                <ChevronDown className="h-3 w-3" />
              </Button>
              {openMenu === "webadmin" && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a1a1a] border border-blue-600/30 rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => setActivePage("admin-noticias")}
                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-600/10 transition-colors"
                  >
                    Gestionar Noticias
                  </button>
                  <button
                    onClick={() => setActivePage("admin-anuncios")}
                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-600/10 transition-colors"
                  >
                    Anuncios
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Language + Logout */}
        <div className="flex items-center gap-3">
          <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
          <Button
            variant="outline"
            onClick={() => {
              console.log("[v0] 🖱️ Logout button clicked")
              onLogout()
            }}
            className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.logout}
          </Button>
        </div>
      </div>
    </nav>
  )
}
