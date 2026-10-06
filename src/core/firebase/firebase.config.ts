import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

export interface FirebaseEnvConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

function readFirebaseConfig(): FirebaseEnvConfig | null {
  const config: FirebaseEnvConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  }

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.warn(
      `[Firebase] Missing configuration: ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill in your Firebase project values.',
    )
    return null
  }

  return config
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null
let initError: string | null = null

export function isFirebaseConfigured(): boolean {
  return readFirebaseConfig() !== null
}

export function getFirebaseInitError(): string | null {
  return initError
}

export function getFirebaseApp(): FirebaseApp {
  if (app) return app

  const config = readFirebaseConfig()
  if (!config) {
    initError =
      'Firebase is not configured. Set VITE_FIREBASE_* variables in your .env file.'
    throw new Error(initError)
  }

  try {
    app = initializeApp(config)
    return app
  } catch (error) {
    initError = error instanceof Error ? error.message : 'Failed to initialize Firebase'
    throw error
  }
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp())
  }
  return storage
}
