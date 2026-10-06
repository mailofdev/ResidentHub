import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from './firebase.config'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignupPayload extends AuthCredentials {
  displayName: string
}

export async function login({ email, password }: AuthCredentials) {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
  return credential.user
}

export async function signup({ email, password, displayName }: SignupPayload) {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
  await updateProfile(credential.user, { displayName })
  return credential.user
}

export async function logout() {
  await signOut(getFirebaseAuth())
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email)
}

export function getCurrentUser(): FirebaseUser | null {
  if (!isFirebaseConfigured()) return null
  return getFirebaseAuth().currentUser
}

export async function changePassword(newPassword: string) {
  const user = getCurrentUser()
  if (!user) throw new Error('No authenticated user')
  await updatePassword(user, newPassword)
}

export async function updateAuthProfile(data: { displayName?: string; photoURL?: string }) {
  const user = getCurrentUser()
  if (!user) throw new Error('No authenticated user')
  await updateProfile(user, data)
}

export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void,
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    callback(null)
    return () => undefined
  }
  return onAuthStateChanged(getFirebaseAuth(), callback)
}
