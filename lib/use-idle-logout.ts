"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

/**
 * Cierra la sesiÃ³n si no hay actividad durante X minutos.
 * TambiÃ©n cierra si al abrir la web detecta que la Ãºltima actividad fue hace mÃ¡s de X minutos.
 */
export function useIdleLogout(idleMinutes: number = 60) {
  useEffect(() => {
    const IDLE_MS = idleMinutes * 60 * 1000
    const KEY = "magelord_last_activity"

    const markActivity = () => {
      try {
        localStorage.setItem(KEY, String(Date.now()))
      } catch {}
    }

    const checkAndLogoutIfIdle = async () => {
      let last = 0
      try {
        last = Number(localStorage.getItem(KEY) || "0")
      } catch {}

      if (last && Date.now() - last > IDLE_MS) {
        await supabase.auth.signOut()
      }
    }

    const onActivity = () => {
      markActivity()
    }

    // Eventos de actividad tÃ­picos
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "focus"]
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))

    // Inicializamos actividad y comprobaciÃ³n al cargar
    markActivity()
    void checkAndLogoutIfIdle()

    // ComprobaciÃ³n periÃ³dica (por si la pestaÃ±a queda abierta)
    const interval = window.setInterval(() => {
      void checkAndLogoutIfIdle()
    }, 60_000) // cada 1 minuto

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity))
      window.clearInterval(interval)
    }
  }, [idleMinutes])
}