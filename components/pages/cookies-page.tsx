"use client"

import { Cookie, Shield, Settings } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Language } from "@/lib/i18n"

interface CookiesPageProps {
  language: Language
}

export function CookiesPage({ language }: CookiesPageProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Cookie className="h-16 w-16 text-[#d4af37]" />
        </div>
        <h1 className="text-4xl font-bold text-[#d4af37]">
          {language === "es" ? "Política de Cookies" : "Cookie Policy"}
        </h1>
        <p className="text-[#d4af37]/70">
          {language === "es"
            ? "Última actualización: 31 de Enero de 2025"
            : "Last updated: January 31, 2025"}
        </p>
      </div>

      {/* Intro */}
      <Card className="bg-black/40 border-[#d4af37]/30 p-6">
        <p className="text-[#d4af37]/90 leading-relaxed">
          {language === "es"
            ? "MageLord utiliza cookies y tecnologías similares para mejorar tu experiencia de juego, mantener tu sesión activa y analizar el uso del sitio. Esta política explica qué cookies usamos y cómo puedes gestionarlas."
            : "MageLord uses cookies and similar technologies to improve your gaming experience, keep your session active, and analyze site usage. This policy explains what cookies we use and how you can manage them."}
        </p>
      </Card>

      {/* ¿Qué son las cookies? */}
      <Card className="bg-black/40 border-[#d4af37]/30 p-6">
        <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
          <Cookie className="h-6 w-6" />
          {language === "es" ? "¿Qué son las cookies?" : "What are cookies?"}
        </h2>
        <p className="text-[#d4af37]/80 leading-relaxed">
          {language === "es"
            ? "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos permiten recordar tus preferencias y mejorar tu experiencia de juego."
            : "Cookies are small text files that are stored on your device when you visit a website. They allow us to remember your preferences and improve your gaming experience."}
        </p>
      </Card>

      {/* Tipos de cookies que usamos */}
      <Card className="bg-black/40 border-[#d4af37]/30 p-6">
        <h2 className="text-2xl font-bold text-[#d4af37] mb-4">
          {language === "es" ? "Tipos de cookies que usamos" : "Types of cookies we use"}
        </h2>
        
        <div className="space-y-4">
          {/* Cookies esenciales */}
          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-500/5">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              {language === "es" ? "🔒 Cookies Esenciales (Necesarias)" : "🔒 Essential Cookies (Necessary)"}
            </h3>
            <p className="text-[#d4af37]/70 text-sm mb-2">
              {language === "es"
                ? "Estas cookies son necesarias para el funcionamiento básico del juego. Sin ellas, no podrías iniciar sesión ni jugar."
                : "These cookies are necessary for the basic functioning of the game. Without them, you couldn't log in or play."}
            </p>
            <ul className="text-[#d4af37]/60 text-sm space-y-1 ml-4">
              <li>• {language === "es" ? "Autenticación de sesión (Supabase Auth)" : "Session authentication (Supabase Auth)"}</li>
              <li>• {language === "es" ? "Preferencias de idioma" : "Language preferences"}</li>
              <li>• {language === "es" ? "Estado del juego" : "Game state"}</li>
            </ul>
          </div>

          {/* Cookies funcionales */}
          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-500/5">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              {language === "es" ? "⚙️ Cookies Funcionales" : "⚙️ Functional Cookies"}
            </h3>
            <p className="text-[#d4af37]/70 text-sm mb-2">
              {language === "es"
                ? "Mejoran tu experiencia recordando tus preferencias de juego."
                : "They improve your experience by remembering your game preferences."}
            </p>
            <ul className="text-[#d4af37]/60 text-sm space-y-1 ml-4">
              <li>• {language === "es" ? "Última página visitada" : "Last visited page"}</li>
              <li>• {language === "es" ? "Tema visual (oscuro/claro)" : "Visual theme (dark/light)"}</li>
              <li>• {language === "es" ? "Configuración de notificaciones" : "Notification settings"}</li>
            </ul>
          </div>

          {/* Cookies analíticas */}
          <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-500/5">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              {language === "es" ? "📊 Cookies Analíticas (Opcional)" : "📊 Analytics Cookies (Optional)"}
            </h3>
            <p className="text-[#d4af37]/70 text-sm mb-2">
              {language === "es"
                ? "Nos ayudan a entender cómo usas el juego para mejorar la experiencia."
                : "They help us understand how you use the game to improve the experience."}
            </p>
            <ul className="text-[#d4af37]/60 text-sm space-y-1 ml-4">
              <li>• {language === "es" ? "Páginas más visitadas" : "Most visited pages"}</li>
              <li>• {language === "es" ? "Tiempo de juego promedio" : "Average playtime"}</li>
              <li>• {language === "es" ? "Errores técnicos encontrados" : "Technical errors found"}</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Cómo gestionar cookies */}
      <Card className="bg-black/40 border-[#d4af37]/30 p-6">
        <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          {language === "es" ? "Cómo gestionar las cookies" : "How to manage cookies"}
        </h2>
        
        <div className="space-y-4 text-[#d4af37]/80">
          <p>
            {language === "es"
              ? "Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies que ya están en tu ordenador y puedes configurar la mayoría de navegadores para evitar que se instalen."
              : "You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being installed."}
          </p>

          <div className="bg-amber-900/20 border border-amber-700/30 p-4 rounded">
            <p className="text-amber-300 text-sm">
              <strong>⚠️ {language === "es" ? "Importante:" : "Important:"}</strong>{" "}
              {language === "es"
                ? "Si bloqueas las cookies esenciales, no podrás iniciar sesión ni jugar a MageLord."
                : "If you block essential cookies, you won't be able to log in or play MageLord."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#d4af37] mb-2">
              {language === "es" ? "Configuración por navegador:" : "Browser settings:"}
            </h3>
            <ul className="text-sm space-y-2 ml-4">
              <li>• <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
              <li>• <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
              <li>• <strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
              <li>• <strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Cookies de terceros */}
      <Card className="bg-black/40 border-[#d4af37]/30 p-6">
        <h2 className="text-2xl font-bold text-[#d4af37] mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          {language === "es" ? "Cookies de terceros" : "Third-party cookies"}
        </h2>
        <p className="text-[#d4af37]/80 leading-relaxed mb-4">
          {language === "es"
            ? "MageLord utiliza servicios de terceros que pueden establecer sus propias cookies:"
            : "MageLord uses third-party services that may set their own cookies:"}
        </p>
        <ul className="text-[#d4af37]/70 space-y-2 ml-4">
          <li>
            • <strong className="text-[#d4af37]">Supabase:</strong>{" "}
            {language === "es"
              ? "Para autenticación y base de datos"
              : "For authentication and database"}
          </li>
          <li>
            • <strong className="text-[#d4af37]">Vercel:</strong>{" "}
            {language === "es"
              ? "Para hosting y análisis de rendimiento"
              : "For hosting and performance analytics"}
          </li>
        </ul>
      </Card>

      {/* Contacto */}
      <Card className="bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 border-[#d4af37]/30 p-6">
        <h2 className="text-xl font-bold text-[#d4af37] mb-3">
          {language === "es" ? "¿Tienes dudas sobre cookies?" : "Questions about cookies?"}
        </h2>
        <p className="text-[#d4af37]/80 text-sm">
          {language === "es"
            ? "Si tienes preguntas sobre nuestra política de cookies, contáctanos en: "
            : "If you have questions about our cookie policy, contact us at: "}
          <a href="mailto:privacy@magelord.com" className="text-[#d4af37] underline hover:text-[#f4cf5f]">
            privacy@magelord.com
          </a>
        </p>
      </Card>
    </div>
  )
}
