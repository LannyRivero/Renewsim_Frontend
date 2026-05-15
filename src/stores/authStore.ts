import { create } from 'zustand'
import type { UserProfile } from '@/shared/types'

// ─────────────────────────────────────────────────────────────
//  SECURITY: accessToken is stored ONLY in Zustand memory.
//  It is never written to localStorage, sessionStorage, or any
//  other persistent browser storage.
// ─────────────────────────────────────────────────────────────

interface AuthState {
  accessToken: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, user: UserProfile) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setTokens: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: true }),

  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false }),
}))
