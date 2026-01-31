// ============================================================================
// MAGELORD - CONFIGURACIÃ“N DE MENÃšS POR ROL
// ============================================================================
// Archivo: /lib/menu-config.ts
// Este archivo define quÃ© menÃºs ve cada tipo de usuario
// ============================================================================

import type { UserRole } from "@/lib/roles"

export interface MenuItem {
  id: string
  label: string
  icon?: string
  submenu?: MenuItem[]
}

export interface MenuSection {
  title: string
  items: MenuItem[]
  roles: UserRole[] // QuÃ© roles pueden ver esta secciÃ³n
}

// ============================================================================
// MENÃšS POR SECCIÃ“N
// ============================================================================

// MENÃš 1: Jugador Normal (todos lo ven)
const PLAYER_MENU: MenuSection = {
  title: "Juego",
  roles: ["player", "forum_admin", "web_admin", "admin", "owner"],
  items: [
    { id: "portada", label: "Portada" },
    { id: "provincia", label: "Mi Provincia" },
    { id: "army", label: "EjÃ©rcito" },
    { id: "build", label: "ConstrucciÃ³n", submenu: [
      { id: "construir", label: "Construir" },
      { id: "demoler", label: "Demoler" }
    ]},
    { id: "magic", label: "Magia", submenu: [
      { id: "hechizos", label: "Lanzar Hechizos" },
      { id: "rituales", label: "Rituales" },
      { id: "hechizos-activos", label: "Efectos Activos" }
    ]},
    { id: "investigation", label: "InvestigaciÃ³n" },
    { id: "commerce", label: "Comercio", submenu: [
      { id: "mercado-global", label: "Mercado Global" },
      { id: "mercado-negro", label: "Mercado Negro" }
    ]},
    { id: "war", label: "Guerra", submenu: [
      { id: "sala-guerra", label: "Sala de Guerra" },
      { id: "exploracion", label: "ExploraciÃ³n" },
      { id: "defensa", label: "Defensas" }
    ]},
    { id: "diplomacy", label: "Diplomacia", submenu: [
      { id: "alianzas", label: "Alianzas" },
      { id: "gremios", label: "Gremios" },
      { id: "mensajes", label: "Mensajes" }
    ]},
    { id: "rankings", label: "Rankings" },
    { id: "profile", label: "Perfil" }
  ]
}

// MENÃš 2: Moderador de Foro (forum_admin y superiores)
const FORUM_ADMIN_MENU: MenuSection = {
  title: "ModeraciÃ³n Foro",
  roles: ["forum_admin", "admin", "owner"], // web_admin NO tiene acceso al foro
  items: [
    { id: "foro", label: "GestiÃ³n Foro" },
    { id: "foro-reportes", label: "Reportes" },
    { id: "foro-usuarios", label: "Usuarios Foro" },
    { id: "foro-logs", label: "Logs ModeraciÃ³n" }
  ]
}

// MENÃš 3: Administrador Web (web_admin y superiores)
const WEB_ADMIN_MENU: MenuSection = {
  title: "AdministraciÃ³n Web",
  roles: ["web_admin", "admin", "owner"],
  items: [
    { id: "noticias-admin", label: "GestiÃ³n Noticias" },
    { id: "anuncios-admin", label: "Anuncios" },
    { id: "soporte", label: "Soporte Jugadores" },
    { id: "tickets", label: "Tickets" },
    { id: "broadcast-admin", label: "Mensajes Masivos" }
  ]
}

// MENÃš 4: Administrador General (admin y owner)
const ADMIN_MENU: MenuSection = {
  title: "AdministraciÃ³n",
  roles: ["admin", "owner"],
  items: [
    { id: "usuarios-admin", label: "GestiÃ³n Usuarios" },
    { id: "roles-admin", label: "Roles y Permisos" },
    { id: "logs-admin", label: "Logs del Sistema" },
    { id: "fixes-admin", label: "Correcciones/Fixes" },
    { id: "stats-admin", label: "EstadÃ­sticas" }
  ]
}

// MENÃš 5: Owner (solo tÃº)
const OWNER_MENU: MenuSection = {
  title: "Control Total",
  roles: ["owner"],
  items: [
    { id: "admin-cataclysm", label: "âš¡ Cataclismo" },
    { id: "server-config", label: "ConfiguraciÃ³n Servidor" },
    { id: "database-admin", label: "Base de Datos" },
    { id: "backup-admin", label: "Backups" },
    { id: "maintenance-mode", label: "Modo Mantenimiento" }
  ]
}

// ============================================================================
// FUNCIÃ“N PRINCIPAL: Obtener menÃºs segÃºn rol
// ============================================================================

export function getMenusForRole(role: UserRole): MenuSection[] {
  const menus: MenuSection[] = []

  // Todos ven el menÃº de jugador
  menus.push(PLAYER_MENU)

  // Forum admins y superiores ven moderaciÃ³n de foro
  if (["forum_admin", "admin", "owner"].includes(role)) {
    menus.push(FORUM_ADMIN_MENU)
  }

  // Web admins y superiores ven gestiÃ³n web
  if (["web_admin", "admin", "owner"].includes(role)) {
    menus.push(WEB_ADMIN_MENU)
  }

  // Admins y owner ven administraciÃ³n general
  if (["admin", "owner"].includes(role)) {
    menus.push(ADMIN_MENU)
  }

  // Solo owner ve control total
  if (role === "owner") {
    menus.push(OWNER_MENU)
  }

  return menus
}

// ============================================================================
// FUNCIÃ“N AUXILIAR: Verificar si un usuario puede ver una pÃ¡gina
// ============================================================================

export function canAccessPage(pageId: string, userRole: UserRole): boolean {
  const menus = getMenusForRole(userRole)
  
  for (const menu of menus) {
    for (const item of menu.items) {
      if (item.id === pageId) return true
      if (item.submenu) {
        const found = item.submenu.find(sub => sub.id === pageId)
        if (found) return true
      }
    }
  }
  
  return false
}

// ============================================================================
// EJEMPLO DE USO EN COMPONENTE
// ============================================================================

/*
import { getMenusForRole } from "@/lib/menu-config"

const UserMenu = ({ userRole }: { userRole: UserRole }) => {
  const menus = getMenusForRole(userRole)
  
  return (
    <nav>
      {menus.map(section => (
        <div key={section.title}>
          <h3>{section.title}</h3>
          <ul>
            {section.items.map(item => (
              <li key={item.id}>
                {item.label}
                {item.submenu && (
                  <ul>
                    {item.submenu.map(sub => (
                      <li key={sub.id}>{sub.label}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
*/