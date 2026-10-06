import type { UserRecord, UserFormValues } from './types'
import { COLLECTIONS } from '@/core/config/app.config'
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from '@/core/firebase/firestore'
import { createAuditLog } from '@/core/audit'
import { mapFirebaseError } from '@/core/errors'
import type { CrudListParams } from '@/types'

function nowIso() {
  return new Date().toISOString()
}

export async function listUsers(params: CrudListParams = {}): Promise<UserRecord[]> {
  try {
    const users = await getDocuments<UserRecord>(COLLECTIONS.users, {
      orderBy: {
        field: params.sortBy || 'createdAt',
        direction: params.sortDir || 'desc',
      },
    })

    const search = params.search?.trim().toLowerCase()
    return users.filter((user) => {
      if (search) {
        const haystack = `${user.displayName} ${user.email}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      if (params.filters?.status && user.status !== params.filters.status) return false
      if (params.filters?.roleId && !user.roleIds.includes(String(params.filters.roleId))) {
        return false
      }
      return true
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function getUser(id: string): Promise<UserRecord | null> {
  try {
    return await getDocument<UserRecord>(COLLECTIONS.users, id)
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function createUser(
  values: UserFormValues,
  actorId: string,
): Promise<string> {
  try {
    const payload: Omit<UserRecord, 'id'> = {
      ...values,
      photoURL: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    const id = await createDocument(COLLECTIONS.users, payload)
    await createAuditLog({
      userId: actorId,
      action: 'CREATE',
      module: 'users',
      entity: 'user',
      entityId: id,
      metadata: { email: values.email },
    })
    return id
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function updateUser(
  id: string,
  values: Partial<UserFormValues>,
  actorId: string,
): Promise<void> {
  try {
    await updateDocument(COLLECTIONS.users, id, {
      ...values,
      updatedAt: nowIso(),
    })
    await createAuditLog({
      userId: actorId,
      action: 'UPDATE',
      module: 'users',
      entity: 'user',
      entityId: id,
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function deleteUser(id: string, actorId: string): Promise<void> {
  try {
    await deleteDocument(COLLECTIONS.users, id)
    await createAuditLog({
      userId: actorId,
      action: 'DELETE',
      module: 'users',
      entity: 'user',
      entityId: id,
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}
