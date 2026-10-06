import type { AppNotification } from '@/types'
import { COLLECTIONS } from '@/core/config/app.config'
import { createDocument, getDocuments, updateDocument } from '@/core/firebase/firestore'
import { isFeatureEnabled } from '@/core/features'
import { isFirebaseConfigured } from '@/core/firebase'
import { mapFirebaseError } from '@/core/errors'

export async function createNotification(
  payload: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & {
    createdAt?: string
    read?: boolean
  },
): Promise<string | null> {
  if (!isFeatureEnabled('notifications') || !isFirebaseConfigured()) return null
  try {
    return await createDocument(COLLECTIONS.notifications, {
      ...payload,
      read: payload.read ?? false,
      createdAt: payload.createdAt ?? new Date().toISOString(),
    })
  } catch (error) {
    console.warn('[Notifications]', mapFirebaseError(error).message)
    return null
  }
}

export async function listUserNotifications(userId: string): Promise<AppNotification[]> {
  if (!isFeatureEnabled('notifications') || !isFirebaseConfigured()) return []
  try {
    return await getDocuments<AppNotification>(COLLECTIONS.notifications, {
      filters: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: 50,
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDocument(COLLECTIONS.notifications, id, { read: true })
}
