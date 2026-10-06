import type { ReactNode } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
} from '@/core/rbac'
import type { Permission } from '@/types'

export interface CanProps {
  permission?: Permission
  permissions?: Permission[]
  anyPermission?: Permission[]
  allPermissions?: Permission[]
  role?: string | string[]
  fallback?: ReactNode
  children: ReactNode
}

export function Can({
  permission,
  permissions,
  anyPermission,
  allPermissions,
  role,
  fallback = null,
  children,
}: CanProps) {
  const user = useAppSelector((state) => state.auth.user)

  let allowed = true

  if (role) allowed = allowed && hasRole(user, role)
  if (permission) allowed = allowed && hasPermission(user, permission)
  if (permissions?.length) allowed = allowed && hasAllPermissions(user, permissions)
  if (anyPermission?.length) allowed = allowed && hasAnyPermission(user, anyPermission)
  if (allPermissions?.length) allowed = allowed && hasAllPermissions(user, allPermissions)

  return allowed ? <>{children}</> : <>{fallback}</>
}
