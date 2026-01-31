/**
 * sidebar-left.tsx
 * Responsabilidad: Sidebar izquierda con widgets de servidor, alianza y publicidad.
 * Decisiones: Alterna widgets de información con cards de publicidad promocional.
 * Límites: Datos estáticos hardcodeados (placeholder para futuro endpoint API).
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Gift } from "lucide-react"

export function SidebarLeft() {
  return (
    <aside className="space-y-4">
      {/* Widget: Estado del Servidor */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-sm text-[#d4af37]">Servidor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Jugadores:</span>
            <span className="font-bold text-green-400">1,247</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Alianzas:</span>
            <span className="font-bold text-purple-400">87</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Era:</span>
            <span className="font-bold text-blue-400">Año 42</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Estado:</span>
            <span className="font-bold text-orange-400">Activo</span>
          </div>
        </CardContent>
      </Card>

      {/* Publicidad: Maná Extra */}
      <Card className="border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 to-black/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#d4af37]" />
            <CardTitle className="text-xs text-[#d4af37]/60">PUBLICIDAD</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#d4af37]">¡Maná Extra!</h3>
            <p className="text-xs text-[#d4af37]/80">Duplica tu producción de maná por 7 días</p>
            <Button size="sm" className="w-full bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90">
              Comprar Ahora
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Widget: Tu Alianza */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-sm text-[#d4af37]">Tu Alianza</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Badge className="bg-purple-600 text-white">Círculo Arcano</Badge>
          <p className="text-xs text-gray-400">
            Rango: <span className="text-[#d4af37] font-bold">#12</span>
          </p>
          <p className="text-xs text-gray-400">
            Miembros: <span className="text-green-400 font-bold">24</span>/50
          </p>
        </CardContent>
      </Card>

      {/* Publicidad: Premium */}
      <Card className="border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 to-black/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#d4af37]" />
            <CardTitle className="text-xs text-[#d4af37]/60">PUBLICIDAD</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#d4af37]">Premium</h3>
            <p className="text-xs text-[#d4af37]/80">Desbloquea hechizos legendarios exclusivos</p>
            <Button size="sm" className="w-full bg-[#d4af37] text-[#0a0a0a] hover:bg-[#d4af37]/90">
              Ver Ofertas
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
