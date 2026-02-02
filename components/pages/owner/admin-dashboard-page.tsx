"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Newspaper, 
  Megaphone, 
  Shield, 
  FileText, 
  Ban, 
  Crown,
  Wrench,
  Gift,
  Bell,
  MessageSquare,
  Flag,
  UserX,
  Eye,
  Zap,
  Database,
  Settings,
  AlertCircle
} from "lucide-react"
import type { Language } from "@/lib/i18n"
import type { UserRole } from "@/lib/roles"

interface AdminDashboardPageProps {
  language: Language
  userRole: UserRole
  onNavigate: (page: string) => void
}

export function AdminDashboardPage({ language, userRole, onNavigate }: AdminDashboardPageProps) {
  
  // ============================================================================
  // SECCIÓN 1: ADMINISTRACIÓN GENERAL (admin + owner)
  // ============================================================================
  const generalAdminCards = [
    {
      id: "usuarios-admin",
      title: language === "es" ? "Gestión de Usuarios" : "User Management",
      description: language === "es" ? "Ver y editar cuentas de usuario" : "View and edit user accounts",
      icon: Users,
      color: "red",
      roles: ["admin", "owner"]
    },
    {
      id: "roles-admin",
      title: language === "es" ? "Roles y Permisos" : "Roles & Permissions",
      description: language === "es" ? "Asignar roles a usuarios" : "Assign roles to users",
      icon: Crown,
      color: "orange",
      roles: ["admin", "owner"]
    },
    {
      id: "bans-admin",
      title: language === "es" ? "Baneos y Suspensiones" : "Bans & Suspensions",
      description: language === "es" ? "Moderar usuarios problemáticos" : "Moderate problematic users",
      icon: Ban,
      color: "red",
      roles: ["admin", "owner"]
    },
    {
      id: "fixes-admin",
      title: language === "es" ? "Correcciones Manuales" : "Manual Fixes",
      description: language === "es" ? "Ajustar recursos/tropas de jugadores" : "Adjust player resources/troops",
      icon: Wrench,
      color: "cyan",
      roles: ["admin", "owner"]
    },
    {
      id: "logs-admin",
      title: language === "es" ? "Logs de Administradores" : "Admin Action Logs",
      description: language === "es" ? "Ver historial de acciones admin" : "View admin action history",
      icon: FileText,
      color: "gray",
      roles: ["admin", "owner"]
    },
  ]

  // ============================================================================
  // SECCIÓN 2: ADMINISTRACIÓN FORO (forum_admin + admin + owner)
  // ============================================================================
  const forumAdminCards = [
    {
      id: "foro-posts-admin",
      title: language === "es" ? "Gestión de Posts" : "Post Management",
      description: language === "es" ? "Moderar y eliminar posts del foro" : "Moderate and delete forum posts",
      icon: MessageSquare,
      color: "purple",
      roles: ["forum_admin", "admin", "owner"]
    },
    {
      id: "foro-reportes-admin",
      title: language === "es" ? "Reportes de Usuarios" : "User Reports",
      description: language === "es" ? "Ver reportes de contenido inapropiado" : "View inappropriate content reports",
      icon: Flag,
      color: "yellow",
      roles: ["forum_admin", "admin", "owner"]
    },
    {
      id: "foro-bans-admin",
      title: language === "es" ? "Baneos del Foro" : "Forum Bans",
      description: language === "es" ? "Suspender usuarios del foro" : "Suspend users from forum",
      icon: UserX,
      color: "red",
      roles: ["forum_admin", "admin", "owner"]
    },
    {
      id: "foro-logs-admin",
      title: language === "es" ? "Logs de Moderación" : "Moderation Logs",
      description: language === "es" ? "Historial de acciones de moderadores" : "Moderator action history",
      icon: Eye,
      color: "gray",
      roles: ["forum_admin", "admin", "owner"]
    },
  ]

  // ============================================================================
  // SECCIÓN 3: ADMINISTRACIÓN WEB (web_admin + admin + owner)
  // ============================================================================
  const webAdminCards = [
    {
      id: "noticias-admin",
      title: language === "es" ? "Gestión de Noticias" : "News Management",
      description: language === "es" ? "Crear y publicar noticias del juego" : "Create and publish game news",
      icon: Newspaper,
      color: "blue",
      roles: ["web_admin", "admin", "owner"]
    },
    {
      id: "anuncios-admin",
      title: language === "es" ? "Anuncios Globales" : "Global Announcements",
      description: language === "es" ? "Mensajes importantes para todos" : "Important messages for everyone",
      icon: Megaphone,
      color: "green",
      roles: ["web_admin", "admin", "owner"]
    },
    {
      id: "publicidad-admin",
      title: language === "es" ? "Gestión de Publicidad" : "Advertising Management",
      description: language === "es" ? "Editar anuncios en columnas laterales" : "Edit sidebar advertisements",
      icon: Gift,
      color: "purple",
      roles: ["web_admin", "admin", "owner"]
    },
    {
      id: "broadcast-admin",
      title: language === "es" ? "Mensajes Masivos" : "Broadcast Messages",
      description: language === "es" ? "Enviar mensajes a todos los jugadores" : "Send messages to all players",
      icon: Bell,
      color: "yellow",
      roles: ["web_admin", "admin", "owner"]
    },
  ]

  // ============================================================================
  // SECCIÓN 4: CONTROL TOTAL (SOLO OWNER)
  // ============================================================================
  const ownerCards = [
    {
      id: "admin-cataclysm",
      title: language === "es" ? "⚡ Control de Cataclismo" : "⚡ Cataclysm Control",
      description: language === "es" ? "Gestionar evento de reset global" : "Manage global reset event",
      icon: Zap,
      color: "red",
      roles: ["owner"]
    },
    {
      id: "owner-logs",
      title: language === "es" ? "🔍 Logs de Administradores" : "🔍 Administrator Logs",
      description: language === "es" ? "Monitorear acciones de todos los admins" : "Monitor all admin actions",
      icon: Eye,
      color: "orange",
      roles: ["owner"]
    },
    {
      id: "database-admin",
      title: language === "es" ? "Base de Datos" : "Database Management",
      description: language === "es" ? "Acceso directo a la base de datos" : "Direct database access",
      icon: Database,
      color: "cyan",
      roles: ["owner"]
    },
    {
      id: "server-config",
      title: language === "es" ? "Configuración del Servidor" : "Server Configuration",
      description: language === "es" ? "Ajustes avanzados del sistema" : "Advanced system settings",
      icon: Settings,
      color: "gray",
      roles: ["owner"]
    },
    {
      id: "emergency-admin",
      title: language === "es" ? "🚨 Panel de Emergencia" : "🚨 Emergency Panel",
      description: language === "es" ? "Herramientas críticas de administración" : "Critical admin tools",
      icon: AlertCircle,
      color: "red",
      roles: ["owner"]
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; hover: string }> = {
      blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", hover: "hover:border-blue-500/50" },
      green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", hover: "hover:border-green-500/50" },
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", hover: "hover:border-purple-500/50" },
      yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", hover: "hover:border-yellow-500/50" },
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", hover: "hover:border-red-500/50" },
      orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", hover: "hover:border-orange-500/50" },
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", hover: "hover:border-cyan-500/50" },
      gray: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400", hover: "hover:border-gray-500/50" },
    }
    return colors[color] || colors.gray
  }

  const canAccess = (roles: UserRole[]) => roles.includes(userRole)

  const renderSection = (title: string, cards: typeof webAdminCards, sectionColor: string = "d4af37") => {
    const accessibleCards = cards.filter(card => canAccess(card.roles))
    if (accessibleCards.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`h-1 w-12 bg-${sectionColor} rounded`} style={{ backgroundColor: `#${sectionColor}` }}></div>
          <h2 className="text-2xl font-bold text-[#d4af37]">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleCards.map((card) => {
            const colors = getColorClasses(card.color)
            const Icon = card.icon

            return (
              <Card
                key={card.id}
                className={`${colors.bg} border ${colors.border} ${colors.hover} cursor-pointer transition-all hover:scale-105`}
                onClick={() => onNavigate(card.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg ${colors.text}`}>
                      {card.title}
                    </CardTitle>
                    <Icon className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  <CardDescription className="text-[#d4af37]/70">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-[#d4af37]">
          {language === "es" ? "Panel de Administración" : "Administration Panel"}
        </h1>
        <p className="text-[#d4af37]/70">
          {language === "es" 
            ? `Nivel de Acceso: ${userRole.toUpperCase()}` 
            : `Access Level: ${userRole.toUpperCase()}`}
        </p>
      </div>

      {/* General Admin Section */}
      {canAccess(["admin", "owner"]) && renderSection(
        language === "es" ? "🛡️ Administración General" : "🛡️ General Administration",
        generalAdminCards,
        "ff6348"
      )}

      {/* Forum Admin Section */}
      {canAccess(["forum_admin", "admin", "owner"]) && renderSection(
        language === "es" ? "💬 Administración del Foro" : "💬 Forum Administration",
        forumAdminCards,
        "9b59b6"
      )}

      {/* Web Admin Section */}
      {canAccess(["web_admin", "admin", "owner"]) && renderSection(
        language === "es" ? "🌐 Administración Web" : "🌐 Web Administration",
        webAdminCards,
        "3498db"
      )}

      {/* Owner Only Section */}
      {userRole === "owner" && renderSection(
        language === "es" ? "👑 Control Total (Owner)" : "👑 Full Control (Owner)",
        ownerCards,
        "2ecc71"
      )}

      {/* Info Footer */}
      <div className="mt-12 p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg">
        <p className="text-[#d4af37]/80 text-sm text-center">
          {language === "es"
            ? "⚠️ Todas las acciones administrativas quedan registradas en los logs del sistema"
            : "⚠️ All administrative actions are logged in the system"}
        </p>
      </div>
    </div>
  )
}
