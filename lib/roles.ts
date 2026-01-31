/**
 * Role-based access control system
 * Defines role hierarchy and permissions
 */

export type UserRole = "player" | "forum_admin" | "web_admin" | "admin" | "owner"

export interface RolePermissions {
  canAccessForum: boolean
  canAccessWebAdmin: boolean
  canAccessAdminPanel: boolean
  canAccessOwnerTools: boolean
}

export function getRolePermissions(roles: UserRole[]): RolePermissions {
  return {
    canAccessForum: roles.includes("forum_admin") || roles.includes("admin") || roles.includes("owner"),
    canAccessWebAdmin: roles.includes("web_admin") || roles.includes("admin") || roles.includes("owner"),
    canAccessAdminPanel: roles.includes("admin") || roles.includes("owner"),
    canAccessOwnerTools: roles.includes("owner"),
  }
}

export function hasRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  return userRoles.includes(requiredRole)
}
