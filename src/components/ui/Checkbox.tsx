import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const inputId = id || props.name
  return (
    <label htmlFor={inputId} className="inline-flex items-center gap-2 text-sm text-foreground">
      <input
        id={inputId}
        type="checkbox"
        className={cn('h-4 w-4 rounded border-input text-primary focus:ring-ring', className)}
        {...props}
      />
      {label}
    </label>
  )
}
