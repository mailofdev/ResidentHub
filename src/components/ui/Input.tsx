import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-destructive' : 'border-input',
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = 'Input'
