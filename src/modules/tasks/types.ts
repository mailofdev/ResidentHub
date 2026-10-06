export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  assigneeId?: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskFormValues {
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
}
