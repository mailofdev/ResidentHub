import { useMemo } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import {
  getUserPermissions,
  getUserRoles,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
} from '@/core/rbac'
import type { Permission } from '@/types'

export function useAuth() {
  const auth = useAppSelector((state) => state.auth)
  return auth
}

export function usePermissions() {
  const user = useAppSelector((state) => state.auth.user)
  const permissions = useMemo(() => getUserPermissions(user), [user])
  const roles = useMemo(() => getUserRoles(user), [user])

  return {
    user,
    permissions,
    roles,
    hasRole: (roleId: string | string[]) => hasRole(user, roleId),
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (items: Permission[]) => hasAnyPermission(user, items),
    hasAllPermissions: (items: Permission[]) => hasAllPermissions(user, items),
  }
}
