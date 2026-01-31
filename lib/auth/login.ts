import { supabase } from "@/lib/supabaseClient"

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw new Error(error.message)
  if (!data.session) throw new Error("No session returned")

  return data
}
