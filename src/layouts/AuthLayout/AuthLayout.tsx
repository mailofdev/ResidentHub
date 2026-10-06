import { Link, Outlet } from 'react-router-dom'
import { getAppName } from '@/core/features'

export function AuthLayout() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_40%),radial-gradient(circle_at_bottom_right,#e2e8f0,transparent_35%),var(--color-background)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="h-10 w-10" />
            <span className="text-2xl font-semibold tracking-tight">{getAppName()}</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure access to your application workspace
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
