import type { ReactNode } from 'react'
import { cn } from '@/utils'

export function Tooltip({
  content,
  children,
  className,
}: {
  content: string
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background group-hover:block">
        {content}
      </span>
    </span>
  )
}
