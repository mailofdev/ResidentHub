import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>
