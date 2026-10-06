import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Radio({ className, label, id, ...props }: RadioProps) {
  const inputId = id || `${props.name}-${props.value}`
  return (
    <label htmlFor={inputId} className="inline-flex items-center gap-2 text-sm text-foreground">
      <input
        id={inputId}
        type="radio"
        className={cn('h-4 w-4 border-input text-primary focus:ring-ring', className)}
        {...props}
      />
      {label}
    </label>
  )
}
