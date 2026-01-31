import { supabase } from "@/lib/supabaseClient"

let idleTimer: ReturnType<typeof setTimeout> | null = null
let cleanupFns: Array<() => void> = []

export async function logout() {
  // Limpieza local (no pasa nada si alguna key no existe)
  try {
    localStorage.removeItem("magelord_active_page")
    localStorage.removeItem("magelord_session")
    localStorage.removeItem("supabase.auth.token")
    sessionStorage.clear()
  } catch {}

  // Cerrar sesión en Supabase
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

/**
 * Auto-logout por inactividad.
 * Devuelve una función cleanup() para pararlo.
 */
export function startIdleLogout(minutes = 60, onIdleLogout?: () => void) {
  stopIdleLogout()

  const ms = minutes * 60 * 1000

  const reset = () => {
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(async () => {
      try {
        await logout()
      } catch {
        // aunque falle el signOut remoto, el estado local ya se limpió
      } finally {
        onIdleLogout?.()
      }
    }, ms)
  }

  const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]

  const onActivity = () => reset()
  events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }))

  cleanupFns.push(() => {
    events.forEach((ev) => window.removeEventListener(ev, onActivity as any))
  })

  reset()

  // devuelve cleanup
  return () => stopIdleLogout()
}

export function stopIdleLogout() {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }
  cleanupFns.forEach((fn) => {
    try {
      fn()
    } catch {}
  })
  cleanupFns = []
}
