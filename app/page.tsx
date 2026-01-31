"use client"

import { useState, useEffect, useRef } from "react"
import { GameHeader } from "@/components/game-header"
import { GameNavbar } from "@/components/game-navbar"
import { GameNavbarDynamic } from "@/components/game-navbar-dynamic"
import { FixedSidebarLeft } from "@/components/fixed-sidebar-left"
import { FixedSidebarRight } from "@/components/fixed-sidebar-right"
import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
import { MainContent } from "@/components/main-content"
import { GameFooter } from "@/components/game-footer"
import { NoticiasPage } from "@/components/pages/noticias-page"
import { EstadoPage } from "@/components/pages/estado-page"
import { ProvinciaPage } from "@/components/pages/provincia-page"
import { ExploracionPage } from "@/components/pages/exploracion-page"
import { ConstruirPage } from "@/components/pages/construir-page"
import { DemolerPage } from "@/components/pages/demoler-page"
import { InvestigacionPage } from "@/components/pages/investigacion-page"
import { ReclutarPage } from "@/components/pages/reclutar-page"
import { SalaGuerraPage } from "@/components/pages/sala-guerra-page"
import { HistorialPage } from "@/components/pages/historial-page"
import { DefensaPage } from "@/components/pages/defensa-page"
import { HechizosPage } from "@/components/pages/hechizos-page"
import { RitualesPage } from "@/components/pages/rituales-page"
import { MagiaPage } from "@/components/pages/magia-page"
import { MercadoGlobalPage } from "@/components/pages/mercado-global-page"
import { MercadoNegroPage } from "@/components/pages/mercado-negro-page"
import { RankingsPage } from "@/components/pages/rankings-page"
import { AlianzasPage } from "@/components/pages/alianzas-page"
import { ForoPage } from "@/components/pages/foro-page"
import { PerfilPage } from "@/components/pages/perfil-page"
import { AjustesPage } from "@/components/pages/ajustes-page"
import { RankingGlobalPage } from "@/components/pages/ranking-global-page"
import { GuiaPage } from "@/components/pages/guia-page" // Import GuiaPage component
import { HechizosActivosPage } from "@/components/pages/hechizos-activos-page"
import { PortadaPage } from "@/components/pages/portada-page"
import { MensajesPage } from "@/components/pages/mensajes-page"
import { GremiosPage } from "@/components/pages/gremios-page"
import { AdminCataclysmPage } from "@/components/pages/admin-cataclysm-page" // Import AdminCataclysmPage component
import type { Language } from "@/lib/i18n"
import type { UserRole } from "@/lib/roles"
import { fetchGameState, type GameState } from "@/lib/game-state"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"

export default function MageLordGame() {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>("es")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeMenu, setActiveMenu] = useState<"portada" | "noticias" | "login">("portada")
  const [activePage, setActivePage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("magelord_active_page")
      return saved || "noticias"
    }
    return "noticias"
  })
  const [user, setUser] = useState<any>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loginError, setLoginError] = useState<string>("")
  const { toast } = useToast()
  const isCheckingSession = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      return
    }

    console.log("[v0] ⏰ Starting automatic resource regeneration timer (60s)")

    const intervalId = setInterval(async () => {
      console.log("[v0] 🔄 Running automatic resource update...")

      try {
        if (user?.id && gameState?.province_id) {
          const { error: rpcError } = await supabase.rpc("update_population_growth", {
            p_province_id: gameState.province_id,
          })

          if (rpcError) {
            console.error("[v0] ❌ Population growth RPC error:", rpcError)
          } else {
            console.log("[v0] ✅ Population growth updated")
          }

          const gameStateData = await fetchGameState(user.id)
          if (gameStateData) {
            setGameState(gameStateData)
            console.log("[v0] ⚡ Automatic resources updated successfully")
          }
        }
      } catch (error) {
        console.error("[v0] ❌ Error in automatic update:", error)
      }
    }, 60000) // 60 seconds

    console.log("[v0] ⏰ Starting backup resource regeneration timer (30s)")

    const backupIntervalId = setInterval(async () => {
      console.log("[v0] 🔄 Running backup resource reload...")

      try {
        const gameStateData = await fetchGameState(user.id)
        if (gameStateData) {
          setGameState(gameStateData)
          console.log("[v0] ⚡ Backup reload completed")
        }
      } catch (error) {
        console.error("[v0] ❌ Error in backup reload:", error)
      }
    }, 30000) // 30 seconds

    return () => {
      console.log("[v0] ⏰ Stopping automatic resource regeneration timer")
      clearInterval(intervalId)
      console.log("[v0] ⏰ Stopping backup resource regeneration timer")
      clearInterval(backupIntervalId)
    }
  }, [isLoggedIn, user?.id])

  useEffect(() => {
    const checkSession = async () => {
      if (isCheckingSession.current) {
        console.log("[v0] ⚠️ Session check already in progress, skipping")
        return
      }

      isCheckingSession.current = true
      console.log("[v0] 🔐 Checking for existing session...")

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("[v0] ✓ Session found - Auth UUID:", session.user.id)
          console.log("[v0] 📧 Email:", session.user.email)

          supabase.rpc("registrar_actividad", { p_auth_uuid: session.user.id }).then(({ error }) => {
            if (error) console.log("[v0] ℹ️ Activity registration not available yet")
          })

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, username, email, role, faction")
            .eq("auth_uuid", session.user.id)
            .maybeSingle()

          if (userError || !userData) {
            console.error("[v0] ❌ Failed to find user:", userError)
            throw new Error("User not found")
          }

          console.log("[v0] ✅ User found:", userData.username, "| Role:", userData.role)

          console.log("[v0] 🔄 Executing lazy update...")
          const { error: rpcError } = await supabase.rpc("ejecutar_actualizacion_pendiente", {
            p_user_id: userData.id,
          })

          if (rpcError) {
            console.log("[v0] ℹ️ Lazy update not available yet - execute create_lazy_update_function.sql to enable")
          } else {
            console.log("[v0] ⚡ Lazy update executed successfully")
          }

          console.log("[v0] 🔍 Fetching game state for user_id:", userData.id)
          const gameStateData = await fetchGameState(userData.id)
          console.log("[v0] ✅ Game state loaded")

          const safeGameState = gameStateData

          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            faction: userData.faction || "Sin Facción",
          })
          setGameState(safeGameState)
          setIsLoggedIn(true)

          const savedPage = localStorage.getItem("magelord_active_page")
          if (savedPage) {
            setActivePage(savedPage)
          }

          console.log("[v0] ✅ Session restored successfully")
          console.log("[v0] 👑 Acceso concedido como:", userData.role)
          window.scrollTo({ top: 0, behavior: 'smooth' })

          if (safeGameState && Number(safeGameState.province_id) > 0) {
            setupRealtimeSubscriptions(safeGameState.province_id.toString(), userData.id)
          }
        } else {
          console.log("[v0] ℹ️ No session found")
          localStorage.clear()
          sessionStorage.clear()
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error("[v0] ❌ Session check error:", error)
        localStorage.clear()
        sessionStorage.clear()
        setIsLoggedIn(false)
      } finally {
        console.log("[v0] ✅ Finalizing session check - removing loading screen")
        isCheckingSession.current = false
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const setupRealtimeSubscriptions = (provinceId: string, userId: string) => {
    console.log("[v0] 🔴 Setting up Realtime subscriptions...")

    const provinceIdString = String(provinceId)

    const provincesChannel = supabase
      .channel(`provinces:${provinceIdString}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "provinces",
          filter: `id=eq.${provinceIdString}`,
        },
        async (payload) => {
          console.log("[v0] 🔄 Province updated via Realtime:", payload.new)
          try {
            const gameStateData = await fetchGameState(userId)
            if (gameStateData) {
              setGameState(gameStateData)
              console.log("[v0] ✅ Game state reloaded after province UPDATE")
            }
          } catch (error) {
            console.error("[v0] ❌ Error reloading game state after province UPDATE:", error)
          }
        },
      )
      .subscribe()

    const unitsChannel = supabase
      .channel(`province_units:${provinceIdString}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "province_units",
          filter: `province_id=eq.${provinceIdString}`,
        },
        async (payload) => {
          console.log("[v0] 🪖 Province units changed via Realtime:", payload.eventType, payload.new || payload.old)

          try {
            const gameStateData = await fetchGameState(userId)
            if (gameStateData) {
              setGameState(gameStateData)
              console.log("[v0] ✅ Game state reloaded after troops change")
            }
          } catch (error) {
            console.error("[v0] ❌ Error reloading game state after troops change:", error)
          }
        },
      )
      .subscribe()

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
          console.log("[v0] 👤 User role updated:", payload.new.role)
          console.log("[v0] Mi rol es:", payload.new.role)

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
        },
      )
      .subscribe()

    return () => {
      console.log("[v0] 🔴 Cleaning up Realtime subscriptions...")
      provincesChannel.unsubscribe()
      unitsChannel.unsubscribe()
      usersChannel.unsubscribe()
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] 🔄 Auth event:", event)

      if (event === "INITIAL_SESSION") {
        console.log("[v0] ℹ️ INITIAL_SESSION event ignored - already handled in checkSession")
        return
      }

      if (event === "SIGNED_IN" && session?.user) {
        if (isCheckingSession.current) {
          console.log("[v0] ℹ️ SIGNED_IN event ignored - session check in progress")
          return
        }

        if (user?.id) {
          console.log("[v0] ℹ️ SIGNED_IN event ignored - user already authenticated")
          return
        }

        try {
          supabase.rpc("registrar_actividad", { p_auth_uuid: session.user.id }).then(({ error }) => {
            if (error) console.log("[v0] ℹ️ Activity registration not available yet")
          })

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, username, email, role, faction")
            .eq("auth_uuid", session.user.id)
            .maybeSingle()

          if (userError || !userData) {
            console.error("[v0] ❌ Failed to find user on SIGNED_IN:", userError)
            return
          }

          console.log("[v0] 🔄 Executing lazy update on sign in...")
          const { error: rpcError } = await supabase.rpc("ejecutar_actualizacion_pendiente", {
            p_user_id: userData.id,
          })

          if (rpcError) {
            console.log("[v0] ℹ️ Lazy update not available yet - execute create_lazy_update_function.sql to enable")
          } else {
            console.log("[v0] ⚡ Lazy update executed on sign in")
          }

          console.log("[v0] ✅ User loaded on SIGNED_IN:", userData.username)

          const gameStateData = await fetchGameState(userData.id)
          console.log("[v0] ✅ Game state loaded on SIGNED_IN")

          const safeGameState = gameStateData

          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            faction: userData.faction || "Sin Facción",
          })
          setGameState(safeGameState)

          setIsLoggedIn(true)
          console.log("[v0] ✅ Login complete")
          console.log("[v0] 👑 Acceso concedido como:", userData.role)
          window.scrollTo({ top: 0, behavior: 'smooth' })

          if (safeGameState && Number(safeGameState.province_id) > 0) {
            setupRealtimeSubscriptions(safeGameState.province_id.toString(), userData.id)
          }
        } catch (error) {
          console.error("[v0] ❌ Sign in error:", error)
        } finally {
          console.log("[v0] ✅ Finalizing SIGNED_IN - removing loading screen")
          setIsLoading(false)
        }
      } else if (event === "SIGNED_OUT") {
        console.log("[v0] 🚪 SIGNED_OUT event")
        setUser(null)
        setGameState(null)
        setIsLoggedIn(false)
        setActivePage("portada")
        localStorage.removeItem("magelord_active_page")
        localStorage.removeItem("magelord_session")
        localStorage.removeItem("supabase.auth.token")
        if (typeof window !== "undefined") {
          sessionStorage.clear()
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [toast, user?.id, isLoading])

  useEffect(() => {
    if (isLoggedIn && activePage) {
      localStorage.setItem("magelord_active_page", activePage)
    }
  }, [activePage, isLoggedIn])

  const handleLogout = async () => {
    try {
      console.log("[v0] 🚪 Logging out...")

      setUser(null)
      setGameState(null)
      setIsLoggedIn(false)
      setActivePage("portada")

      localStorage.clear()
      sessionStorage.clear()

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("[v0] ❌ Logout error:", error)
        toast({
          title: "Advertencia",
          description: "Sesión cerrada localmente, pero hubo un problema con el servidor",
          variant: "destructive",
        })
      } else {
        console.log("[v0] ✅ Logout successful")
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente",
        })
      }
    } catch (error) {
      console.error("[v0] ❌ Unexpected logout error:", error)
      toast({
        title: "Sesión cerrada",
        description: "Sesión cerrada localmente",
        variant: "destructive",
      })
    }
  }

  const reloadGameState = async () => {
    if (!user?.id) return

    try {
      const gameStateData = await fetchGameState(user.id)
      if (gameStateData) {
        setGameState(gameStateData)
      }
    } catch (error) {
      console.error("[v0] ❌ Error reloading game state:", error)
    }
  }

  const handleFooterPage = (page: string) => {
    setActivePage(page)
    if (!isLoggedIn && (page === "portada" || page === "noticias")) {
      setActiveMenu(page as "portada" | "noticias" | "login")
    }
  }

  const handleLoginSuccess = (userData: any, provinceData: any) => {
    setUser(userData)
    setGameState(provinceData)
    setIsLoggedIn(true)
    setActivePage("portada")

    fetchGameState(userData.id).then((state) => {
      if (state) {
        setGameState(state)
        console.log("[v0] Game state loaded successfully:", state)
      }
    })
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "portada":
        return <PortadaPage language={language} />
      case "noticias":
        return <NoticiasPage language={language} />
      case "mensajes":
        return <MensajesPage language={language} />
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
        return <InvestigacionPage language={language} gameState={gameState!} user={user} />
      case "reclutar":
        return <ReclutarPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "sala-guerra":
        return <SalaGuerraPage language={language} gameState={gameState!} user={user} reloadGameState={reloadGameState}/>
      case "historial":
        return <HistorialPage language={language} />
      case "defensa":
        return <DefensaPage language={language} gameState={gameState!} user={user} onUpdate={reloadGameState} />
      case "hechizos":
        return <HechizosPage language={language} gameState={gameState!} user={user} />
      case "libro-hechizos":
        return <MagiaPage language={language} gameState={gameState!} user={user} />
      case "rituales":
        return <RitualesPage language={language} gameState={gameState!} user={user} />
      case "cooldowns":
        return <HechizosActivosPage language={language} gameState={gameState!} />
      case "hechizos-activos":
        return <HechizosActivosPage language={language} gameState={gameState!} />
      case "rankings":
        return <RankingsPage language={language} gameState={gameState!} />
      case "alianzas":
        return <AlianzasPage language={language} />
      case "gremios":
        return <GremiosPage language={language} />
      case "mercado-global":
        return <MercadoGlobalPage language={language} province={gameState} user={user} />
      case "mercado-negro":
        return <MercadoNegroPage language={language} province={gameState} user={user} gameState={gameState} />
      case "foro":
        return <ForoPage language={language} />
      case "perfil":
        return <PerfilPage language={language} user={user} />
      case "ajustes":
        return <AjustesPage language={language} user={user} setLanguage={setLanguage} />
      case "ranking-global":
        return <RankingGlobalPage language={language} />
      case "footer-wiki":
        return <GuiaPage language={language} />
      case "footer-tavern":
        return <ForoPage language={language} />
      case "footer-changelog":
      case "footer-discord":
      case "footer-terms":
      case "footer-privacy":
      case "footer-conduct":
      case "footer-support":
      case "footer-server-time":
      case "footer-turn-counter":
      case "footer-version":
      case "footer-population":
        // For now, show a placeholder page - you can create specific pages later
        return (
          <div className="space-y-6">
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
      case "admin-cataclysm":
        return <AdminCataclysmPage language={language} user={user} onNavigate={setActivePage} />
      default:
        return <NoticiasPage language={language} />
    }
  }

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
          <p className="text-[#d4af37] text-xl font-semibold">Cargando Magelord...</p>
        </div>
      </div>
    )
  }

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
