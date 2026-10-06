import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-24 w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-destructive' : 'border-input',
        className,
      )}
      {...props}
    />
  ),
)

Textarea.displayName = 'Textarea'
