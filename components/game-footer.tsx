"use client"

/**
 * game-footer.tsx
 * Responsabilidad: Footer interactivo con 3 bloques: Monitor de Estado, Recursos y Comunidad, Seguridad y Soporte.
 */

import { useState, useEffect } from "react"
import {
  Clock,
  Users,
  BookOpen,
  MessageSquare,
  FileText,
  Github,
  Shield,
  FileWarning,
  Scroll,
  Mail,
} from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface GameFooterProps {
  language?: Language
  onPageChange?: (page: string) => void
}

export function GameFooter({ language = "es", onPageChange }: GameFooterProps) {
  const t = useTranslation(language)
  const [serverTime, setServerTime] = useState(new Date())
  const [nextTurnIn, setNextTurnIn] = useState(60)

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setServerTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    const turnInterval = setInterval(() => {
      setNextTurnIn((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)

    return () => clearInterval(turnInterval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleFooterClick = (section: string) => {
    if (onPageChange) {
      onPageChange(`footer-${section}`)
    }
  }

  return (
    <footer className="border-t border-[#d4af37]/20 bg-gradient-to-b from-black/95 to-black py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Bloque Izquierdo: Monitor de Estado */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-[#d4af37] mb-6 flex items-center gap-2 border-b border-[#d4af37]/30 pb-3">
              <Clock className="h-6 w-6" />
              Monitor de Estado
            </h3>

            <button
              onClick={() => handleFooterClick("server-time")}
              className="w-full text-left hover:translate-x-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between text-[#d4af37]/90 hover:text-[#d4af37]">
                <span className="text-sm">Hora del Servidor:</span>
                <span className="font-mono font-semibold">{formatTime(serverTime)}</span>
              </div>
            </button>

            <button
              onClick={() => handleFooterClick("turn-counter")}
              className="w-full text-left hover:translate-x-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between text-[#d4af37]/90 hover:text-[#d4af37]">
                <span className="text-sm">Próximo turno en:</span>
                <span className="font-mono font-semibold">{formatCountdown(nextTurnIn)}</span>
              </div>
            </button>

            <button
              onClick={() => handleFooterClick("version")}
              className="w-full text-left hover:translate-x-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between text-[#d4af37]/90 hover:text-[#d4af37]">
                <span className="text-sm">Versión:</span>
                <span className="font-mono font-semibold">v0.8.4-Alpha</span>
              </div>
            </button>

            <button
              onClick={() => handleFooterClick("population")}
              className="w-full text-left hover:translate-x-1 transition-all duration-200"
            >
              <div className="flex items-center gap-2 text-[#d4af37]/90 hover:text-[#d4af37]">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm">Estado:</span>
                <span className="text-green-500 font-semibold">1,240 Online</span>
              </div>
            </button>
          </div>

          {/* Bloque Central: Recursos y Comunidad */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-[#d4af37] mb-6 flex items-center gap-2 border-b border-[#d4af37]/30 pb-3">
              <BookOpen className="h-6 w-6" />
              Recursos y Comunidad
            </h3>

            <button
              onClick={() => handleFooterClick("wiki")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Guía del Archimago</span>
            </button>

            <button
              onClick={() => handleFooterClick("tavern")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Foro de la Taberna</span>
            </button>

            <button
              onClick={() => handleFooterClick("changelog")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">Changelog</span>
            </button>

            <button
              onClick={() => handleFooterClick("discord")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm">Discord / Redes</span>
            </button>
          </div>

          {/* Bloque Derecho: Seguridad y Soporte */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-[#d4af37] mb-6 flex items-center gap-2 border-b border-[#d4af37]/30 pb-3">
              <Shield className="h-6 w-6" />
              Seguridad y Soporte
            </h3>

            <button
              onClick={() => handleFooterClick("terms")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Scroll className="h-4 w-4" />
              <span className="text-sm">Términos y Condiciones</span>
            </button>

            <button
              onClick={() => handleFooterClick("privacy")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Política de Privacidad</span>
            </button>

            <button
              onClick={() => handleFooterClick("conduct")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <FileWarning className="h-4 w-4" />
              <span className="text-sm">Normas de Conducta</span>
            </button>

            <button
              onClick={() => handleFooterClick("support")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">Contacto / Soporte</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#d4af37]/10 text-center">
          <p className="text-sm text-[#d4af37]/60">© 2025 MageLord - Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  )
}
