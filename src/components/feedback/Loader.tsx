import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'

export function Loader({
  label = 'Loading…',
  className,
  size = 'md',
}: {
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader label={label} size="lg" />
    </div>
  )
}
