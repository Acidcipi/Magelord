"use client"

/**
 * Language Selector Component
 * Dropdown to switch between Spanish and English
 */

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/i18n"

interface LanguageSelectorProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37]">
          <Globe className="mr-2 h-4 w-4" />
          {currentLang === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-[#d4af37]/30">
        <DropdownMenuItem
          onClick={() => onLanguageChange("es")}
          className="text-[#d4af37] hover:bg-[#d4af37]/10 cursor-pointer"
        >
          🇪🇸 Español
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLanguageChange("en")}
          className="text-[#d4af37] hover:bg-[#d4af37]/10 cursor-pointer"
        >
          🇺🇸 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
