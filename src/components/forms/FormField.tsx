import type { ReactNode } from 'react'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, type SelectOption } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/utils'

export function FormField({
  label,
  error,
  hint,
  children,
  className,
  htmlFor,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
  htmlFor?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

export function FormInput({
  label,
  error,
  hint,
  registration,
  className,
  ...props
}: {
  label: string
  error?: string
  hint?: string
  registration: UseFormRegisterReturn
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} error={error} hint={hint} htmlFor={registration.name} className={className}>
      <Input id={registration.name} error={Boolean(error)} {...registration} {...props} />
    </FormField>
  )
}

export function FormTextarea({
  label,
  error,
  registration,
  ...props
}: {
  label: string
  error?: string
  registration: UseFormRegisterReturn
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField label={label} error={error} htmlFor={registration.name}>
      <Textarea id={registration.name} error={Boolean(error)} {...registration} {...props} />
    </FormField>
  )
}

export function FormSelect({
  label,
  error,
  registration,
  options,
  placeholder,
}: {
  label: string
  error?: string
  registration: UseFormRegisterReturn
  options: SelectOption[]
  placeholder?: string
}) {
  return (
    <FormField label={label} error={error} htmlFor={registration.name}>
      <Select
        id={registration.name}
        error={Boolean(error)}
        options={options}
        placeholder={placeholder}
        {...registration}
      />
    </FormField>
  )
}

export function FormCheckbox({
  label,
  registration,
}: {
  label: string
  registration: UseFormRegisterReturn
}) {
  return <Checkbox label={label} {...registration} />
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
}: {
  control: Control<T>
  name: FieldPath<T>
  label: string
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Switch
          id={String(name)}
          label={label}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
        />
      )}
    />
  )
}
