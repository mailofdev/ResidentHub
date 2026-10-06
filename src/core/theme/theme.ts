import { STORAGE_KEYS } from '@/core/config/app.config'
import type { ThemeMode } from '@/types'

export function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(STORAGE_KEYS.theme, theme)
}

export function initThemeFromStorage(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEYS.theme)
  const theme: ThemeMode = stored === 'dark' ? 'dark' : 'light'
  applyTheme(theme)
  return theme
}
