import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from '@/app/store/hooks'
import { setBreadcrumbs } from '@/app/store/slices/uiSlice'
import { appConfig } from '@/core/config/app.config'
import { getErrorMessage } from '@/core/errors'
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Loader } from '@/components/feedback/Loader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { formatDateTime } from '@/utils'
import { getUser } from './user.service'
import type { UserRecord } from './types'

export function UserDetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [user, setUser] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!id) return
      try {
        setLoading(true)
        const record = await getUser(id)
        setUser(record)
        dispatch(
          setBreadcrumbs([
            { label: 'Users', path: '/users' },
            { label: record?.displayName || 'User' },
          ]),
        )
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id, dispatch])

  if (loading) return <Loader />
  if (error) return <ErrorState description={error} />
  if (!user) {
    return (
      <ErrorState
        title="User not found"
        description="This user record does not exist."
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/users" className="text-sm text-primary hover:underline">
          ← Back to users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{user.displayName}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="text-muted-foreground">Status:</span>{' '}
            <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Roles:</span>
            {user.roleIds.map((roleId) => {
              const role = appConfig.roles.find((item) => item.id === roleId)
              return (
                <Badge key={roleId} variant="info">
                  {role?.name || roleId}
                </Badge>
              )
            })}
          </div>
          <p>
            <span className="text-muted-foreground">Created:</span> {formatDateTime(user.createdAt)}
          </p>
          <p>
            <span className="text-muted-foreground">Updated:</span> {formatDateTime(user.updatedAt)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
