import type { FirebaseError } from 'firebase/app'

const FIREBASE_ERROR_MAP: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/requires-recent-login': 'Please sign in again to complete this action.',
  'permission-denied': 'You do not have permission to perform this action.',
  'not-found': 'The requested resource was not found.',
  unavailable: 'Service temporarily unavailable. Please try again.',
}

export class AppError extends Error {
  code?: string
  cause?: unknown

  constructor(message: string, code?: string, cause?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.cause = cause
  }
}

export function mapFirebaseError(error: unknown): AppError {
  if (error instanceof AppError) return error

  const firebaseError = error as FirebaseError | undefined
  const code = firebaseError?.code
  const mapped = code ? FIREBASE_ERROR_MAP[code] : undefined

  return new AppError(
    mapped || firebaseError?.message || 'Something went wrong. Please try again.',
    code,
    error,
  )
}

export function getErrorMessage(error: unknown): string {
  return mapFirebaseError(error).message
}
