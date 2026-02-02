"use client"

import type React from "react"
import PortadaPage from "@/components/pages/portada-page"
import NoticiasPage from "@/components/pages/noticias-page"
import { supabase } from "@/lib/supabaseClient"

/**
 * main-content.tsx
 * Responsabilidad: Contenido central dinámico con vistas Inicio/Noticias/Login-Registro/Guía.
 * Decisiones: Vista Login incluye toggle interno entre login y registro con facciones.
 * Límites: Recibe activeMenu y callbacks como props, no persiste datos (placeholder).
 * Supuestos: Facciones hardcodeadas según especificación del juego (8 razas).
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface MainContentProps {
  language: Language
  setUser: (user: any) => void
  setProvince: (province: any) => void
  setIsLoggedIn: (val: boolean) => void
  activeMenu?: "portada" | "noticias" | "login"
  setActiveMenu?: (menu: "portada" | "noticias" | "login") => void
  activePage?: string
  onPageChange?: (page: string) => void
  onLoginSuccess?: (user: any, province: any) => void
}

export function MainContent({
  language,
  setUser,
  setProvince,
  setIsLoggedIn,
  activeMenu: parentActiveMenu,
  setActiveMenu: parentSetActiveMenu,
  activePage,
  onPageChange,
  onLoginSuccess,
}: MainContentProps) {
  const t = useTranslation(language)

  const [localActiveMenu, setLocalActiveMenu] = useState<"portada" | "noticias" | "login">("portada")
  const activeMenu = parentActiveMenu ?? localActiveMenu
  const setActiveMenu = parentSetActiveMenu ?? setLocalActiveMenu

  const [showRegister, setShowRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState("")

  const [regUsername, setRegUsername] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("")
  const [regProvinceName, setRegProvinceName] = useState("")
  const [regFaction, setRegFaction] = useState("infernal")
  const [regBio, setRegBio] = useState("")
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState("")

  const [regClass, setRegClass] = useState<"paladin" | "guerrero" | "mago" | "cazador" | "picaro">("guerrero")
  const [regAlignment, setRegAlignment] = useState<"luz" | "oscuridad" | "neutral">("neutral")

  const factions = [
    { id: "infernal", name: t.infernal, description: t.infernal_desc },
    { id: "celestial", name: t.celestial, description: t.celestial_desc },
    { id: "sangre", name: t.sangre, description: t.sangre_desc },
    { id: "destruccion", name: t.destruccion, description: t.destruccion_desc },
    { id: "ultratumba", name: t.ultratumba, description: t.ultratumba_desc },
    { id: "escama", name: t.escama, description: t.escama_desc },
    { id: "asuryan", name: t.asuryan, description: t.asuryan_desc },
    { id: "hierro", name: t.hierro, description: t.hierro_desc },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginSuccess("")
    setLoginLoading(true)

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (signInError) {
        setLoginError(language === "es" ? "Email o contraseña incorrectos" : "Invalid email or password")
        return
      }

      if (!authData.session) {
        setLoginError(language === "es" ? "Error al iniciar sesión" : "Login failed")
        return
      }

      setLoginSuccess(
        language === "es" ? "Inicio de sesión exitoso. Redirigiendo..." : "Login successful. Redirecting...",
      )
    } catch (error) {
      console.error("[v0] Login error:", error)
      setLoginError(language === "es" ? "Error de conexión. Intenta nuevamente." : "Connection error. Try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (regPassword !== regPasswordConfirm) {
      setRegError(t.passwordMismatch)
      return
    }

    setRegLoading(true)
    setRegError("")
    setRegSuccess("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          username: regUsername,
          faction: regFaction,
          class: regClass,
          alignment: regAlignment,
          provinceName: regProvinceName,
          bio: regBio,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setRegError(data.error || (language === "es" ? "Error al crear la cuenta" : "Error creating account"))
        return
      }

      setRegSuccess(
        language === "es"
          ? "Cuenta creada exitosamente. Iniciando sesión..."
          : "Account created successfully. Logging in...",
      )

      setTimeout(async () => {
        try {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: regEmail,
            password: regPassword,
          })

          if (loginError) {
            console.error("[v0] Auto-login error after registration:", loginError)
            setRegError(language === "es" ? "Error al iniciar sesión automáticamente" : "Error auto-logging in")
            setShowRegister(false)
            return
          }

          console.log("[v0] ✅ Auto-login successful after registration")
          // onAuthStateChange will handle loading the user data
        } catch (error) {
          console.error("[v0] Auto-login exception:", error)
          setShowRegister(false)
        }
      }, 1000)
    } catch (error) {
      console.error("[v0] Register error:", error)
      setRegError(language === "es" ? "Error de conexión. Intenta nuevamente." : "Connection error. Try again.")
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <main className="space-y-4">
      {activePage?.startsWith("footer-") ? (
        <div className="border-[#d4af37]/20 bg-black/60 rounded-lg">
          <FooterContentPage language={language} section={activePage} onBack={() => onPageChange?.("portada")} />
        </div>
      ) : (
        <>
          {activeMenu === "portada" && (
            <div className="border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-black rounded-lg">
              <PortadaPage language={language} />
            </div>
          )}

          {activeMenu === "noticias" && (
            <div className="border-[#d4af37]/20 bg-black/60 rounded-lg">
              <NoticiasPage language={language} />
            </div>
          )}

          {activeMenu === "login" && (
            <div className="w-full max-w-2xl mx-auto">
              {!showRegister ? (
                <Card className="w-full border-[#d4af37]/30 bg-black/60">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl text-[#d4af37]">{t.loginTitle}</CardTitle>
                    <CardDescription className="text-center text-[#d4af37]/70">{t.loginSubtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      {loginError && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                          {loginError}
                        </div>
                      )}
                      {loginSuccess && (
                        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
                          {loginSuccess}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#d4af37]">
                          {t.email}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          disabled={loginLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-[#d4af37]">
                          {t.password}
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40 pr-10"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            disabled={loginLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90"
                        disabled={loginLoading}
                      >
                        {loginLoading ? t.loggingIn : t.loginButton}
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-[#d4af37]/20" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-[#0a0a0a] px-2 text-[#d4af37]/60">{t.noAccount}</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
                        onClick={() => setShowRegister(true)}
                        disabled={loginLoading}
                      >
                        {t.createAccount}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="w-full border-[#d4af37]/30 bg-black/60">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl text-[#d4af37]">{t.registerTitle}</CardTitle>
                    <CardDescription className="text-center text-[#d4af37]/70">{t.registerSubtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      {regError && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                          {regError}
                        </div>
                      )}
                      {regSuccess && (
                        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
                          {regSuccess}
                        </div>
                      )}

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="reg-username" className="text-[#d4af37]">
                            {t.username}
                          </Label>
                          <Input
                            id="reg-username"
                            type="text"
                            placeholder={t.usernamePlaceholder}
                            className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            required
                            disabled={regLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email" className="text-[#d4af37]">
                            {t.email}
                          </Label>
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="tu@email.com"
                            className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                            disabled={regLoading}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="reg-password" className="text-[#d4af37]">
                            {t.password}
                          </Label>
                          <div className="relative">
                            <Input
                              id="reg-password"
                              type={showRegPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40 pr-10"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              required
                              minLength={6}
                              disabled={regLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
                            >
                              {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password-confirm" className="text-[#d4af37]">
                            {t.confirmPassword}
                          </Label>
                          <div className="relative">
                            <Input
                              id="reg-password-confirm"
                              type={showRegConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40 pr-10"
                              value={regPasswordConfirm}
                              onChange={(e) => setRegPasswordConfirm(e.target.value)}
                              required
                              minLength={6}
                              disabled={regLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
                            >
                              {showRegConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-province" className="text-[#d4af37]">
                          {t.provinceName}
                        </Label>
                        <Input
                          id="reg-province"
                          type="text"
                          placeholder={t.provinceNamePlaceholder}
                          className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40"
                          value={regProvinceName}
                          onChange={(e) => setRegProvinceName(e.target.value)}
                          required
                          disabled={regLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#d4af37]">{t.class}</Label>
                        <p className="text-xs text-[#d4af37]/60">{t.classDescription}</p>
                        <RadioGroup
                          value={regClass}
                          onValueChange={(value) => setRegClass(value as any)}
                          disabled={regLoading}
                        >
                          <div className="space-y-2 bg-black/40 p-3 rounded-md border border-[#d4af37]/20">
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="paladin" id="paladin" />
                              <Label htmlFor="paladin" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.paladin}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.paladin_desc}</p>
                              </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="guerrero" id="guerrero" />
                              <Label htmlFor="guerrero" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.warrior}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.warrior_desc}</p>
                              </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="mago" id="mago" />
                              <Label htmlFor="mago" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.mage}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.mage_desc}</p>
                              </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="cazador" id="cazador" />
                              <Label htmlFor="cazador" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.hunter}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.hunter_desc}</p>
                              </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="picaro" id="picaro" />
                              <Label htmlFor="picaro" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.rogue}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.rogue_desc}</p>
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#d4af37]">{t.alignment}</Label>
                        <p className="text-xs text-[#d4af37]/60">{t.alignmentDescription}</p>
                        <RadioGroup
                          value={regAlignment}
                          onValueChange={(value) => setRegAlignment(value as any)}
                          disabled={regLoading}
                        >
                          <div className="space-y-2 bg-black/40 p-3 rounded-md border border-[#d4af37]/20">
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="luz" id="luz" />
                              <Label htmlFor="luz" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.light}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.light_desc}</p>
                              </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="oscuridad" id="oscuridad" />
                              <Label htmlFor="oscuridad" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.darkness}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.darkness_desc}</p>
                              </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="neutral" id="neutral" />
                              <Label htmlFor="neutral" className="flex-1 cursor-pointer text-sm">
                                <div className="text-[#d4af37]">{t.neutral}</div>
                                <p className="text-xs text-[#d4af37]/60">{t.neutral_desc}</p>
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#d4af37]">{t.faction}</Label>
                        <p className="text-xs text-[#d4af37]/60">{t.factionDescription}</p>
                        <RadioGroup value={regFaction} onValueChange={setRegFaction} disabled={regLoading}>
                          <ScrollArea className="h-[200px] rounded-md border border-[#d4af37]/20 p-3">
                            <div className="space-y-2">
                              {factions.map((faction) => (
                                <div key={faction.id} className="flex items-start space-x-2">
                                  <RadioGroupItem value={faction.id} id={faction.id} className="mt-1" />
                                  <Label
                                    htmlFor={faction.id}
                                    className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    <div className="text-[#d4af37]">{faction.name}</div>
                                    <p className="mt-1 text-xs text-[#d4af37]/60">{faction.description}</p>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-bio" className="text-[#d4af37]">
                          {t.bio}
                        </Label>
                        <Textarea
                          id="reg-bio"
                          placeholder={t.bioPlaceholder}
                          className="border-[#d4af37]/30 bg-black/40 text-[#d4af37] placeholder:text-[#d4af37]/40 min-h-[80px]"
                          value={regBio}
                          onChange={(e) => setRegBio(e.target.value)}
                          disabled={regLoading}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90"
                        disabled={regLoading}
                      >
                        {regLoading ? t.registering : t.registerButton}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-[#d4af37]/20" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-[#0a0a0a] px-2 text-[#d4af37]/60">{t.haveAccount}</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
                        onClick={() => setShowRegister(false)}
                        disabled={regLoading}
                      >
                        {t.backToLogin}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
