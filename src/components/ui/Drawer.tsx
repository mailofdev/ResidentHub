import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'
import { IconButton } from './IconButton'

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'left',
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'left' | 'right'
}) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      <button
        type="button"
        aria-label="Close drawer"
        className={cn('absolute inset-0 bg-black/50 transition', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <aside
        className={cn(
          'absolute top-0 flex h-full w-[min(100%,20rem)] flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform',
          side === 'left' ? 'left-0' : 'right-0',
          open
            ? 'translate-x-0'
            : side === 'left'
              ? '-translate-x-full'
              : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="text-sm font-semibold">{title}</h2>
          <IconButton label="Close" className="text-sidebar-foreground hover:bg-sidebar-muted" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      </aside>
    </div>
  )
}
