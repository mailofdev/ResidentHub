import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Shield, Users } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setBreadcrumbs } from '@/app/store/slices/uiSlice'
import { getUserPermissions, getUserRoles } from '@/core/rbac'
import { isFeatureEnabled } from '@/core/features'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Can } from '@/components/ui/Can'
import { PERMISSIONS } from '@/core/config/app.config'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const roles = getUserRoles(user)
  const permissions = getUserPermissions(user)

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: 'Dashboard' }]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {user?.displayName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This dashboard demonstrates a reusable, business-agnostic application framework.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Roles
            </CardTitle>
            <CardDescription>Assigned from configurable role definitions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge key={role.id} variant="info">
                {role.name}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>{permissions.length} effective permissions</CardDescription>
          </CardHeader>
          <CardContent className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {permissions.map((permission) => (
              <Badge key={permission}>{permission}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature flags</CardTitle>
            <CardDescription>Toggle framework capabilities via config</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Users module: {isFeatureEnabled('usersModule') ? 'enabled' : 'disabled'}</p>
            <p>Tasks module: {isFeatureEnabled('tasksModule') ? 'enabled' : 'disabled'}</p>
            <p>Audit logs: {isFeatureEnabled('auditLogs') ? 'enabled' : 'disabled'}</p>
            <p>File upload: {isFeatureEnabled('fileUpload') ? 'enabled' : 'disabled'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Can permission={PERMISSIONS.USER_VIEW}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Users module
              </CardTitle>
              <CardDescription>Demo CRUD module using the framework primitives</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/users" className="text-sm font-medium text-primary hover:underline">
                Open users
              </Link>
            </CardContent>
          </Card>
        </Can>
        <Can permission={PERMISSIONS.TASK_VIEW}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" /> Tasks module
              </CardTitle>
              <CardDescription>Second demo module proving core reusability</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks" className="text-sm font-medium text-primary hover:underline">
                Open tasks
              </Link>
            </CardContent>
          </Card>
        </Can>
      </div>
    </div>
  )
}
