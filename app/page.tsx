"use client"

// ============================================================================
// MAGELORD - MAIN PAGE COMPONENT
// ============================================================================
// Archivo: app/page.tsx
// Descripción: Componente principal que maneja toda la lógica de autenticación,
// navegación, estado del juego y renderizado de páginas
// ============================================================================

// ============================================================================
// IMPORTS - REACT & HOOKS
// ============================================================================
import { useState, useEffect, useRef } from "react"

// ============================================================================
// IMPORTS - COMPONENTES DE ESTRUCTURA
// ============================================================================
import { GameHeader } from "@/components/game-header"
import { GameNavbar } from "@/components/game-navbar"
import { GameNavbarDynamic } from "@/components/game-navbar-dynamic"
import { FixedSidebarLeft } from "@/components/fixed-sidebar-left"
import { FixedSidebarRight } from "@/components/fixed-sidebar-right"
import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
import { MainContent } from "@/components/main-content"
import { GameFooter } from "@/components/game-footer"

// ============================================================================
// IMPORTS - PÁGINAS DE JUEGO (JUGADORES)
// ============================================================================
import { NoticiasPage } from "@/components/pages/noticias-page"
import { PortadaPage } from "@/components/pages/portada-page"
import { EstadoPage } from "@/components/pages/estado-page"
import { ProvinciaPage } from "@/components/pages/provincia-page"
import { ExploracionPage } from "@/components/pages/exploracion-page"
import { ConstruirPage } from "@/components/pages/construir-page"
import { DemolerPage } from "@/components/pages/demoler-page"
import { InvestigacionPage } from "@/components/pages/investigacion-page"
import { ReclutarPage } from "@/components/pages/reclutar-page"
import { DefensaPage } from "@/components/pages/defensa-page"

// ============================================================================
// IMPORTS - PÁGINAS DE EJÉRCITO Y GUERRA
// ============================================================================
import { SalaGuerraPage } from "@/components/pages/sala-guerra-page"
import { HistorialPage } from "@/components/pages/historial-page"

// ============================================================================
// IMPORTS - PÁGINAS DE MAGIA
// ============================================================================
import { HechizosPage } from "@/components/pages/hechizos-page"
import { RitualesPage } from "@/components/pages/rituales-page"
import { MagiaPage } from "@/components/pages/magia-page"
import { HechizosActivosPage } from "@/components/pages/hechizos-activos-page"

// ============================================================================
// IMPORTS - PÁGINAS DE COMERCIO
// ============================================================================
import { MercadoGlobalPage } from "@/components/pages/mercado-global-page"
import { MercadoNegroPage } from "@/components/pages/mercado-negro-page"

// ============================================================================
// IMPORTS - PÁGINAS DE DIPLOMACIA Y SOCIAL
// ============================================================================
import { MensajesPage } from "@/components/pages/mensajes-page"
import { GremiosPage } from "@/components/pages/gremios-page"
import { RankingsPage } from "@/components/pages/rankings-page"
import { RankingGlobalPage } from "@/components/pages/ranking-global-page"
import { AlianzasPage } from "@/components/pages/alianzas-page"
import { ForoPage } from "@/components/pages/foro-page"

// ============================================================================
// IMPORTS - PÁGINAS DE USUARIO
// ============================================================================
import { PerfilPage } from "@/components/pages/perfil-page"
import { AjustesPage } from "@/components/pages/ajustes-page"

// ============================================================================
// IMPORTS - PÁGINAS DEL FOOTER (PÚBLICAS)
// ============================================================================
import { GuiaPage } from "@/components/pages/guia-page"
import { CookiesPage } from "@/components/pages/cookies-page"

// ============================================================================
// IMPORTS - PANEL DE ADMINISTRACIÓN (CENTRAL)
// ============================================================================
import { AdminDashboardPage } from "@/components/pages/owner/admin-dashboard-page"

// ============================================================================
// IMPORTS - ADMINISTRACIÓN GENERAL (admin + owner)
// ============================================================================
import { UsuariosAdminPage } from "@/components/pages/admin/usuarios-admin-page"
import { RolesAdminPage } from "@/components/pages/admin/roles-admin-page"
import { BansAdminPage } from "@/components/pages/admin/bans-admin-page"
import { FixesAdminPage } from "@/components/pages/admin/fixes-admin-page"
import { LogsAdminPage } from "@/components/pages/admin/logs-admin-page"

// ============================================================================
// IMPORTS - ADMINISTRACIÓN WEB (web_admin + admin + owner)
// ============================================================================
import { NoticiasAdminPage } from "@/components/pages/webadmin/noticias-admin-page"
import { AnunciosAdminPage } from "@/components/pages/webadmin/anuncios-admin-page"
import { PublicidadAdminPage } from "@/components/pages/webadmin/publicidad-admin-page"
import { BroadcastAdminPage } from "@/components/pages/webadmin/broadcast-admin-page"

// ============================================================================
// IMPORTS - ADMINISTRACIÓN FORO (forum_admin + admin + owner)
// ============================================================================
import { ForoPostsAdminPage } from "@/components/pages/forum-admin/foro-posts-admin-page"
import { ForoReportesAdminPage } from "@/components/pages/forum-admin/foro-reportes-admin-page"
import { ForoBansAdminPage } from "@/components/pages/forum-admin/foro-bans-admin-page"
import { ForoLogsAdminPage } from "@/components/pages/forum-admin/foro-logs-admin-page"

// ============================================================================
// IMPORTS - CONTROL TOTAL (SOLO OWNER)
// ============================================================================
import { AdminCataclysmPage } from "@/components/pages/owner/admin-cataclysm-page"
import { OwnerLogsPage } from "@/components/pages/owner/owner-logs-page"
import { OwnerNoticiasPage } from "@/components/pages/owner/owner-noticias-page"
import { OwnerAnunciosPage } from "@/components/pages/owner/owner-anuncios-page"
import { OwnerJugadoresPage } from "@/components/pages/owner/owner-jugadores-page"
import { DatabaseAdminPage } from "@/components/pages/owner/database-admin-page"
import { ServerConfigPage } from "@/components/pages/owner/server-config-page"
import { EmergencyAdminPage } from "@/components/pages/owner/emergency-admin-page"

// ============================================================================
// IMPORTS - LIBRERÍAS Y TIPOS
// ============================================================================
import type { Language } from "@/lib/i18n"
import type { UserRole } from "@/lib/roles"
import { fetchGameState, type GameState } from "@/lib/game-state"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function MageLordGame() {
  // ==========================================================================
  // ESTADO - BÁSICO
  // ==========================================================================
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>("es")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ==========================================================================
  // ESTADO - NAVEGACIÓN
  // ==========================================================================
  const [activeMenu, setActiveMenu] = useState<"portada" | "noticias" | "login">("portada")
  const [activePage, setActivePage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("magelord_active_page")
      return saved || "noticias"
    }
    return "noticias"
  })

  // ==========================================================================
  // ESTADO - USUARIO Y JUEGO
  // ==========================================================================
  const [user, setUser] = useState<any>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loginError, setLoginError] = useState<string>("")

  // ==========================================================================
  // REFS Y UTILIDADES
  // ==========================================================================
  const { toast } = useToast()
  const isCheckingSession = useRef(false)

  // ==========================================================================
  // EFFECT - MONTAJE INICIAL
  // ==========================================================================
  useEffect(() => {
    setMounted(true)
  }, [])

  // ==========================================================================
  // EFFECT - REGENERACIÓN AUTOMÁTICA DE RECURSOS
  // ==========================================================================
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return

    console.log("[MAGELORD] ⏰ Iniciando regeneración automática de recursos")

    // Intervalo principal: 60 segundos
    const intervalId = setInterval(async () => {
      console.log("[MAGELORD] 🔄 Ejecutando actualización de recursos...")
      try {
        if (user?.id && gameState?.province_id) {
          const { error: rpcError } = await supabase.rpc("update_population_growth", {
            p_province_id: gameState.province_id,
          })

          if (rpcError) {
            console.error("[MAGELORD] ❌ Error en RPC de población:", rpcError)
          } else {
            console.log("[MAGELORD] ✅ Población actualizada")
          }

          const gameStateData = await fetchGameState(user.id)
          if (gameStateData) {
            setGameState(gameStateData)
            console.log("[MAGELORD] ⚡ Recursos actualizados automáticamente")
          }
        }
      } catch (error) {
        console.error("[MAGELORD] ❌ Error en actualización automática:", error)
      }
    }, 60000)

    // Intervalo de respaldo: 30 segundos
    const backupIntervalId = setInterval(async () => {
      console.log("[MAGELORD] 🔄 Ejecutando recarga de respaldo...")
      try {
        const gameStateData = await fetchGameState(user.id)
        if (gameStateData) {
          setGameState(gameStateData)
          console.log("[MAGELORD] ⚡ Recarga de respaldo completada")
        }
      } catch (error) {
        console.error("[MAGELORD] ❌ Error en recarga de respaldo:", error)
      }
    }, 30000)

    return () => {
      clearInterval(intervalId)
      clearInterval(backupIntervalId)
    }
  }, [isLoggedIn, user?.id, gameState?.province_id])

  // ==========================================================================
  // EFFECT - VERIFICACIÓN DE SESIÓN INICIAL
  // ==========================================================================
  useEffect(() => {
    const checkSession = async () => {
      if (isCheckingSession.current) {
        console.log("[MAGELORD] ⚠️ Verificación de sesión ya en progreso")
        return
      }

      isCheckingSession.current = true
      console.log("[MAGELORD] 🔐 Verificando sesión existente...")

      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("[MAGELORD] ✓ Sesión encontrada")

          // Registrar actividad
          supabase.rpc("registrar_actividad", { p_auth_uuid: session.user.id })

          // Obtener datos de usuario
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, username, email, role, faction")
            .eq("auth_uuid", session.user.id)
            .maybeSingle()

          if (userError || !userData) {
            throw new Error("Usuario no encontrado")
          }

          console.log("[MAGELORD] ✅ Usuario:", userData.username, "| Rol:", userData.role)

          // Ejecutar actualización lazy
          const { error: rpcError } = await supabase.rpc("ejecutar_actualizacion_pendiente", {
            p_user_id: userData.id,
          })

          if (!rpcError) {
            console.log("[MAGELORD] ⚡ Actualización lazy ejecutada")
          }

          // Cargar estado del juego
          const gameStateData = await fetchGameState(userData.id)

          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            faction: userData.faction || "Sin Facción",
          })
          setGameState(gameStateData)
          setIsLoggedIn(true)

          // Restaurar página guardada
          const savedPage = localStorage.getItem("magelord_active_page")
          if (savedPage) setActivePage(savedPage)

          console.log("[MAGELORD] ✅ Sesión restaurada exitosamente")
          window.scrollTo({ top: 0, behavior: 'smooth' })

          // Configurar suscripciones en tiempo real
          if (gameStateData && Number(gameStateData.province_id) > 0) {
            setupRealtimeSubscriptions(gameStateData.province_id.toString(), userData.id)
          }
        } else {
          console.log("[MAGELORD] ℹ️ No hay sesión activa")
          localStorage.clear()
          sessionStorage.clear()
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error("[MAGELORD] ❌ Error en verificación de sesión:", error)
        localStorage.clear()
        sessionStorage.clear()
        setIsLoggedIn(false)
      } finally {
        isCheckingSession.current = false
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  // ==========================================================================
  // FUNCIÓN - CONFIGURAR SUSCRIPCIONES EN TIEMPO REAL
  // ==========================================================================
  const setupRealtimeSubscriptions = (provinceId: string, userId: string) => {
    console.log("[MAGELORD] 🔴 Configurando suscripciones en tiempo real...")

    const provinceIdString = String(provinceId)

    // Canal de provincias
    const provincesChannel = supabase
      .channel(`provinces:${provinceIdString}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "provinces",
          filter: `id=eq.${gameState.province_id}`,
        },
        (payload) => {
          console.log("[MAGELORD] Provincia actualizada:", payload.new)

          // Actualizar estado local inmediatamente
          setGameState((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              acres: payload.new.land,
              gold: payload.new.gold,
              mana: payload.new.mana,
              food: payload.new.food,
              turns: payload.new.turns,
              population: payload.new.population,
              networth: payload.new.networth,
              next_turn_at: payload.new.next_turn_at,  // <-- AÑADIR ESTO
              tax_rate: payload.new.tax_rate,
            }
          })
        }
      )
      .subscribe()

    // Canal de unidades
    const unitsChannel = supabase
      .channel(`province_units:${provinceIdString}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "province_units",
          filter: `province_id=eq.${provinceIdString}`,
        },
        async (payload) => {
          console.log("[MAGELORD] 🪖 Tropas actualizadas vía Realtime")
          try {
            const gameStateData = await fetchGameState(userId)
            if (gameStateData) {
              setGameState(gameStateData)
            }
          } catch (error) {
            console.error("[MAGELORD] ❌ Error recargando tropas:", error)
          }
        }
      )
      .subscribe()

    // Canal de usuarios (para cambios de rol)
    const usersChannel = supabase
      .channel(`users:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log("[MAGELORD] 👤 Rol de usuario actualizado:", payload.new.role)

          setUser((prev: any) => ({
            ...prev,
            role: payload.new.role,
          }))

          setGameState((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              role: payload.new.role,
            }
          })

          if (payload.new.role === "owner" || payload.new.role === "web_admin") {
            toast({
              title: "Acceso Actualizado",
              description: `Tu rol ahora es: ${payload.new.role}`,
              duration: 5000,
            })
          }
        }
      )
      .subscribe()

    return () => {
      provincesChannel.unsubscribe()
      unitsChannel.unsubscribe()
      usersChannel.unsubscribe()
    }
  }

  // ==========================================================================
  // EFFECT - MONITOREO DE CAMBIOS DE AUTENTICACIÓN
  // ==========================================================================
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[MAGELORD] 🔄 Evento de autenticación:", event)

      if (event === "INITIAL_SESSION") {
        return
      }

      if (event === "SIGNED_IN" && session?.user) {
        if (isCheckingSession.current || user?.id) {
          return
        }

        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, username, email, role, faction")
            .eq("auth_uuid", session.user.id)
            .maybeSingle()

          if (userError || !userData) {
            return
          }

          const gameStateData = await fetchGameState(userData.id)

          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            faction: userData.faction || "Sin Facción",
          })
          setGameState(gameStateData)
          setIsLoggedIn(true)

          console.log("[MAGELORD] ✅ Login completado")
          window.scrollTo({ top: 0, behavior: 'smooth' })

          if (gameStateData && Number(gameStateData.province_id) > 0) {
            setupRealtimeSubscriptions(gameStateData.province_id.toString(), userData.id)
          }
        } catch (error) {
          console.error("[MAGELORD] ❌ Error en login:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (event === "SIGNED_OUT") {
        console.log("[MAGELORD] 🚪 Sesión cerrada")
        setUser(null)
        setGameState(null)
        setIsLoggedIn(false)
        setActivePage("portada")
        localStorage.clear()
        sessionStorage.clear()
      }
    })

    return () => subscription.unsubscribe()
  }, [toast, user?.id])

  // ==========================================================================
  // EFFECT - GUARDAR PÁGINA ACTIVA
  // ==========================================================================
  useEffect(() => {
    if (isLoggedIn && activePage) {
      localStorage.setItem("magelord_active_page", activePage)
    }
  }, [activePage, isLoggedIn])

  // ==========================================================================
  // HANDLER - LOGOUT
  // ==========================================================================
  const handleLogout = async () => {
    try {
      console.log("[MAGELORD] 🚪 Cerrando sesión...")

      setUser(null)
      setGameState(null)
      setIsLoggedIn(false)
      setActivePage("portada")

      localStorage.clear()
      sessionStorage.clear()

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("[MAGELORD] ❌ Error en logout:", error)
        toast({
          title: "Advertencia",
          description: "Sesión cerrada localmente",
          variant: "destructive",
        })
      } else {
        console.log("[MAGELORD] ✅ Logout exitoso")
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente",
        })
      }
    } catch (error) {
      console.error("[MAGELORD] ❌ Error inesperado en logout:", error)
    }
  }

  // ==========================================================================
  // HANDLER - RECARGAR ESTADO DEL JUEGO
  // ==========================================================================
  const reloadGameState = async () => {
    if (!user?.id) return

    try {
      const gameStateData = await fetchGameState(user.id)
      if (gameStateData) {
        setGameState(gameStateData)
      }
    } catch (error) {
      console.error("[MAGELORD] ❌ Error recargando estado:", error)
    }
  }

  // ==========================================================================
  // HANDLER - NAVEGACIÓN DESDE FOOTER
  // ==========================================================================
  const handleFooterPage = (page: string) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (!isLoggedIn && (page === "portada" || page === "noticias")) {
      setActiveMenu(page as "portada" | "noticias" | "login")
    }
  }

  // ==========================================================================
  // HANDLER - LOGIN EXITOSO
  // ==========================================================================
  const handleLoginSuccess = (userData: any, provinceData: any) => {
    setUser(userData)
    setGameState(provinceData)
    setIsLoggedIn(true)
    setActivePage("portada")
  }

  // ==========================================================================
  // FUNCIÓN - RENDERIZAR PÁGINA ACTIVA
  // ==========================================================================
  const renderActivePage = () => {
    switch (activePage) {
      // ======================================================================
      // PÁGINAS PÚBLICAS
      // ======================================================================
      case "portada":
        return <PortadaPage language={language} />
      case "noticias":
        return <NoticiasPage language={language} />

      // ======================================================================
      // PÁGINAS DE JUEGO - PROVINCIA
      // ======================================================================
      case "estado":
        return <EstadoPage language={language} gameState={gameState!} />
      case "provincia":
        return <ProvinciaPage language={language} province={gameState!} user={user} onProvinceUpdate={setGameState} />
      case "exploracion":
        return <ExploracionPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "construir":
        return <ConstruirPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "demoler":
        return <DemolerPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "investigacion":
        return <InvestigacionPage language={language} gameState={gameState!} user={user} onUpdate={reloadGameState} />

      // ======================================================================
      // PÁGINAS DE JUEGO - EJÉRCITO
      // ======================================================================
      case "reclutar":
        return <ReclutarPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "sala-guerra":
        return <SalaGuerraPage language={language} gameState={gameState!} user={user} reloadGameState={reloadGameState}/>
      case "historial":
        return <HistorialPage language={language} />
      case "defensa":
        return <DefensaPage language={language} gameState={gameState!} user={user} onUpdate={reloadGameState} />

      // ======================================================================
      // PÁGINAS DE JUEGO - MAGIA
      // ======================================================================
      case "hechizos":
        return <HechizosPage language={language} gameState={gameState!} user={user} />
      case "libro-hechizos":
        return <MagiaPage language={language} gameState={gameState!} user={user} />
      case "rituales":
        return <RitualesPage language={language} gameState={gameState!} user={user} />
      case "cooldowns":
      case "hechizos-activos":
        return <HechizosActivosPage language={language} gameState={gameState!} />

      // ======================================================================
      // PÁGINAS DE JUEGO - COMERCIO
      // ======================================================================
      case "mercado-global":
        return <MercadoGlobalPage language={language} province={gameState} user={user} />
      case "mercado-negro":
        return <MercadoNegroPage language={language} province={gameState} user={user} gameState={gameState} />

      // ======================================================================
      // PÁGINAS DE JUEGO - DIPLOMACIA
      // ======================================================================
      case "mensajes":
        return <MensajesPage language={language} />
      case "gremios":
        return <GremiosPage language={language} />
      case "rankings":
        return <RankingsPage language={language} gameState={gameState!} />
      case "ranking-global":
        return <RankingGlobalPage language={language} />
      case "alianzas":
        return <AlianzasPage language={language} />
      case "foro":
        return <ForoPage language={language} />

      // ======================================================================
      // PÁGINAS DE USUARIO
      // ======================================================================
      case "perfil":
        return <PerfilPage language={language} user={user} gameState={gameState} />
      case "ajustes":
        return <AjustesPage language={language} user={user} setLanguage={setLanguage} />

      // ======================================================================
      // PANEL DE ADMINISTRACIÓN (CENTRAL)
      // ======================================================================
      case "admin-dashboard":
        return <AdminDashboardPage language={language} userRole={gameState?.role as UserRole} onNavigate={setActivePage} />

      // ======================================================================
      // ADMINISTRACIÓN GENERAL (admin + owner)
      // ======================================================================
      case "usuarios-admin":
        return <UsuariosAdminPage language={language} />
      case "roles-admin":
        return <RolesAdminPage language={language} />
      case "bans-admin":
        return <BansAdminPage language={language} />
      case "fixes-admin":
        return <FixesAdminPage language={language} />
      case "logs-admin":
        return <LogsAdminPage language={language} />

      // ======================================================================
      // ADMINISTRACIÓN WEB (web_admin + admin + owner)
      // ======================================================================
      case "noticias-admin":
        return <NoticiasAdminPage language={language} />
      case "anuncios-admin":
        return <AnunciosAdminPage language={language} />
      case "publicidad-admin":
        return <PublicidadAdminPage language={language} user={user} />
      case "broadcast-admin":
        return <BroadcastAdminPage language={language} />

      // ======================================================================
      // ADMINISTRACIÓN FORO (forum_admin + admin + owner)
      // ======================================================================
      // TODO: Implementar estas páginas
      case "foro-posts-admin":
      case "foro-reportes-admin":
      case "foro-bans-admin":
      case "foro-logs-admin":
        return (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-[#d4af37] mb-4">
              {language === "es" ? "En Desarrollo" : "Under Development"}
            </h1>
            <p className="text-[#d4af37]/70">
              {language === "es" 
                ? "Esta funcionalidad estará disponible próximamente" 
                : "This feature will be available soon"}
            </p>
          </div>
        )

      // ======================================================================
      // CONTROL TOTAL (SOLO OWNER)
      // ======================================================================
      case "admin-cataclysm":
        return <AdminCataclysmPage language={language} user={user} onNavigate={setActivePage} />
      case "owner-logs":
        return <OwnerLogsPage language={language} />
      case "owner-noticias":
        return <OwnerNoticiasPage language={language} />
      case "owner-anuncios":
        return <OwnerAnunciosPage language={language} />
      case "owner-jugadores":
        return <OwnerJugadoresPage language={language} />

      // TODO: Implementar estas páginas
      case "database-admin":
      case "server-config":
      case "emergency-admin":
        return (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-green-400 mb-4">
              {language === "es" ? "🔒 Acceso Restringido - Owner" : "🔒 Restricted Access - Owner"}
            </h1>
            <p className="text-[#d4af37]/70">
              {language === "es" 
                ? "Esta funcionalidad crítica estará disponible próximamente" 
                : "This critical feature will be available soon"}
            </p>
          </div>
        )

      // ======================================================================
      // PÁGINAS DEL FOOTER
      // ======================================================================
      case "footer-wiki":
        return <GuiaPage language={language} />
      case "footer-about":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-[#d4af37]">
              {language === "es" ? "Acerca de MageLord" : "About MageLord"}
            </h1>
            <p className="text-[#d4af37]/80">
              {language === "es"
                ? "MageLord es un juego de estrategia medieval MMO donde controlas una provincia mágica..."
                : "MageLord is a medieval MMO strategy game where you control a magical province..."}
            </p>
          </div>
        )
      case "footer-cookies":
        return <CookiesPage language={language} />

      // Otras páginas del footer (placeholder)
      case "footer-changelog":
      case "footer-discord":
      case "footer-terms":
      case "footer-privacy":
      case "footer-conduct":
      case "footer-support":
      case "footer-server-time":
      case "footer-version":
      case "footer-population":
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#d4af37]">
              {activePage.replace("footer-", "").replace("-", " ").toUpperCase()}
            </h1>
            <p className="text-gray-400">
              {language === "es"
                ? "Esta sección estará disponible próximamente"
                : "This section will be available soon"}
            </p>
          </div>
        )

      // ======================================================================
      // PÁGINA POR DEFECTO
      // ======================================================================
      default:
        return <NoticiasPage language={language} />
    }
  }

  // ==========================================================================
  // RENDER - PANTALLA DE CARGA INICIAL
  // ==========================================================================
  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="text-[#d4af37] text-xl font-semibold">
            {language === "es" ? "Cargando MageLord..." : "Loading MageLord..."}
          </p>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // RENDER - USUARIO AUTENTICADO
  // ==========================================================================
  if (isLoggedIn && user && gameState) {
    const userRoles: UserRole[] = [gameState.role as UserRole]

    const safeGameState = {
      ...gameState,
      gold: Number(gameState.gold || 0),
      mana: Number(gameState.mana || 0),
      food: Number(gameState.food || 0),
      turns: Number(gameState.turns || 0),
      acres: Number(gameState.acres || 0),
      population: Number(gameState.population || 0),
      networth: Number(gameState.networth || 0),
      attack: Number(gameState.attack || 0),
      defense: Number(gameState.defense || 0),
    }

    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[#d4af37]">
        <GameHeader isHomePage={false} />

        <GameNavbarDynamic
          activePage={activePage}
          setActivePage={setActivePage}
          language={language}
          setLanguage={setLanguage}
          onLogout={handleLogout}
          username={user.username}
          userRoles={userRoles}
        />

        <div className="flex flex-1">
          <FixedSidebarLeft language={language} gameState={safeGameState} user={user} />

          <main className="flex-1 p-6 overflow-y-auto">{renderActivePage()}</main>

          <FixedSidebarRight language={language} setActivePage={setActivePage} gameState={safeGameState} />
        </div>

        <GameFooter language={language} onPageChange={handleFooterPage} />
      </div>
    )
  }

  // ==========================================================================
  // RENDER - USUARIO NO AUTENTICADO (PRE-LOGIN)
  // ==========================================================================
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[#d4af37]">
      <GameHeader isHomePage={activeMenu === "portada"} />

      <GameNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} language={language} setLanguage={setLanguage} />

      <div className="flex-1 grid grid-cols-[250px_1fr_250px]">
        <SidebarLeft />

        <div className="px-4 py-6 overflow-y-auto">
          <MainContent
            language={language}
            setUser={setUser}
            setProvince={setGameState}
            setIsLoggedIn={setIsLoggedIn}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            activePage={activePage}
            onPageChange={handleFooterPage}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>

        <SidebarRight />
      </div>

      <GameFooter language={language} onPageChange={handleFooterPage} />
    </div>
  )
}