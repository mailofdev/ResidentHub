import type { ReactNode } from 'react'
import { Select, type SelectOption } from '@/components/ui/Select'

export function FilterPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${className ?? ''}`}>
      {children}
    </div>
  )
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
}) {
  return (
    <div className="w-full sm:w-48">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        options={[{ label: 'All', value: '' }, ...options]}
      />
    </div>
  )
}
