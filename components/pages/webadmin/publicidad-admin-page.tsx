"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Gift, Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PublicidadAdminPageProps {
  language: Language
  user: any
}

interface Advertisement {
  id: string
  position: string
  title: string
  description: string
  button_text: string
  button_action: string | null
  image_url: string | null
  active: boolean
  order_index: number
}

export function PublicidadAdminPage({ language, user }: PublicidadAdminPageProps) {
  const t = useTranslation(language)
  const { toast } = useToast()
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [formData, setFormData] = useState({
    position: "sidebar-left-prelogin",
    title: "",
    description: "",
    button_text: "Ver más",
    button_action: "",
    image_url: "",
    order_index: 0,
    active: true,
  })

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error
      setAds(data || [])
    } catch (error) {
      console.error("Error fetching ads:", error)
      toast({
        title: "Error",
        description: language === "es" ? "Error cargando anuncios" : "Error loading ads",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingAd) {
        // Actualizar
        const { error } = await supabase
          .from("advertisements")
          .update(formData)
          .eq("id", editingAd.id)

        if (error) throw error

        toast({
          title: language === "es" ? "✅ Anuncio Actualizado" : "✅ Ad Updated",
        })
      } else {
        // Crear nuevo
        const { error } = await supabase
          .from("advertisements")
          .insert([formData])

        if (error) throw error

        toast({
          title: language === "es" ? "✅ Anuncio Creado" : "✅ Ad Created",
        })
      }

      fetchAds()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving ad:", error)
      toast({
        title: "Error",
        description: language === "es" ? "Error guardando anuncio" : "Error saving ad",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === "es" ? "¿Eliminar este anuncio?" : "Delete this ad?")) return

    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: language === "es" ? "✅ Anuncio Eliminado" : "✅ Ad Deleted",
      })
      fetchAds()
    } catch (error) {
      console.error("Error deleting ad:", error)
      toast({
        title: "Error",
        description: language === "es" ? "Error eliminando anuncio" : "Error deleting ad",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("advertisements")
        .update({ active: !currentActive })
        .eq("id", id)

      if (error) throw error

      fetchAds()
    } catch (error) {
      console.error("Error toggling active:", error)
    }
  }

  const openEditDialog = (ad: Advertisement) => {
    setEditingAd(ad)
    setFormData({
      position: ad.position,
      title: ad.title,
      description: ad.description,
      button_text: ad.button_text,
      button_action: ad.button_action || "",
      image_url: ad.image_url || "",
      order_index: ad.order_index,
      active: ad.active,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingAd(null)
    setFormData({
      position: "sidebar-left-prelogin",
      title: "",
      description: "",
      button_text: "Ver más",
      button_action: "",
      image_url: "",
      order_index: 0,
      active: true,
    })
  }

  const filteredAds = selectedPosition === "all" 
    ? ads 
    : ads.filter(ad => ad.position === selectedPosition)

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      "sidebar-left-prelogin": "Izq. Pre-login",
      "sidebar-right-prelogin": "Der. Pre-login",
      "sidebar-left-postlogin": "Izq. Post-login",
      "sidebar-right-postlogin": "Der. Post-login",
    }
    return labels[position] || position
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-purple-400">
              {language === "es" ? "Gestión de Anuncios Publicitarios" : "Advertising Management"}
            </h1>
            <p className="text-[#d4af37]/70">
              {language === "es" 
                ? "Administra los anuncios en las columnas laterales"
                : "Manage sidebar advertisements"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          {language === "es" ? "Nuevo Anuncio" : "New Ad"}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={selectedPosition === "all" ? "default" : "outline"}
          onClick={() => setSelectedPosition("all")}
          className={selectedPosition === "all" ? "bg-purple-500" : ""}
        >
          {language === "es" ? "Todos" : "All"}
        </Button>
        <Button
          size="sm"
          variant={selectedPosition === "sidebar-left-prelogin" ? "default" : "outline"}
          onClick={() => setSelectedPosition("sidebar-left-prelogin")}
          className={selectedPosition === "sidebar-left-prelogin" ? "bg-purple-500" : ""}
        >
          Izq. Pre-login
        </Button>
        <Button
          size="sm"
          variant={selectedPosition === "sidebar-right-prelogin" ? "default" : "outline"}
          onClick={() => setSelectedPosition("sidebar-right-prelogin")}
          className={selectedPosition === "sidebar-right-prelogin" ? "bg-purple-500" : ""}
        >
          Der. Pre-login
        </Button>
        <Button
          size="sm"
          variant={selectedPosition === "sidebar-left-postlogin" ? "default" : "outline"}
          onClick={() => setSelectedPosition("sidebar-left-postlogin")}
          className={selectedPosition === "sidebar-left-postlogin" ? "bg-purple-500" : ""}
        >
          Izq. Post-login
        </Button>
        <Button
          size="sm"
          variant={selectedPosition === "sidebar-right-postlogin" ? "default" : "outline"}
          onClick={() => setSelectedPosition("sidebar-right-postlogin")}
          className={selectedPosition === "sidebar-right-postlogin" ? "bg-purple-500" : ""}
        >
          Der. Post-login
        </Button>
      </div>

      {/* Lista de Anuncios */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#d4af37]/70">
            {language === "es" ? "Cargando anuncios..." : "Loading ads..."}
          </p>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#d4af37]/70">
            {language === "es" ? "No hay anuncios en esta posición" : "No ads in this position"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAds.map((ad) => (
            <Card key={ad.id} className="bg-purple-500/10 border-purple-500/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-purple-400">{ad.title}</CardTitle>
                      <span className={`px-2 py-1 rounded text-xs ${
                        ad.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {ad.active ? (language === "es" ? "Activo" : "Active") : (language === "es" ? "Inactivo" : "Inactive")}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {getPositionLabel(ad.position)}
                      </span>
                    </div>
                    <CardDescription className="text-[#d4af37]/70">
                      {ad.description}
                    </CardDescription>
                    <p className="text-sm text-[#d4af37]/50 mt-2">
                      {language === "es" ? "Botón" : "Button"}: {ad.button_text}
                      {ad.button_action && ` → ${ad.button_action}`}
                    </p>
                    {ad.image_url && (
                      <p className="text-sm text-[#d4af37]/50">
                        {language === "es" ? "Imagen" : "Image"}: {ad.image_url}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(ad.id, ad.active)}
                      className={ad.active ? "border-green-400 text-green-400" : "border-gray-400 text-gray-400"}
                    >
                      {ad.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(ad)}
                      className="border-purple-400 text-purple-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(ad.id)}
                      className="border-red-500 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para Crear/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-purple-500/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-400">
              {editingAd 
                ? (language === "es" ? "Editar Anuncio" : "Edit Ad")
                : (language === "es" ? "Nuevo Anuncio" : "New Ad")}
            </DialogTitle>
            <DialogDescription className="text-[#d4af37]/70">
              {language === "es" 
                ? "Configura los detalles del anuncio publicitario"
                : "Configure advertisement details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-[#d4af37]">
                {language === "es" ? "Posición" : "Position"}
              </Label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full p-2 bg-[#0f0f0f] border border-purple-500/20 rounded text-[#d4af37]"
              >
                <option value="sidebar-left-prelogin">Sidebar Izquierda Pre-login</option>
                <option value="sidebar-right-prelogin">Sidebar Derecha Pre-login</option>
                <option value="sidebar-left-postlogin">Sidebar Izquierda Post-login</option>
                <option value="sidebar-right-postlogin">Sidebar Derecha Post-login</option>
              </select>
            </div>

            <div>
              <Label className="text-[#d4af37]">
                {language === "es" ? "Título" : "Title"}
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-[#0f0f0f] border-purple-500/20 text-[#d4af37]"
                placeholder={language === "es" ? "Título del anuncio" : "Ad title"}
              />
            </div>

            <div>
              <Label className="text-[#d4af37]">
                {language === "es" ? "Descripción" : "Description"}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-[#0f0f0f] border-purple-500/20 text-[#d4af37]"
                placeholder={language === "es" ? "Descripción del anuncio" : "Ad description"}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#d4af37]">
                  {language === "es" ? "Texto del Botón" : "Button Text"}
                </Label>
                <Input
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="bg-[#0f0f0f] border-purple-500/20 text-[#d4af37]"
                  placeholder="Ver más"
                />
              </div>
              <div>
                <Label className="text-[#d4af37]">
                  {language === "es" ? "Acción del Botón (opcional)" : "Button Action (optional)"}
                </Label>
                <Input
                  value={formData.button_action}
                  onChange={(e) => setFormData({ ...formData, button_action: e.target.value })}
                  className="bg-[#0f0f0f] border-purple-500/20 text-[#d4af37]"
                  placeholder="noticias"
                />
              </div>
            </div>

            <div>
              <Label className="text-[#d4af37]">
                {language === "es" ? "URL de Imagen (opcional)" : "Image URL (optional)"}
              </Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-[#0f0f0f] border-purple-500/20 text-[#d4af37]"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#d4af37]">
                  {language === "es" ? "Orden" : "Order"}
                </Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="bg-[#0f0f0f] border-purple-500/20 text-[#d4af37]"
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label className="text-[#d4af37]">
                  {language === "es" ? "Activo" : "Active"}
                </Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                {language === "es" ? "Cancelar" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                {editingAd 
                  ? (language === "es" ? "Actualizar" : "Update")
                  : (language === "es" ? "Crear" : "Create")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}