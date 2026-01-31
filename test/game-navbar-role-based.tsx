"use client"

/**
 * ============================================================================
 * GAME NAVBAR ROLE-BASED
 * ============================================================================
 * Navbar dinámico que lee los menús desde lib/menu-config.ts
 * Renderiza menús según el rol del usuario con colores específicos
 * ============================================================================
 */

import { Button } from "@/components/ui/button"
import { LogOut, ChevronDown } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"
import type { UserRole } from "@/lib/roles"
import { getMenusForRole } from "@/lib/menu-config"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface GameNavbarRoleBasedProps {
  activePage: string
  setActivePage: (page: string) => void
  language: Language
  setLanguage: (lang: Language) => void
  onLogout: () => void
  username: string
  userRole: UserRole // Solo un rol, no un array
}

/**
 * COLORES POR SECCIÓN DE MENÚ
 * Cada nivel de acceso tiene su propio color distintivo
 */
const MENU_COLORS = {
  "Juego": {
    text: "text-[#d4af37]",
    hover: "hover:bg-[#d4af37]/10",
    border: "border-[#d4af37]/30",
  },
  "Moderación Foro": {
    text: "text-purple-400",
    hover: "hover:bg-purple-400/10",
    border: "border-purple-400/30",
  },
  "Administración Web": {
    text: "text-blue-400",
    hover: "hover:bg-blue-400/10",
    border: "border-blue-400/30",
  },
  "Administración": {
    text: "text-red-400",
    hover: "hover:bg-red-400/10",
    border: "border-red-400/30",
  },
  "Control Total": {
    text: "text-green-400",
    hover: "hover:bg-green-400/10",
    border: "border-green-400/30",
  },
}

export function GameNavbarRoleBased({
  activePage,
  setActivePage,
  language,
  setLanguage,
  onLogout,
  username,
  userRole,
}: GameNavbarRoleBasedProps) {
  const t = useTranslation(language)
  
  // Obtener los menús que puede ver este usuario
  const menuSections = getMenusForRole(userRole)
  
  // Estado para controlar qué menú desplegable está abierto
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Manejar hover para abrir menús
  const handleMouseEnter = (menuId: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpenMenu(menuId)
  }

  // Manejar salida del mouse para cerrar menús (con delay)
  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null)
    }, 300) // 300ms de delay antes de cerrar
  }

  // Limpiar timer al desmontar componente
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
        
        {/* ===== LOGO ===== */}
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

        {/* ===== MENÚS DINÁMICOS ===== */}
        <div className="flex gap-1 items-center">
          
          {/* Renderizar cada sección de menú */}
          {menuSections.map((section) => {
            const colors = MENU_COLORS[section.title as keyof typeof MENU_COLORS] || MENU_COLORS["Juego"]
            
            return (
              <div key={section.title}>
                {section.items.map((item) => {
                  // Si el item tiene submenú, renderizar dropdown
                  if (item.submenu && item.submenu.length > 0) {
                    return (
                      <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <Button
                          variant="ghost"
                          className={`${colors.text} ${colors.hover} flex items-center gap-1`}
                        >
                          {item.label}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        
                        {/* Dropdown del submenú */}
                        {openMenu === item.id && (
                          <div className={`absolute top-full left-0 mt-1 w-56 bg-[#1a1a1a] border ${colors.border} rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
                            {item.submenu.map((subItem) => (
                              <button
                                key={subItem.id}
                                onClick={() => {
                                  setActivePage(subItem.id)
                                  setOpenMenu(null)
                                }}
                                className={`w-full text-left px-4 py-2 ${colors.text} ${colors.hover} transition-colors`}
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  } else {
                    // Item sin submenú, renderizar botón simple
                    return (
                      <Button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        variant="ghost"
                        className={`${colors.text} ${colors.hover}`}
                      >
                        {item.label}
                      </Button>
                    )
                  }
                })}
              </div>
            )
          })}

        </div>

        {/* ===== SECCIÓN DERECHA (Usuario y Controles) ===== */}
        <div className="flex items-center gap-3">
          
          {/* Nombre de usuario */}
          <span className="text-[#d4af37] font-semibold hidden md:inline">
            {username}
          </span>

          {/* Selector de idioma */}
          <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />

          {/* Botón de logout */}
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.logout}
          </Button>
        </div>
      </div>
    </nav>
  )
}
