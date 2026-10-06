import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/utils'

export function Dropdown({
  trigger,
  children,
  align = 'right',
}: {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((value) => !value)}>{trigger}</div>
      {open ? (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-48 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  danger,
}: {
  children: ReactNode
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted',
        danger && 'text-destructive',
      )}
    >
      {children}
    </button>
  )
}
