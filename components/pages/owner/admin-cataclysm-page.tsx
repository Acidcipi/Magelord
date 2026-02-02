"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Flame, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AdminCataclysmPageProps {
  language: "es" | "en"
  user: any
  onNavigate?: (page: string) => void
}

export function AdminCataclysmPage({ language, user, onNavigate }: AdminCataclysmPageProps) {
  const { toast } = useToast()
  const [currentRound, setCurrentRound] = useState(1)
  const [nextCataclysm, setNextCataclysm] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.role !== "owner") {
      toast({
        title: "Acceso Denegado",
        description: "Solo el Owner puede acceder a esta página",
        variant: "destructive",
      })
      onNavigate?.("noticias")
      return
    }

    loadServerSettings()
  }, [user])

  const loadServerSettings = async () => {
    const { data: round } = await supabase.from("server_settings").select("value").eq("key", "current_round").single()

    const { data: date } = await supabase
      .from("server_settings")
      .select("value")
      .eq("key", "next_cataclysm_date")
      .single()

    if (round) setCurrentRound(Number(round.value) || 1)
    if (date) setNextCataclysm(date.value || "")
  }

  const handleScheduleCataclysm = async () => {
    if (!nextCataclysm) {
      toast({
        title: "Error",
        description: "Debes seleccionar una fecha",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase
      .from("server_settings")
      .upsert({ key: "next_cataclysm_date", value: nextCataclysm }, { onConflict: "key" })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Cataclismo Programado",
      description: `La fecha ha sido configurada para ${new Date(nextCataclysm).toLocaleDateString()}`,
    })
  }

  const handleExecuteCataclysm = async () => {
    if (confirmText !== "BORRAR TODO") {
      toast({
        title: "Confirmación incorrecta",
        description: "Debes escribir exactamente 'BORRAR TODO'",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.rpc("trigger_cataclysm")

      if (error) throw error

      toast({
        title: "Cataclismo Ejecutado",
        description: "El servidor ha sido reiniciado. Redirigiendo...",
      })

      setTimeout(() => {
        onNavigate?.("noticias")
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowConfirmDialog(false)
    }
  }

  if (user?.role !== "owner") return null

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-lg overflow-hidden">
        <img src="/apocalyptic-fire-destruction.jpg" alt="Cataclysm" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-red-500">
              {language === "es" ? "Control de Cataclismo" : "Cataclysm Control"}
            </h1>
          </div>
        </div>
      </div>

      <Card className="bg-[#1a1a1a] border-yellow-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-yellow-500">
            {language === "es" ? "Información de Ronda" : "Round Information"}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400">
              {language === "es" ? "Ronda Actual:" : "Current Round:"}{" "}
              <span className="text-[#d4af37] font-bold text-2xl">{currentRound}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cataclysm-date" className="text-[#d4af37]">
              {language === "es" ? "Fecha del Próximo Cataclismo" : "Next Cataclysm Date"}
            </Label>
            <Input
              id="cataclysm-date"
              type="datetime-local"
              value={nextCataclysm}
              onChange={(e) => setNextCataclysm(e.target.value)}
              className="bg-[#0f0f0f] border-[#d4af37]/30"
            />
          </div>

          <Button onClick={handleScheduleCataclysm} className="w-full bg-[#d4af37] hover:bg-[#f4cf5f] text-black">
            <Calendar className="h-5 w-5 mr-2" />
            {language === "es" ? "Programar Cataclismo" : "Schedule Cataclysm"}
          </Button>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Flame className="h-6 w-6 text-red-500 animate-pulse" />
          <h3 className="text-xl font-semibold text-red-500">
            {language === "es" ? "ZONA DE PELIGRO" : "DANGER ZONE"}
          </h3>
        </div>

        <p className="text-gray-300 mb-4">
          {language === "es"
            ? "Ejecutar el Cataclismo ahora borrará TODOS los datos de los jugadores, reiniciará el servidor y comenzará una nueva Ronda."
            : "Executing the Cataclysm now will DELETE ALL player data, reset the server, and start a new Round."}
        </p>

        <Button
          onClick={() => setShowConfirmDialog(true)}
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700"
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          {language === "es" ? "EJECUTAR CATACLISMO AHORA" : "EXECUTE CATACLYSM NOW"}
        </Button>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-[#1a1a1a] border-red-500">
          <DialogHeader>
            <DialogTitle className="text-red-500 text-2xl">
              {language === "es" ? "¡CONFIRMACIÓN FINAL!" : "FINAL CONFIRMATION!"}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {language === "es"
                ? "Esta acción NO SE PUEDE DESHACER. Todos los datos de los jugadores serán eliminados permanentemente."
                : "This action CANNOT BE UNDONE. All player data will be permanently deleted."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Label htmlFor="confirm-text" className="text-[#d4af37]">
              {language === "es" ? "Escribe 'BORRAR TODO' para confirmar:" : "Type 'BORRAR TODO' to confirm:"}
            </Label>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="bg-[#0f0f0f] border-red-500/50"
              placeholder="BORRAR TODO"
            />
          </div>

          <DialogFooter>
            <Button onClick={() => setShowConfirmDialog(false)} variant="outline">
              {language === "es" ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              onClick={handleExecuteCataclysm}
              disabled={loading || confirmText !== "BORRAR TODO"}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              {loading
                ? language === "es"
                  ? "Ejecutando..."
                  : "Executing..."
                : language === "es"
                  ? "Ejecutar"
                  : "Execute"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
