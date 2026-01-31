"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchGameState, type GameState } from "@/lib/game-state"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"

interface GameContextType {
  gameState: GameState | null
  isLoading: boolean
  refreshGameState: () => Promise<void>
  updateGameState: (updates: Partial<GameState>) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
      } else {
        setUserId(null)
        setGameState(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) return

    const loadGameState = async () => {
      setIsLoading(true)
      const state = await fetchGameState(userId)
      if (state) {
        setGameState(state)
        console.log("[v0] ✅ Game state loaded:", state.username)
      }
      setIsLoading(false)
    }

    loadGameState()
  }, [userId])

  useEffect(() => {
    if (!gameState?.province_id) return

    console.log("[v0] 🔴 Setting up Realtime subscriptions...")

    // Subscribe to provinces table changes
    const provincesChannel = supabase
      .channel(`provinces:${gameState.province_id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "provinces",
          filter: `id=eq.${gameState.province_id}`,
        },
        (payload) => {
          console.log("[v0] 🔄 Province updated in database:", payload.new)

          // Update local state immediately
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
            }
          })

          toast({
            title: "Estado Actualizado",
            description: "Los datos de tu provincia se han actualizado.",
            duration: 3000,
          })
        },
      )
      .subscribe()

    // Subscribe to users table changes (for role updates)
    const usersChannel = supabase
      .channel(`users:${gameState.user_id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${gameState.user_id}`,
        },
        (payload) => {
          console.log("[v0] 👤 User data updated:", payload.new)
          console.log("[v0] Mi rol es:", payload.new.role)

          setGameState((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              role: payload.new.role,
              username: payload.new.username,
              email: payload.new.email,
            }
          })

          if (payload.new.role === "owner") {
            toast({
              title: "Acceso Concedido",
              description: "Ahora tienes privilegios de Owner",
              duration: 5000,
            })
          }
        },
      )
      .subscribe()

    return () => {
      console.log("[v0] 🔴 Cleaning up Realtime subscriptions")
      supabase.removeChannel(provincesChannel)
      supabase.removeChannel(usersChannel)
    }
  }, [gameState?.province_id, gameState?.user_id, toast])

  const refreshGameState = async () => {
    if (!userId) return
    const state = await fetchGameState(userId)
    if (state) {
      setGameState(state)
      console.log("[v0] 🔄 Game state refreshed")
    }
  }

  const updateGameState = (updates: Partial<GameState>) => {
    if (!gameState) return
    setGameState({ ...gameState, ...updates })
    console.log("[v0] 📝 Local game state updated")
  }

  return (
    <GameContext.Provider value={{ gameState, isLoading, refreshGameState, updateGameState }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
