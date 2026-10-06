import { cn } from '@/utils'

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export function Switch({ checked, onCheckedChange, label, disabled, id }: SwitchProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-3 text-sm text-foreground">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition',
            checked && 'translate-x-5',
          )}
        />
      </button>
      {label}
    </label>
  )
}
