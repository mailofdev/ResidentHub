import type { AppUser } from '@/types'
import { COLLECTIONS, DEFAULT_ROLES } from '@/core/config/app.config'
import {
  createDocument,
  getDocument,
  upsertDocument,
  updateDocument,
} from '@/core/firebase/firestore'
import {
  changePassword,
  login as firebaseLogin,
  logout as firebaseLogout,
  resetPassword as firebaseResetPassword,
  signup as firebaseSignup,
  updateAuthProfile,
  type AuthCredentials,
  type SignupPayload,
} from '@/core/firebase/auth'
import { mapFirebaseError } from '@/core/errors'
import { createAuditLog } from '@/core/audit/audit.service'

function nowIso() {
  return new Date().toISOString()
}

function toAppUser(
  id: string,
  data: Partial<AppUser> & { email: string; displayName?: string },
): AppUser {
  return {
    id,
    email: data.email,
    displayName: data.displayName || data.email.split('@')[0] || 'User',
    photoURL: data.photoURL ?? null,
    roleIds: data.roleIds?.length ? data.roleIds : [DEFAULT_ROLES[2]?.id ?? 'role_viewer'],
    status: data.status ?? 'active',
    createdAt: data.createdAt ?? nowIso(),
    updatedAt: data.updatedAt ?? nowIso(),
  }
}

export async function ensureUserProfile(firebaseUser: {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}): Promise<AppUser> {
  const existing = await getDocument<AppUser>(COLLECTIONS.users, firebaseUser.uid)
  if (existing) return existing

  const profile = toAppUser(firebaseUser.uid, {
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL,
    roleIds: [DEFAULT_ROLES[0]?.id ?? 'role_superuser'],
  })

  await createDocument(COLLECTIONS.users, profile, firebaseUser.uid)
  return profile
}

export async function login(credentials: AuthCredentials): Promise<AppUser> {
  try {
    const user = await firebaseLogin(credentials)
    const profile = await ensureUserProfile(user)
    await createAuditLog({
      userId: profile.id,
      userEmail: profile.email,
      action: 'LOGIN',
      module: 'auth',
      entity: 'user',
      entityId: profile.id,
    })
    return profile
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function signup(payload: SignupPayload): Promise<AppUser> {
  try {
    const user = await firebaseSignup(payload)
    const profile = toAppUser(user.uid, {
      email: payload.email,
      displayName: payload.displayName,
      roleIds: [DEFAULT_ROLES[0]?.id ?? 'role_superuser'],
    })
    await createDocument(COLLECTIONS.users, profile, user.uid)
    await createAuditLog({
      userId: profile.id,
      userEmail: profile.email,
      action: 'CREATE',
      module: 'auth',
      entity: 'user',
      entityId: profile.id,
    })
    return profile
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function logout(user?: AppUser | null): Promise<void> {
  try {
    if (user) {
      await createAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGOUT',
        module: 'auth',
        entity: 'user',
        entityId: user.id,
      })
    }
    await firebaseLogout()
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await firebaseResetPassword(email)
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function updateProfile(userId: string, data: Partial<AppUser>): Promise<AppUser> {
  try {
    const updates = {
      ...data,
      updatedAt: nowIso(),
    }
    await upsertDocument(COLLECTIONS.users, userId, updates)
    if (data.displayName || data.photoURL !== undefined) {
      await updateAuthProfile({
        displayName: data.displayName,
        photoURL: data.photoURL ?? undefined,
      })
    }
    const updated = await getDocument<AppUser>(COLLECTIONS.users, userId)
    if (!updated) throw new Error('User profile not found')
    return updated
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function updateUserPassword(newPassword: string): Promise<void> {
  try {
    await changePassword(newPassword)
  } catch (error) {
    throw mapFirebaseError(error)
  }
}

export async function setUserStatus(userId: string, status: AppUser['status']): Promise<void> {
  await updateDocument(COLLECTIONS.users, userId, {
    status,
    updatedAt: nowIso(),
  })
}
