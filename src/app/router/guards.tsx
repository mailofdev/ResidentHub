import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'
import { PageLoader } from '@/components/feedback/Loader'
import { appConfig } from '@/core/config/app.config'

export function PublicRoute() {
  const { status, initialized, user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!initialized || status === 'loading') {
    return <PageLoader label="Checking session…" />
  }

  if (user) {
    const redirect = (location.state as { from?: string } | null)?.from || appConfig.defaultRoute
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

export function ProtectedRoute() {
  const { status, initialized, user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!initialized || status === 'loading') {
    return <PageLoader label="Loading workspace…" />
  }

  if (!user) {
    return <Navigate to={appConfig.authRoute} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
