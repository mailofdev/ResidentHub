import type { CrudListParams } from '@/types'
import { COLLECTIONS } from '@/core/config/app.config'
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from '@/core/firebase/firestore'
import { createAuditLog } from '@/core/audit'
import { mapFirebaseError } from '@/core/errors'
import type { Task, TaskFormValues } from './types'

function nowIso() {
  return new Date().toISOString()
}

export async function listTasks(params: CrudListParams = {}): Promise<Task[]> {
  try {
    const tasks = await getDocuments<Task>(COLLECTIONS.tasks, {
      orderBy: {
        field: params.sortBy || 'createdAt',
        direction: params.sortDir || 'desc',
      },
    })
    const search = params.search?.trim().toLowerCase()
    return tasks.filter((task) => {
      if (search) {
        const haystack = `${task.title} ${task.description || ''}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      if (params.filters?.status && task.status !== params.filters.status) return false
      if (params.filters?.priority && task.priority !== params.filters.priority) return false
      return true
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function createTask(values: TaskFormValues, actorId: string): Promise<string> {
  try {
    const payload: Omit<Task, 'id'> = {
      ...values,
      description: values.description || '',
      assigneeId: actorId,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    const id = await createDocument(COLLECTIONS.tasks, payload)
    await createAuditLog({
      userId: actorId,
      action: 'CREATE',
      module: 'tasks',
      entity: 'task',
      entityId: id,
    })
    return id
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function updateTask(
  id: string,
  values: Partial<TaskFormValues>,
  actorId: string,
): Promise<void> {
  try {
    await updateDocument(COLLECTIONS.tasks, id, {
      ...values,
      updatedAt: nowIso(),
    })
    await createAuditLog({
      userId: actorId,
      action: 'UPDATE',
      module: 'tasks',
      entity: 'task',
      entityId: id,
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function deleteTask(id: string, actorId: string): Promise<void> {
  try {
    await deleteDocument(COLLECTIONS.tasks, id)
    await createAuditLog({
      userId: actorId,
      action: 'DELETE',
      module: 'tasks',
      entity: 'task',
      entityId: id,
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}
