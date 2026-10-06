import type { AppUser, Permission, Role } from '@/types'
import { appConfig } from '@/core/config/app.config'

export function getRoleById(roleId: string, roles: Role[] = appConfig.roles): Role | undefined {
  return roles.find((role) => role.id === roleId)
}

export function getUserRoles(user: AppUser | null | undefined, roles: Role[] = appConfig.roles): Role[] {
  if (!user) return []
  return user.roleIds
    .map((roleId) => getRoleById(roleId, roles))
    .filter((role): role is Role => Boolean(role))
}

export function getUserPermissions(
  user: AppUser | null | undefined,
  roles: Role[] = appConfig.roles,
): Permission[] {
  const permissions = new Set<Permission>()
  getUserRoles(user, roles).forEach((role) => {
    role.permissions.forEach((permission) => permissions.add(permission))
  })
  return Array.from(permissions)
}

export function hasRole(
  user: AppUser | null | undefined,
  roleId: string | string[],
): boolean {
  if (!user) return false
  const required = Array.isArray(roleId) ? roleId : [roleId]
  return required.some((id) => user.roleIds.includes(id))
}

export function hasPermission(
  user: AppUser | null | undefined,
  permission: Permission,
  roles: Role[] = appConfig.roles,
): boolean {
  return getUserPermissions(user, roles).includes(permission)
}

export function hasAnyPermission(
  user: AppUser | null | undefined,
  permissions: Permission[],
  roles: Role[] = appConfig.roles,
): boolean {
  if (permissions.length === 0) return true
  const owned = new Set(getUserPermissions(user, roles))
  return permissions.some((permission) => owned.has(permission))
}

export function hasAllPermissions(
  user: AppUser | null | undefined,
  permissions: Permission[],
  roles: Role[] = appConfig.roles,
): boolean {
  if (permissions.length === 0) return true
  const owned = new Set(getUserPermissions(user, roles))
  return permissions.every((permission) => owned.has(permission))
}

export function canAccessNavItem(
  user: AppUser | null | undefined,
  item: {
    permission?: Permission | Permission[]
    roles?: string[]
    visible?: boolean
  },
): boolean {
  if (item.visible === false) return false
  if (item.roles?.length && !hasRole(user, item.roles)) return false
  if (!item.permission) return true
  const permissions = Array.isArray(item.permission) ? item.permission : [item.permission]
  return hasAnyPermission(user, permissions)
}
