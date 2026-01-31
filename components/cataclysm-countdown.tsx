"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export function CataclysmCountdown() {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCataclysmDate()

    const interval = setInterval(() => {
      loadCataclysmDate()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const loadCataclysmDate = async () => {
    const { data } = await supabase.from("server_settings").select("value").eq("key", "next_cataclysm_date").single()

    if (data?.value) {
      const targetDate = new Date(data.value)
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        setCountdown({ days, hours, minutes })
      } else {
        setCountdown(null)
      }
    } else {
      setCountdown(null)
    }
  }

  if (!mounted || !countdown) return null

  return (
    <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30 p-4">
      <div className="flex items-center gap-3">
        <Flame className="h-6 w-6 text-red-400 animate-pulse" />
        <div>
          <p className="text-sm text-gray-400 font-semibold">El Fin de los Tiempos</p>
          <p className="text-lg font-bold text-red-400">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m
          </p>
        </div>
      </div>
    </Card>
  )
}
