/* ============================================================================
   MAGELORD - ALTAR DE LOS DIOSES
   ============================================================================
   
   Sistema de favor divino basado en Archmage.
   
   MECÁNICA:
   - 8 dioses del panteón
   - Cada dios otorga diferentes bendiciones
   - El favor se gana mediante ofrendas (oro)
   - Bendiciones duran un tiempo limitado
   - Solo puedes tener 1 bendición activa a la vez
   
   ============================================================================ */

"use client"

import { useState, useEffect } from "react"
import { type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Church, Sparkles, Sword, Shield, Coins, Zap, Users, BookOpen, Dices, Sun, Skull, Leaf } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

interface AltarDiosesProps {
  language: Language
  province?: any
  user?: any
  gameState?: any
  onUpdate: () => Promise<void>
}

interface God {
  id: string
  name: string
  name_en: string
  title: string
  title_en: string
  description: string
  description_en: string
  domain: string
  alignment: 'good' | 'neutral' | 'evil'
  blessing_attack_bonus: number
  blessing_defense_bonus: number
  blessing_gold_bonus: number
  blessing_mana_bonus: number
  blessing_population_bonus: number
  special_power: string
  special_power_en: string
  favor_cost_base: number
  favor_cost_multiplier: number
  icon: string
  favor_level?: number
  favor_points?: number
  blessing_active?: boolean
}

export function AltarDioses({ language, province, user, gameState, onUpdate }: AltarDiosesProps) {
  const { toast } = useToast()
  const [gods, setGods] = useState<God[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGod, setSelectedGod] = useState<God | null>(null)
  const [prayDialogOpen, setPrayDialogOpen] = useState(false)
  const [offeringAmount, setOfferingAmount] = useState(1000)

  /* ==========================================================================
     CARGAR DIOSES
     ========================================================================== */
  
  useEffect(() => {
    loadGods()
  }, [gameState?.province_id])

  const loadGods = async () => {
    if (!gameState?.province_id) return

    setLoading(true)
    try {
      // Cargar dioses
      const { data: godsData, error: godsError } = await supabase
        .from('master_gods')
        .select('*')
        .order('name')

      if (godsError) throw godsError

      // Cargar favor actual del jugador
      const { data: favorData, error: favorError } = await supabase
        .from('province_god_favor')
        .select('*')
        .eq('province_id', gameState.province_id)

      // Combinar datos
      const godsWithFavor = (godsData || []).map(god => {
        const favor = favorData?.find(f => f.god_id === god.id)
        return {
          ...god,
          favor_level: favor?.favor_level || 0,
          favor_points: favor?.favor_points || 0,
          blessing_active: favor?.blessing_active || false
        }
      })

      setGods(godsWithFavor)
    } catch (error: any) {
      console.error('Error loading gods:', error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  /* ==========================================================================
     OFRECER OFRENDA
     ========================================================================== */
  
  const handlePray = async () => {
    if (!selectedGod || !gameState?.province_id) return

    // Validar oro disponible
    if (gameState.gold < offeringAmount) {
      toast({
        title: language === "es" ? "Oro insuficiente" : "Insufficient gold",
        description: language === "es" 
          ? "No tienes suficiente oro para esta ofrenda" 
          : "You don't have enough gold for this offering",
        variant: "destructive"
      })
      return
    }

    try {
      // Llamar a RPC function para ofrecer ofrenda
      const { data, error } = await supabase.rpc('offer_to_god', {
        p_province_id: gameState.province_id,
        p_god_id: selectedGod.id,
        p_gold_amount: offeringAmount
      })

      if (error) throw error

      if (data === 'SUCCESS') {
        toast({
          title: language === "es" ? "¡Ofrenda aceptada!" : "Offering accepted!",
          description: language === "es"
            ? `${selectedGod.name} acepta tu ofrenda. Ganaste favor.`
            : `${selectedGod.name_en} accepts your offering. You gained favor.`,
          duration: 3000
        })

        await loadGods()
        await onUpdate()
        setPrayDialogOpen(false)
      } else {
        throw new Error(data)
      }
    } catch (error: any) {
      console.error('Error offering to god:', error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  /* ==========================================================================
     ACTIVAR BENDICIÓN
     ========================================================================== */
  
  const handleActivateBlessing = async (god: God) => {
    if (!gameState?.province_id) return

    // Verificar que tenga suficiente favor
    if ((god.favor_level || 0) < 5) {
      toast({
        title: language === "es" ? "Favor insuficiente" : "Insufficient favor",
        description: language === "es"
          ? "Necesitas nivel 5 de favor para recibir una bendición"
          : "You need favor level 5 to receive a blessing",
        variant: "destructive"
      })
      return
    }

    try {
      const { data, error } = await supabase.rpc('activate_god_blessing', {
        p_province_id: gameState.province_id,
        p_god_id: god.id
      })

      if (error) throw error

      if (data === 'SUCCESS') {
        toast({
          title: language === "es" ? "¡Bendición otorgada!" : "Blessing granted!",
          description: language === "es"
            ? `Has recibido la bendición de ${god.name}`
            : `You have received the blessing of ${god.name_en}`,
          duration: 3000
        })

        await loadGods()
        await onUpdate()
      } else {
        throw new Error(data)
      }
    } catch (error: any) {
      console.error('Error activating blessing:', error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  /* ==========================================================================
     OBTENER ICONO POR DOMINIO
     ========================================================================== */
  
  const getDomainIcon = (domain: string) => {
    const icons: Record<string, any> = {
      war: Sword,
      magic: Sparkles,
      wealth: Coins,
      nature: Leaf,
      death: Skull,
      knowledge: BookOpen,
      chaos: Dices,
      justice: Sun
    }
    const Icon = icons[domain] || Church
    return <Icon className="h-6 w-6" />
  }

  /* ==========================================================================
     CALCULAR COSTE DE SIGUIENTE NIVEL
     ========================================================================== */
  
  const getNextLevelCost = (god: God) => {
    const currentLevel = god.favor_level || 0
    return Math.floor(god.favor_cost_base * Math.pow(god.favor_cost_multiplier, currentLevel))
  }

  /* ==========================================================================
     RENDER
     ========================================================================== */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Church className="h-12 w-12 text-[#d4af37] mx-auto mb-4 animate-pulse" />
          <p className="text-[#d4af37]">
            {language === "es" ? "Invocando a los dioses..." : "Invoking the gods..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Church className="h-8 w-8 text-[#d4af37]" />
        <div>
          <h2 className="text-2xl font-bold text-[#d4af37]">
            {language === "es" ? "Altar de los Dioses" : "Altar of the Gods"}
          </h2>
          <p className="text-sm text-gray-400">
            {language === "es" 
              ? "Ofrece oro para ganar favor divino y recibir bendiciones poderosas" 
              : "Offer gold to gain divine favor and receive powerful blessings"}
          </p>
        </div>
      </div>

      {/* EXPLICACIÓN */}
      <Card className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-amber-700/50 p-4">
        <h3 className="text-amber-400 font-bold mb-2">
          {language === "es" ? "📜 Cómo funciona" : "📜 How it works"}
        </h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• {language === "es" 
            ? "Ofrece oro a los dioses para ganar su favor" 
            : "Offer gold to the gods to gain their favor"}</li>
          <li>• {language === "es" 
            ? "El favor se mide en niveles (0-10)" 
            : "Favor is measured in levels (0-10)"}</li>
          <li>• {language === "es" 
            ? "Con nivel 5+ puedes activar su bendición" 
            : "At level 5+ you can activate their blessing"}</li>
          <li>• {language === "es" 
            ? "Las bendiciones duran 100 turnos" 
            : "Blessings last 100 turns"}</li>
          <li>• {language === "es" 
            ? "Solo puedes tener 1 bendición activa a la vez" 
            : "You can only have 1 active blessing at a time"}</li>
        </ul>
      </Card>

      {/* GRID DE DIOSES */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {gods.map(god => {
          const nextCost = getNextLevelCost(god)
          const favorPercent = ((god.favor_points || 0) / nextCost) * 100

          return (
            <Card 
              key={god.id}
              className={`relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 transition-all hover:scale-105 ${
                god.blessing_active 
                  ? 'border-amber-500 shadow-lg shadow-amber-500/50' 
                  : 'border-slate-700'
              }`}
            >
              {/* Badge activa */}
              {god.blessing_active && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-amber-500 text-black animate-pulse">
                    {language === "es" ? "ACTIVA" : "ACTIVE"}
                  </Badge>
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Icono y nombre */}
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{god.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-400">
                      {language === "es" ? god.name : god.name_en}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {language === "es" ? god.title : god.title_en}
                    </p>
                  </div>
                </div>

                {/* Dominio y alineamiento */}
                <div className="flex items-center gap-2">
                  {getDomainIcon(god.domain)}
                  <Badge variant="outline" className="capitalize">
                    {god.domain}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={
                      god.alignment === 'good' ? 'border-green-500 text-green-400' :
                      god.alignment === 'evil' ? 'border-red-500 text-red-400' :
                      'border-yellow-500 text-yellow-400'
                    }
                  >
                    {god.alignment}
                  </Badge>
                </div>

                {/* Nivel de favor */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {language === "es" ? "Favor" : "Favor"}: {god.favor_level || 0}/10
                    </span>
                    <span className="text-amber-400">{god.favor_points || 0} pts</span>
                  </div>
                  <Progress value={favorPercent} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {language === "es" ? "Siguiente nivel" : "Next level"}: {nextCost.toLocaleString()} 💰
                  </p>
                </div>

                {/* Bonos de bendición */}
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-amber-400">
                    {language === "es" ? "Bendición:" : "Blessing:"}
                  </p>
                  {god.blessing_attack_bonus > 0 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <Sword className="h-3 w-3" />
                      <span>+{god.blessing_attack_bonus.toLocaleString()} Attack</span>
                    </div>
                  )}
                  {god.blessing_defense_bonus > 0 && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <Shield className="h-3 w-3" />
                      <span>+{god.blessing_defense_bonus.toLocaleString()} Defense</span>
                    </div>
                  )}
                  {god.blessing_gold_bonus > 0 && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Coins className="h-3 w-3" />
                      <span>+{god.blessing_gold_bonus.toLocaleString()} Gold/turn</span>
                    </div>
                  )}
                  {god.blessing_mana_bonus > 0 && (
                    <div className="flex items-center gap-1 text-purple-400">
                      <Zap className="h-3 w-3" />
                      <span>+{god.blessing_mana_bonus.toLocaleString()} Mana/turn</span>
                    </div>
                  )}
                  {god.blessing_population_bonus !== 0 && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Users className="h-3 w-3" />
                      <span>{god.blessing_population_bonus > 0 ? '+' : ''}{god.blessing_population_bonus.toLocaleString()} Pop</span>
                    </div>
                  )}
                </div>

                {/* Poder especial */}
                <div className="bg-slate-800/50 p-2 rounded text-xs">
                  <p className="text-amber-400 font-bold mb-1">
                    {language === "es" ? "Poder Especial:" : "Special Power:"}
                  </p>
                  <p className="text-gray-300">
                    {language === "es" ? god.special_power : god.special_power_en}
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedGod(god)
                      setPrayDialogOpen(true)
                    }}
                    size="sm"
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                  >
                    {language === "es" ? "Ofrecer" : "Offer"}
                  </Button>
                  <Button
                    onClick={() => handleActivateBlessing(god)}
                    size="sm"
                    disabled={god.blessing_active || (god.favor_level || 0) < 5}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {language === "es" ? "Bendición" : "Bless"}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* DIALOG DE OFRENDA */}
      <Dialog open={prayDialogOpen} onOpenChange={setPrayDialogOpen}>
        <DialogContent className="bg-slate-900 border-amber-700">
          <DialogHeader>
            <DialogTitle className="text-amber-400">
              {language === "es" ? "Ofrecer a" : "Offer to"} {language === "es" ? selectedGod?.name : selectedGod?.name_en}
            </DialogTitle>
            <DialogDescription>
              {language === "es" 
                ? "Ofrece oro para ganar el favor de este dios. Cuanto más ofrezcas, más favor ganarás." 
                : "Offer gold to gain this god's favor. The more you offer, the more favor you'll gain."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Label className="text-gray-300 w-24">
                {language === "es" ? "Ofrenda:" : "Offering:"}
              </Label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={offeringAmount}
                onChange={(e) => setOfferingAmount(parseInt(e.target.value) || 1000)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div className="bg-slate-800 p-3 rounded space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {language === "es" ? "Oro disponible:" : "Available gold:"}
                </span>
                <span className="text-yellow-400">{gameState?.gold?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {language === "es" ? "Favor ganado (aprox):" : "Favor gained (approx):"}
                </span>
                <span className="text-amber-400">+{Math.floor(offeringAmount / 100)} pts</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPrayDialogOpen(false)}
              className="border-slate-700"
            >
              {language === "es" ? "Cancelar" : "Cancel"}
            </Button>
            <Button 
              onClick={handlePray}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {language === "es" ? "Ofrecer" : "Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}