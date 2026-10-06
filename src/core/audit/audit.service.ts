import type { AuditLog } from '@/types'
import { COLLECTIONS } from '@/core/config/app.config'
import { createDocument, getDocuments } from '@/core/firebase/firestore'
import { isFeatureEnabled } from '@/core/features'
import { isFirebaseConfigured } from '@/core/firebase'
import { mapFirebaseError } from '@/core/errors'

export async function createAuditLog(
  payload: Omit<AuditLog, 'id' | 'timestamp'> & { timestamp?: string },
): Promise<string | null> {
  if (!isFeatureEnabled('auditLogs') || !isFirebaseConfigured()) return null

  try {
    const entry: Omit<AuditLog, 'id'> = {
      ...payload,
      timestamp: payload.timestamp ?? new Date().toISOString(),
    }
    return await createDocument(COLLECTIONS.auditLogs, entry)
  } catch (error) {
    console.warn('[Audit]', mapFirebaseError(error).message)
    return null
  }
}

export async function listAuditLogs(limitCount = 50): Promise<AuditLog[]> {
  if (!isFeatureEnabled('auditLogs') || !isFirebaseConfigured()) return []
  try {
    return await getDocuments<AuditLog>(COLLECTIONS.auditLogs, {
      orderBy: { field: 'timestamp', direction: 'desc' },
      limit: limitCount,
    })
  } catch (error) {
    throw mapFirebaseError(error)
  }
}
