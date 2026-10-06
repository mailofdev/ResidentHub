import { useEffect, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { useAppDispatch } from '@/app/store/hooks'
import {
  setAuthLoading,
  setAuthenticated,
  setUnauthenticated,
} from '@/app/store/slices/authSlice'
import { setTheme } from '@/app/store/slices/uiSlice'
import { ensureUserProfile } from '@/core/auth'
import { subscribeToAuthState, isFirebaseConfigured } from '@/core/firebase'
import { initThemeFromStorage } from '@/core/theme'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { ToastViewport } from '@/components/feedback/ToastViewport'
import { getErrorMessage } from '@/core/errors'

function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const theme = initThemeFromStorage()
    dispatch(setTheme(theme))

    if (!isFirebaseConfigured()) {
      dispatch(setUnauthenticated())
      return
    }

    dispatch(setAuthLoading())
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          dispatch(setUnauthenticated())
          return
        }
        const profile = await ensureUserProfile(firebaseUser)
        dispatch(setAuthenticated(profile))
      } catch (error) {
        console.error('[AuthBootstrap]', getErrorMessage(error))
        dispatch(setUnauthenticated())
      }
    })

    return unsubscribe
  }, [dispatch])

  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AuthBootstrap>
          {children}
          <ToastViewport />
        </AuthBootstrap>
      </ErrorBoundary>
    </Provider>
  )
}
