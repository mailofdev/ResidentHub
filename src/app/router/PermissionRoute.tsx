import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'
import { hasAllPermissions, hasAnyPermission, hasPermission, hasRole } from '@/core/rbac'
import type { Permission } from '@/types'

export function RoleRoute({ roles }: { roles: string | string[] }) {
  const user = useAppSelector((state) => state.auth.user)
  if (!hasRole(user, roles)) {
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}

export function PermissionRoute({
  permission,
  anyPermission,
  allPermissions,
}: {
  permission?: Permission
  anyPermission?: Permission[]
  allPermissions?: Permission[]
}) {
  const user = useAppSelector((state) => state.auth.user)

  let allowed = true
  if (permission) allowed = hasPermission(user, permission)
  if (anyPermission) allowed = allowed && hasAnyPermission(user, anyPermission)
  if (allPermissions) allowed = allowed && hasAllPermissions(user, allPermissions)

  if (!allowed) return <Navigate to="/unauthorized" replace />
  return <Outlet />
}
