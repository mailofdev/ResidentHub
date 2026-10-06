import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import notificationReducer from './slices/notificationSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notifications: notificationReducer,
})

export function createAppStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export const store = createAppStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

/**
 * Business modules can create their own stores/slices locally when needed.
 * Prefer local state for temporary UI, and add module slices via a dedicated
 * module store registration pattern in the consuming application.
 */
