import { cn } from '@/utils'

export function Divider({ className, label }: { className?: string; label?: string }) {
  if (!label) return <hr className={cn('border-border', className)} />
  return (
    <div className={cn('flex items-center gap-3 text-xs text-muted-foreground', className)}>
      <div className="h-px flex-1 bg-border" />
      <span>{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
