/**
 * sidebar-right.tsx
 * Responsabilidad: Sidebar derecha con ranking, acciones rápidas y publicidad.
 * Decisiones: Top 5 jugadores con poder, acciones rápidas con iconos, ads mezcladas.
 * Límites: Datos estáticos (placeholder para API real de rankings y mensajes).
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, Shield, Users, Castle, Swords } from "lucide-react"

export function SidebarRight() {
  const topPlayers = [
    { name: "Lord Supremo", power: "125,450" },
    { name: "Maga Eterna", power: "118,320" },
    { name: "Rey Guerrero", power: "112,890" },
    { name: "Lady Mística", power: "108,234" },
    { name: "Archimago", power: "105,678" },
  ]

  return (
    <aside className="space-y-4 p-4">
      {" "}
      {/* Removed overflow-y-auto, now scrolls with page */}
      {/* Widget: Top Jugadores */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-sm text-[#d4af37]">Top Jugadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPlayers.map((player, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`h-6 w-6 justify-center ${
                      i === 0
                        ? "border-yellow-400 text-yellow-400"
                        : i === 1
                          ? "border-gray-300 text-gray-300"
                          : i === 2
                            ? "border-orange-400 text-orange-400"
                            : "border-[#d4af37] text-[#d4af37]"
                    }`}
                  >
                    {i + 1}
                  </Badge>
                  <span className="text-xs text-[#d4af37]">{player.name}</span>
                </div>
                <span className="text-xs font-bold text-[#4590e6]">{player.power}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Publicidad: Construcción Rápida */}
      <Card className="border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 to-black/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Castle className="h-4 w-4 text-[#d4af37]" />
            <CardTitle className="text-xs text-[#d4af37]/60">PUBLICIDAD</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#d4af37]">Construcción Rápida</h3>
            <p className="text-xs text-[#d4af37]/80">Completa tus edificios al instante</p>
            <Button size="sm" className="w-full bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90">
              Acelerar
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Widget: Acciones Rápidas */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-sm text-[#d4af37]">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
          >
            <Coins className="mr-2 h-4 w-4" />
            Recolectar Recursos
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
          >
            <Shield className="mr-2 h-4 w-4" />
            Ver Defensas
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 bg-transparent"
          >
            <Users className="mr-2 h-4 w-4" />
            Mensajes
          </Button>
        </CardContent>
      </Card>
      {/* Publicidad: Entrenamiento x2 */}
      <Card className="border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 to-black/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-[#d4af37]" />
            <CardTitle className="text-xs text-[#d4af37]/60">PUBLICIDAD</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#d4af37]">Entrenamiento x2</h3>
            <p className="text-xs text-[#d4af37]/80">Duplica la velocidad de entrenamiento de tropas</p>
            <Button size="sm" className="w-full bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90">
              Activar
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
