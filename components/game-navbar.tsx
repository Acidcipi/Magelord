"use client"

/**
 * game-navbar.tsx
 * Responsabilidad: Navbar sticky con navegación horizontal entre secciones (PRE-LOGIN).
 */

import { Button } from "@/components/ui/button"
import { Sparkles, Crown, MessageSquare } from "lucide-react"
import { LogOut, ChevronDown, Shield } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface GameNavbarProps {
  activeMenu: "portada" | "noticias" | "login"
  setActiveMenu: (menu: "portada" | "noticias" | "login") => void
  language: Language
  setLanguage: (lang: Language) => void
}

export function GameNavbar({ activeMenu, setActiveMenu, language, setLanguage }: GameNavbarProps) {
  const t = useTranslation(language)

  return (
    <nav className="sticky top-0 z-40 border-b border-[#d4af37]/20 bg-[#0a0a0a]/95 backdrop-blur">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex justify-center gap-2 flex-1">
          <Button
            variant={activeMenu === "portada" ? "default" : "ghost"}
            onClick={() => setActiveMenu("portada")}
            className={
              activeMenu === "portada"
                ? "bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
            }
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {t.portada}
          </Button>
          <Button
            variant={activeMenu === "noticias" ? "default" : "ghost"}
            onClick={() => setActiveMenu("noticias")}
            className={
              activeMenu === "noticias"
                ? "bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
            }
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {t.news}
          </Button>
          <Button
            variant={activeMenu === "login" ? "default" : "ghost"}
            onClick={() => setActiveMenu("login")}
            className={
              activeMenu === "login"
                ? "bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
            }
          >
            <Crown className="mr-2 h-4 w-4" />
            {t.login}
          </Button>
        </div>

        {/* Right side: Username + Admin Panel + Language + Logout */}
        <div className="flex items-center gap-3">
          {/* Nombre de usuario */}
          <span className="text-[#d4af37] font-semibold hidden md:inline">
            {username}
          </span>

          {/* Botón Panel Admin (solo para admin+) */}
          {(userRoles.includes("web_admin") || userRoles.includes("admin") || userRoles.includes("owner")) && (
            <Button
              onClick={() => setActivePage("admin-dashboard")}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <Shield className="mr-2 h-4 w-4" />
              Panel Admin
            </Button>
          )}

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
