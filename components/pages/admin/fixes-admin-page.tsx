"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Plus, Minus, DollarSign, Droplet, Wheat, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"

interface FixesAdminPageProps {
  language: Language
}

export function FixesAdminPage({ language }: FixesAdminPageProps) {
  const t = useTranslation(language)
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [resourceType, setResourceType] = useState<"gold" | "mana" | "food" | "population">("gold")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleApplyFix = async () => {
    if (!username || !amount) {
      toast({
        title: "Error",
        description: language === "es" ? "Completa todos los campos" : "Fill all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Buscar usuario
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single()

      if (userError || !user) {
        toast({
          title: "Error",
          description: language === "es" ? "Usuario no encontrado" : "User not found",
          variant: "destructive",
        })
        return
      }

      // Buscar provincia
      const { data: province, error: provinceError } = await supabase
        .from("provinces")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (provinceError || !province) {
        toast({
          title: "Error",
          description: language === "es" ? "Provincia no encontrada" : "Province not found",
          variant: "destructive",
        })
        return
      }

      // Aplicar ajuste
      const numAmount = parseInt(amount)
      const { error: updateError } = await supabase
        .from("provinces")
        .update({ [resourceType]: supabase.rpc('increment', { amount: numAmount }) })
        .eq("id", province.id)

      if (updateError) {
        toast({
          title: "Error",
          description: language === "es" ? "Error aplicando corrección" : "Error applying fix",
          variant: "destructive",
        })
        return
      }

      // Registrar en logs
      await supabase.from("admin_logs").insert({
        action: "manual_fix",
        details: `Adjusted ${resourceType} by ${amount} for user ${username}`,
        target_user_id: user.id,
      })

      toast({
        title: language === "es" ? "✅ Corrección Aplicada" : "✅ Fix Applied",
        description: language === "es" 
          ? `${resourceType} ajustado en ${amount} para ${username}`
          : `${resourceType} adjusted by ${amount} for ${username}`,
      })

      setUsername("")
      setAmount("")
    } catch (error) {
      console.error("Error applying fix:", error)
      toast({
        title: "Error",
        description: language === "es" ? "Error inesperado" : "Unexpected error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resourceIcons = {
    gold: DollarSign,
    mana: Droplet,
    food: Wheat,
    population: Users,
  }

  const ResourceIcon = resourceIcons[resourceType]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Wrench className="h-8 w-8 text-cyan-400" />
        <h1 className="text-3xl font-bold text-cyan-400">
          {language === "es" ? "Correcciones Manuales" : "Manual Fixes"}
        </h1>
      </div>

      <Card className="bg-cyan-500/10 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <ResourceIcon className="h-5 w-5" />
            {language === "es" ? "Ajustar Recursos" : "Adjust Resources"}
          </CardTitle>
          <CardDescription className="text-[#d4af37]/70">
            {language === "es" 
              ? "Modifica recursos de jugadores manualmente (oro, maná, comida, población)"
              : "Manually modify player resources (gold, mana, food, population)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-[#d4af37]">
              {language === "es" ? "Nombre de Usuario" : "Username"}
            </Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={language === "es" ? "Escribe el nombre de usuario" : "Enter username"}
              className="bg-[#0f0f0f] border-cyan-500/20 text-[#d4af37]"
            />
          </div>

          <div>
            <Label className="text-[#d4af37]">
              {language === "es" ? "Tipo de Recurso" : "Resource Type"}
            </Label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as any)}
              className="w-full p-2 bg-[#0f0f0f] border border-cyan-500/20 rounded text-[#d4af37]"
            >
              <option value="gold">{language === "es" ? "Oro" : "Gold"}</option>
              <option value="mana">{language === "es" ? "Maná" : "Mana"}</option>
              <option value="food">{language === "es" ? "Comida" : "Food"}</option>
              <option value="population">{language === "es" ? "Población" : "Population"}</option>
            </select>
          </div>

          <div>
            <Label className="text-[#d4af37]">
              {language === "es" ? "Cantidad (usar - para restar)" : "Amount (use - to subtract)"}
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000 o -500"
              className="bg-[#0f0f0f] border-cyan-500/20 text-[#d4af37]"
            />
          </div>

          <Button
            onClick={handleApplyFix}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
          >
            {loading 
              ? (language === "es" ? "Aplicando..." : "Applying...") 
              : (language === "es" ? "Aplicar Corrección" : "Apply Fix")}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-400">
            ⚠️ {language === "es" ? "Advertencia" : "Warning"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-[#d4af37]/80 space-y-2">
          <p>
            {language === "es"
              ? "• Todas las acciones quedan registradas en los logs del sistema"
              : "• All actions are logged in the system"}
          </p>
          <p>
            {language === "es"
              ? "• Usa números negativos para restar recursos"
              : "• Use negative numbers to subtract resources"}
          </p>
          <p>
            {language === "es"
              ? "• Verifica el nombre de usuario antes de aplicar cambios"
              : "• Verify username before applying changes"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}