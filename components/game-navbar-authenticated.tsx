"use client"

/**
 * Game Navbar for Authenticated Users
 * Shows 6 main game sections + logout + language selector
 */

import { Button } from "@/components/ui/button"
import { Home, Hammer, Wand2, Swords, Users2, LogOut } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"
import Image from "next/image"

interface GameNavbarAuthenticatedProps {
  activeMenu: "home" | "build" | "mages" | "army" | "diplomacy" | "profile"
  setActiveMenu: (menu: "home" | "build" | "mages" | "army" | "diplomacy" | "profile") => void
  language: Language
  setLanguage: (lang: Language) => void
  onLogout: () => void
  username: string
}

export function GameNavbarAuthenticated({
  activeMenu,
  setActiveMenu,
  language,
  setLanguage,
  onLogout,
  username,
}: GameNavbarAuthenticatedProps) {
  const t = useTranslation(language)

  return (
    <nav className="sticky top-0 z-40 border-b border-[#d4af37]/20 bg-[#0a0a0a]/95 backdrop-blur">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-2 text-[#d4af37] font-bold text-xl">
          <Image src="/images/icono-mago-magelord.jpg" alt="MageLord" width={32} height={32} className="rounded-full" />
          MageLord
        </div>

        {/* Main Navigation */}
        <div className="flex gap-2">
          <Button
            variant={activeMenu === "home" ? "default" : "ghost"}
            onClick={() => setActiveMenu("home")}
            className={
              activeMenu === "home"
                ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10"
            }
          >
            <Home className="mr-2 h-4 w-4" />
            {t.home}
          </Button>
          <Button
            variant={activeMenu === "build" ? "default" : "ghost"}
            onClick={() => setActiveMenu("build")}
            className={
              activeMenu === "build"
                ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10"
            }
          >
            <Hammer className="mr-2 h-4 w-4" />
            {t.build}
          </Button>
          <Button
            variant={activeMenu === "mages" ? "default" : "ghost"}
            onClick={() => setActiveMenu("mages")}
            className={
              activeMenu === "mages"
                ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10"
            }
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {t.mages}
          </Button>
          <Button
            variant={activeMenu === "army" ? "default" : "ghost"}
            onClick={() => setActiveMenu("army")}
            className={
              activeMenu === "army"
                ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10"
            }
          >
            <Swords className="mr-2 h-4 w-4" />
            {t.army}
          </Button>
          <Button
            variant={activeMenu === "diplomacy" ? "default" : "ghost"}
            onClick={() => setActiveMenu("diplomacy")}
            className={
              activeMenu === "diplomacy"
                ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10"
            }
          >
            <Users2 className="mr-2 h-4 w-4" />
            {t.diplomacy}
          </Button>
          <Button
            variant={activeMenu === "profile" ? "default" : "ghost"}
            onClick={() => setActiveMenu("profile")}
            className={
              activeMenu === "profile"
                ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
                : "text-[#d4af37] hover:bg-[#d4af37]/10"
            }
          >
            <Image
              src="/images/icono-mago-magelord.jpg"
              alt="Profile"
              width={16}
              height={16}
              className="mr-2 rounded-full"
            />
            {t.profile}
          </Button>
        </div>

        {/* Right side: Language + Logout */}
        <div className="flex items-center gap-3">
          <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
          <Button
            variant="outline"
            onClick={onLogout}
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
