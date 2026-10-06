import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import type { NotificationType } from '@/types'
import { cn } from '@/utils'
import { IconButton } from '@/components/ui/IconButton'

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles: Record<NotificationType, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-primary/30 bg-primary/10 text-primary',
}

export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  className,
}: {
  type?: NotificationType
  title: string
  message?: string
  onClose?: () => void
  className?: string
}) {
  const Icon = icons[type]
  return (
    <div className={cn('flex gap-3 rounded-xl border px-4 py-3', styles[type], className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {message ? <p className="mt-1 text-sm text-muted-foreground">{message}</p> : null}
      </div>
      {onClose ? (
        <IconButton label="Dismiss" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </IconButton>
      ) : null}
    </div>
  )
}
