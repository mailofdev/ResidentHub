import { z } from 'zod'

export const userFormSchema = z.object({
  displayName: z.string().min(2, 'Name is required'),
  email: z.email('Enter a valid email'),
  roleIds: z.array(z.string()).min(1, 'Select at least one role'),
  status: z.enum(['active', 'inactive', 'invited', 'suspended']),
})

export type UserFormSchema = z.infer<typeof userFormSchema>
