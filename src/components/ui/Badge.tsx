import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-muted text-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-destructive/15 text-destructive',
  info: 'bg-primary/15 text-primary',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
