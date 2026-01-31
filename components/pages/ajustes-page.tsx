"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AjustesPageProps {
  language: Language
  user: any
  setLanguage: (lang: Language) => void
}

export function AjustesPage({ language, user, setLanguage }: AjustesPageProps) {
  const t = useTranslation(language)
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(language)
  const [autoLoadLanguage, setAutoLoadLanguage] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [saving, setSaving] = useState(false)

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          preferred_language: preferredLanguage,
          auto_load_language: autoLoadLanguage,
          email_notifications: emailNotifications,
          theme: theme,
        }),
      })

      if (response.ok) {
        alert("Configuración guardada exitosamente")
        // Update current language if auto-load is enabled
        if (autoLoadLanguage) {
          setLanguage(preferredLanguage)
        }
      } else {
        alert("Error al guardar configuración")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error al guardar configuración")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#d4af37]">{t.settings}</h1>

      <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#d4af37] mb-4">{t.accountInfo}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">{t.username}</label>
            <input
              type="text"
              defaultValue={user?.username}
              className="w-full mt-1 p-2 bg-[#0f0f0f] border border-[#d4af37]/20 rounded text-[#d4af37]"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">{t.email}</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full mt-1 p-2 bg-[#0f0f0f] border border-[#d4af37]/20 rounded text-[#d4af37]"
              disabled
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#d4af37] mb-4">Preferencias</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-2">{t.preferredLanguage}</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as Language)}
              className="w-full p-2 bg-[#0f0f0f] border border-[#d4af37]/20 rounded text-[#d4af37]"
            >
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">
              {language === "es" ? "Tema de la Interfaz" : "Interface Theme"}
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "dark" | "light")}
              className="w-full p-2 bg-[#0f0f0f] border border-[#d4af37]/20 rounded text-[#d4af37]"
            >
              <option value="dark">🌙 {language === "es" ? "Tema Oscuro" : "Dark Theme"}</option>
              <option value="light">☀️ {language === "es" ? "Tema Claro" : "Light Theme"}</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {language === "es"
                ? "El tema claro usa tonos blanco hueso, azul cobalto y bordes plateados"
                : "Light theme uses bone white, cobalt blue tones and silver borders"}
            </p>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded border border-[#d4af37]/10">
            <span className="text-gray-300 text-sm">
              {language === "es" ? "Cargar idioma preferido al iniciar" : "Load preferred language on startup"}
            </span>
            <input
              type="checkbox"
              checked={autoLoadLanguage}
              onChange={(e) => setAutoLoadLanguage(e.target.checked)}
              className="w-5 h-5 accent-[#d4af37]"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded border border-[#d4af37]/10">
            <span className="text-gray-300 text-sm">
              {language === "es" ? "Recibir notificaciones por email" : "Receive email notifications"}
            </span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 accent-[#d4af37]"
            />
          </div>

          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-[#d4af37] text-black hover:bg-[#f4cf5f] font-bold px-6 py-3 w-auto"
          >
            {saving
              ? language === "es"
                ? "Guardando..."
                : "Saving..."
              : language === "es"
                ? "Guardar Cambios"
                : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#d4af37] mb-4">{t.changePassword}</h3>
        <div className="space-y-3">
          <input
            type="password"
            placeholder={t.newPassword}
            className="w-full p-2 bg-[#0f0f0f] border border-[#d4af37]/20 rounded text-[#d4af37]"
          />
          <input
            type="password"
            placeholder={t.confirmNewPassword}
            className="w-full p-2 bg-[#0f0f0f] border border-[#d4af37]/20 rounded text-[#d4af37]"
          />
          <Button className="bg-[#d4af37] text-black hover:bg-[#f4cf5f]">{t.changePasswordButton}</Button>
        </div>
      </div>
    </div>
  )
}
