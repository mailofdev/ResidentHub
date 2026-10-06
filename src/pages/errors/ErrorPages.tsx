import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui'

export function UnauthorizedPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <div className="mb-4 rounded-full bg-warning/15 p-4 text-warning">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">403</p>
      <h1 className="mt-2 text-2xl font-semibold">Unauthorized</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You do not have permission to view this page. Ask an administrator to grant the required
        role or permission.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The page you requested does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="mt-6 text-sm font-medium text-primary hover:underline">
        Return to dashboard
      </Link>
    </div>
  )
}
