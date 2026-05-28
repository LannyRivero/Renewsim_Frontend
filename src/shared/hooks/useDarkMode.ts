import { useEffect, useState } from 'react'

const STORAGE_KEY = 'renewsim-theme'
const THEME_EVENT = 'renewsim-theme-change'

type ThemeMode = 'light' | 'dark' | 'system'

function getStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // localStorage not available
  }
  return 'system'
}

function getSystemPrefersDark(): boolean {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveDark(mode: ThemeMode): boolean {
  if (mode === 'system') return getSystemPrefersDark()
  return mode === 'dark'
}

function getInitialDark(): boolean {
  return resolveDark(getStoredMode())
}

export function useDarkMode() {
  const [mode, setMode] = useState<ThemeMode>(getStoredMode)
  const [isDark, setIsDark] = useState<boolean>(getInitialDark)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (mode === 'system') {
        setIsDark(media.matches)
      }
    }

    const handleThemeEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ mode: ThemeMode }>
      const nextMode = customEvent.detail?.mode
      if (!nextMode) return
      setMode(nextMode)
      setIsDark(resolveDark(nextMode))
    }

    media.addEventListener('change', handleSystemThemeChange)
    window.addEventListener(THEME_EVENT, handleThemeEvent as EventListener)

    return () => {
      media.removeEventListener('change', handleSystemThemeChange)
      window.removeEventListener(THEME_EVENT, handleThemeEvent as EventListener)
    }
  }, [mode])

  function setTheme(nextMode: ThemeMode) {
    setMode(nextMode)
    setIsDark(resolveDark(nextMode))
    try {
      localStorage.setItem(STORAGE_KEY, nextMode)
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { mode: nextMode } }))
  }

  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  return { isDark, mode, toggle, setTheme }
}
