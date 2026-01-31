/**
 * Supabase Client Configuration
 *
 * Creates a Supabase client using environment variables from Vercel.
 * This client is used for authentication and database operations.
 */

import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate that environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

/**
 * Supabase client instance with persistent session
 * Used for all authentication and database operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "magelord_session",
    flowType: "pkce",
  },
  global: {
    headers: {
      "x-application-name": "magelord",
    },
  },
})

/**
 * Creates a browser-side Supabase client
 * This is an alias for the supabase client for components that expect this naming convention
 */
export const createBrowserClient = () => supabase

/**
 * Database Types
 * Define the structure of our database tables
 */

export interface User {
  id: string
  username: string
  faction: string
  bio?: string
  created_at: string
}

export interface Province {
  id: string // Changed id from number to string (UUID) to match database
  user_id: string
  name: string
  gold: number
  mana: number
  turns: number
  land: number
  population: number
  alignment: string
  last_update: string
  created_at: string
}
