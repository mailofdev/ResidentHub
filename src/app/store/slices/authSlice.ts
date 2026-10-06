import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppUser } from '@/types'

export interface AuthState {
  user: AppUser | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  error: string | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading'
      state.error = null
    },
    setAuthenticated(state, action: PayloadAction<AppUser>) {
      state.user = action.payload
      state.status = 'authenticated'
      state.error = null
      state.initialized = true
    },
    setUnauthenticated(state) {
      state.user = null
      state.status = 'unauthenticated'
      state.initialized = true
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.status = state.user ? 'authenticated' : 'unauthenticated'
    },
    updateAuthUser(state, action: PayloadAction<AppUser>) {
      state.user = action.payload
    },
    clearAuthError(state) {
      state.error = null
    },
  },
})

export const {
  setAuthLoading,
  setAuthenticated,
  setUnauthenticated,
  setAuthError,
  updateAuthUser,
  clearAuthError,
} = authSlice.actions

export default authSlice.reducer
