"use client"

import { useState, useEffect, useRef } from "react"
// --- ESTRUCTURA Y NAVEGACIÓN ---
import { GameHeader } from "@/components/game-header"
import { GameNavbar } from "@/components/game-navbar"
import { GameNavbarDynamic } from "@/components/game-navbar-dynamic"
import { FixedSidebarLeft } from "@/components/fixed-sidebar-left"
import { FixedSidebarRight } from "@/components/fixed-sidebar-right"
import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
import { MainContent } from "@/components/main-content"
import { GameFooter } from "@/components/game-footer"

// --- PÁGINAS DE JUEGO ---
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
import { HechizosActivosPage } from "@/components/pages/hechizos-activos-page"
import { PortadaPage } from "@/components/pages/portada-page"
import { MensajesPage } from "@/components/pages/mensajes-page"
import { GremiosPage } from "@/components/pages/gremios-page"
import { AdminCataclysmPage } from "@/components/pages/admin-cataclysm-page"

// --- PÁGINAS DEL FOOTER (MODULARES) ---
import { GuiaPage } from "@/components/pages/guia-page"
import { CookiesPage } from "@/components/pages/cookies-page"
import { AboutPage } from "@/components/pages/about-page"
import { SupportPage } from "@/components/pages/support-page"
import { TermsPage } from "@/components/pages/terms-page"
import { PrivacyPage } from "@/components/pages/privacy-page"
import { ConductPage } from "@/components/pages/conduct-page"
import { ChangelogPage } from "@/components/pages/changelog-page"
import { SocialPage } from "@/components/pages/social-page"

// --- LIBRERÍAS Y SEGURIDAD ---
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

  // ==========================================
  // REGENERACIÓN AUTOMÁTICA DE RECURSOS
  // ==========================================
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return

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
    }, 60000)

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
    }, 30000)

    return () => {
      console.log("[v0] ⏰ Stopping automatic resource regeneration timers")
      clearInterval(intervalId)
      clearInterval(backupIntervalId)
    }
  }, [isLoggedIn, user?.id, gameState?.province_id])

  // ==========================================
  // GESTIÓN DE SESIÓN Y REALTIME
  // ==========================================
  useEffect(() => {
    const checkSession = async () => {
      if (isCheckingSession.current) {
        console.log("[v0] ⚠️ Session check already in progress, skipping")
        return
      }
      isCheckingSession.current = true
      console.log("[v0] 🔐 Checking for existing session...")

      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("[v0] ✓ Session found - Auth UUID:", session.user.id)
          
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

          // Lazy update al conectar
          const { error: rpcError } = await supabase.rpc("ejecutar_actualizacion_pendiente", {
            p_user_id: userData.id,
          })

          if (rpcError) {
            console.log("[v0] ℹ️ Lazy update not available yet")
          } else {
            console.log("[v0] ⚡ Lazy update executed successfully")
          }

          const gameStateData = await fetchGameState(userData.id)
          console.log("[v0] ✅ Game state loaded")

          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            faction: userData.faction || "Sin Facción",
          })
          setGameState(gameStateData)
          setIsLoggedIn(true)

          const savedPage = localStorage.getItem("magelord_active_page")
          if (savedPage) setActivePage(savedPage)

          window.scrollTo({ top: 0, behavior: 'smooth' })

          if (gameStateData && Number(gameStateData.province_id) > 0) {
            setupRealtimeSubscriptions(gameStateData.province_id.toString(), userData.id)
          }
        } else {
          console.log("[v0] ℹ️ No session found")
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error("[v0] ❌ Session check error:", error)
        setIsLoggedIn(false)
      } finally {
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
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "provinces", filter: `id=eq.${provinceIdString}` },
        async (payload) => {
          console.log("[v0] 🔄 Province updated via Realtime:", payload.new)
          const data = await fetchGameState(userId)
          if (data) setGameState(data)
        }
      ).subscribe()

    const usersChannel = supabase
      .channel(`users:${userId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "users", filter: `id=eq.${userId}` },
        (payload) => {
          console.log("[v0] 👤 User role updated:", payload.new.role)
          setUser((prev: any) => ({ ...prev, role: payload.new.role }))
          setGameState((prev) => prev ? { ...prev, role: payload.new.role } : null)
          
          if (payload.new.role === "owner" || payload.new.role === "admin") {
            toast({ title: "Acceso Actualizado", description: `Rol: ${payload.new.role}` })
          }
        }
      ).subscribe()

    return () => {
      console.log("[v0] 🔴 Cleaning up Realtime subscriptions...")
      provincesChannel.unsubscribe()
      usersChannel.unsubscribe()
    }
  }

  // ==========================================
  // ENRUTADOR DE PÁGINAS (PÁGINAS INDIVIDUALES)
  // ==========================================
  const renderActivePage = () => {
    // Bloque Footer modular
    if (activePage.startsWith("footer-")) {
      switch (activePage) {
        case "footer-wiki": return <GuiaPage language={language} />
        case "footer-about": return <AboutPage language={language} />
        case "footer-cookies": return <CookiesPage language={language} />
        case "footer-support": return <SupportPage language={language} />
        case "footer-terms": return <TermsPage language={language} />
        case "footer-privacy": return <PrivacyPage language={language} />
        case "footer-conduct": return <ConductPage language={language} />
        case "footer-changelog": return <ChangelogPage language={language} />
        case "footer-discord": return <SocialPage language={language} />
        case "footer-tavern": return <ForoPage language={language} />
        default: return (
          <div className="p-8 text-center border border-[#d4af37]/20 bg-black/40 rounded-lg">
            <h1 className="text-2xl font-bold text-[#d4af37] mb-4 uppercase">
              {activePage.replace("footer-", "").replace("-", " ")}
            </h1>
            <p className="text-gray-400">Esta sección técnica se está cargando desde el Códice Arcano...</p>
          </div>
        )
      }
    }

    // Bloque Juego
    switch (activePage) {
      case "portada": return <PortadaPage language={language} />
      case "noticias": return <NoticiasPage language={language} />
      case "mensajes": return <MensajesPage language={language} />
      case "estado": return <EstadoPage language={language} gameState={gameState!} />
      case "provincia": return <ProvinciaPage language={language} province={gameState!} user={user} onProvinceUpdate={setGameState} />
      case "exploracion": return <ExploracionPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "construir": return <ConstruirPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "demoler": return <DemolerPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "investigacion": return <InvestigacionPage language={language} gameState={gameState!} user={user} />
      case "reclutar": return <ReclutarPage language={language} gameState={gameState!} onUpdate={reloadGameState} />
      case "sala-guerra": return <SalaGuerraPage language={language} gameState={gameState!} user={user} reloadGameState={reloadGameState}/>
      case "historial": return <HistorialPage language={language} />
      case "defensa": return <DefensaPage language={language} gameState={gameState!} user={user} onUpdate={reloadGameState} />
      case "hechizos": return <HechizosPage language={language} gameState={gameState!} user={user} />
      case "libro-hechizos": return <MagiaPage language={language} gameState={gameState!} user={user} />
      case "rituales": return <RitualesPage language={language} gameState={gameState!} user={user} />
      case "cooldowns":
      case "hechizos-activos": return <HechizosActivosPage language={language} gameState={gameState!} />
      case "rankings": return <RankingsPage language={language} gameState={gameState!} />
      case "alianzas": return <AlianzasPage language={language} />
      case "gremios": return <GremiosPage language={language} />
      case "mercado-global": return <MercadoGlobalPage language={language} province={gameState} user={user} />
      case "mercado-negro": return <MercadoNegroPage language={language} province={gameState} user={user} gameState={gameState!} />
      case "foro": return <ForoPage language={language} />
      case "perfil": return <PerfilPage language={language} user={user} />
      case "ajustes": return <AjustesPage language={language} user={user} setLanguage={setLanguage} />
      case "ranking-global": return <RankingGlobalPage language={language} />
      case "admin-cataclysm": return <AdminCataclysmPage language={language} user={user} onNavigate={setActivePage} />
      default: return <NoticiasPage language={language} />
    }
  }

  const reloadGameState = async () => {
    if (!user?.id) return
    const data = await fetchGameState(user.id)
    if (data) setGameState(data)
  }

  const handleLogout = async () => {
    setUser(null); setGameState(null); setIsLoggedIn(false); setActivePage("portada");
    localStorage.clear(); sessionStorage.clear();
    await supabase.auth.signOut()
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente" })
  }

  const handleFooterPage = (page: string) => {
    setActivePage(page)
    if (!isLoggedIn && (page === "portada" || page === "noticias")) {
      setActiveMenu(page as "portada" | "noticias" | "login")
    }
  }

  if (!mounted) return null

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

  // INTERFAZ DE USUARIO AUTENTICADO
  if (isLoggedIn && user && gameState) {
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
          activePage={activePage} setActivePage={setActivePage} 
          language={language} setLanguage={setLanguage} 
          onLogout={handleLogout} username={user.username} 
          userRoles={[gameState.role as UserRole]} 
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

  // INTERFAZ DE PORTADA (SIN LOGIN)
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[#d4af37]">
      <GameHeader isHomePage={activeMenu === "portada"} />
      <GameNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} language={language} setLanguage={setLanguage} />
      <div className="flex-1 grid grid-cols-[250px_1fr_250px]">
        <SidebarLeft />
        <div className="px-4 py-6 overflow-y-auto">
          <MainContent
            language={language} setUser={setUser} setProvince={setGameState} 
            setIsLoggedIn={setIsLoggedIn} activeMenu={activeMenu} 
            setActiveMenu={setActiveMenu} activePage={activePage} 
            onPageChange={handleFooterPage} 
            onLoginSuccess={(u, p) => { setUser(u); setGameState(p); setIsLoggedIn(true); setActivePage("portada"); }} 
          />
        </div>
        <SidebarRight />
      </div>
      <GameFooter language={language} onPageChange={handleFooterPage} />
    </div>
  )
}