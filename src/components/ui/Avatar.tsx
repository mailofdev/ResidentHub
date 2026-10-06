import { cn } from '@/utils'

export interface AvatarProps {
  name?: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

function initials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-primary/15 font-semibold text-primary',
        sizes[size],
        className,
      )}
      aria-label={name || 'Avatar'}
    >
      {initials(name)}
    </div>
  )
}
