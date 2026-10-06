import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ThemeMode } from '@/types'
import { STORAGE_KEYS, appConfig } from '@/core/config/app.config'

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return appConfig.theme
  const stored = localStorage.getItem(STORAGE_KEYS.theme)
  return stored === 'dark' || stored === 'light' ? stored : appConfig.theme
}

function readSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true'
}

export interface UiState {
  theme: ThemeMode
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  globalLoading: boolean
  breadcrumbs: Array<{ label: string; path?: string }>
}

const initialState: UiState = {
  theme: readStoredTheme(),
  sidebarOpen: false,
  sidebarCollapsed: readSidebarCollapsed(),
  globalLoading: false,
  breadcrumbs: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
      localStorage.setItem(STORAGE_KEYS.theme, action.payload)
      document.documentElement.classList.toggle('dark', action.payload === 'dark')
    },
    toggleTheme(state) {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      state.theme = next
      localStorage.setItem(STORAGE_KEYS.theme, next)
      document.documentElement.classList.toggle('dark', next === 'dark')
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(state.sidebarCollapsed))
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload
    },
    setBreadcrumbs(state, action: PayloadAction<Array<{ label: string; path?: string }>>) {
      state.breadcrumbs = action.payload
    },
  },
})

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setGlobalLoading,
  setBreadcrumbs,
} = uiSlice.actions

export default uiSlice.reducer
