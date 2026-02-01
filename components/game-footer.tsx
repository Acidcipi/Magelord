"use client"

/**
 * game-footer.tsx
 * Footer modificado: sin foro, con cookies, y contenido que no requiere login
 */

import { useState, useEffect } from "react"
import {
  Clock,
  Users,
  BookOpen,
  FileText,
  Github,
  Shield,
  FileWarning,
  Scroll,
  Mail,
  Cookie,
  Info,
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
          
          {/* ========== BLOQUE 1: MONITOR DE ESTADO ========== */}
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
                <span className="text-sm">Próximo Turno en:</span>
                <span className="font-mono font-semibold">{formatCountdown(nextTurnIn)}</span>
              </div>
            </button>

            <button
              onClick={() => handleFooterClick("version")}
              className="w-full text-left hover:translate-x-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between text-[#d4af37]/90 hover:text-[#d4af37]">
                <span className="text-sm">Versión del Juego:</span>
                <span className="font-mono font-semibold">v0.8.4-Alpha</span>
              </div>
            </button>

            <button
              onClick={() => handleFooterClick("population")}
              className="w-full text-left hover:translate-x-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between text-[#d4af37]/90 hover:text-[#d4af37]">
                <span className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Jugadores Online:
                </span>
                <span className="font-mono font-semibold text-green-400">1,240</span>
              </div>
            </button>
          </div>

          {/* ========== BLOQUE 2: INFORMACIÓN Y RECURSOS ========== */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-[#d4af37] mb-6 flex items-center gap-2 border-b border-[#d4af37]/30 pb-3">
              <BookOpen className="h-6 w-6" />
              Información y Recursos
            </h3>

            <button
              onClick={() => handleFooterClick("wiki")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Guía del Archimago</span>
            </button>

            <button
              onClick={() => handleFooterClick("about")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Info className="h-4 w-4" />
              <span className="text-sm">Acerca del Juego</span>
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
              <span className="text-sm">Discord / Redes Sociales</span>
            </button>
          </div>

          {/* ========== BLOQUE 3: SEGURIDAD Y LEGAL ========== */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-[#d4af37] mb-6 flex items-center gap-2 border-b border-[#d4af37]/30 pb-3">
              <Shield className="h-6 w-6" />
              Seguridad y Legal
            </h3>

            <button
              onClick={() => handleFooterClick("terms")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <FileWarning className="h-4 w-4" />
              <span className="text-sm">Términos de Servicio</span>
            </button>

            <button
              onClick={() => handleFooterClick("privacy")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Política de Privacidad</span>
            </button>

            <button
              onClick={() => handleFooterClick("cookies")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Cookie className="h-4 w-4" />
              <span className="text-sm">Política de Cookies</span>
            </button>

            <button
              onClick={() => handleFooterClick("conduct")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Scroll className="h-4 w-4" />
              <span className="text-sm">Código de Conducta</span>
            </button>

            <button
              onClick={() => handleFooterClick("support")}
              className="w-full text-left flex items-center gap-3 text-[#d4af37]/90 hover:text-[#d4af37] hover:translate-x-1 transition-all duration-200"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">Soporte Técnico</span>
            </button>
          </div>
        </div>

        {/* ========== COPYRIGHT ========== */}
        <div className="mt-12 pt-8 border-t border-[#d4af37]/20 text-center">
          <p className="text-[#d4af37]/60 text-sm">
            © 2025 MageLord - Todos los derechos reservados
            <span className="mx-2">•</span>
            Un juego de estrategia medieval MMO
          </p>
        </div>
      </div>
    </footer>
  )
}
