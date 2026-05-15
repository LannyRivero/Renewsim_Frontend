import { useAuthStore } from './authStore'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { UserProfile } from '../shared/types/auth'

const mockUser: UserProfile = {
  id: 1,
  username: 'john',
  roles: ['USER'],
}

beforeEach(() => {
  useAuthStore.getState().clearAuth()
})

describe('authStore', () => {
  describe('initial state', () => {
    it('has null accessToken', () => {
      expect(useAuthStore.getState().accessToken).toBeNull()
    })

    it('has null user', () => {
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('isAuthenticated is false', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('setTokens', () => {
    it('sets accessToken in memory', () => {
      useAuthStore.getState().setTokens('jwt-abc123', mockUser)
      expect(useAuthStore.getState().accessToken).toBe('jwt-abc123')
    })

    it('sets user profile', () => {
      useAuthStore.getState().setTokens('jwt-abc123', mockUser)
      expect(useAuthStore.getState().user).toEqual(mockUser)
    })

    it('sets isAuthenticated to true', () => {
      useAuthStore.getState().setTokens('jwt-abc123', mockUser)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('NEVER writes accessToken to localStorage', () => {
      const setSpy = vi.spyOn(Storage.prototype, 'setItem')
      useAuthStore.getState().setTokens('secret-jwt', mockUser)
      const calls = setSpy.mock.calls
      const tokenLeaked = calls.some(([, value]) =>
        typeof value === 'string' && value.includes('secret-jwt'),
      )
      expect(tokenLeaked).toBe(false)
      setSpy.mockRestore()
    })
  })

  describe('clearAuth', () => {
    it('resets accessToken to null', () => {
      useAuthStore.getState().setTokens('jwt-abc123', mockUser)
      useAuthStore.getState().clearAuth()
      expect(useAuthStore.getState().accessToken).toBeNull()
    })

    it('resets user to null', () => {
      useAuthStore.getState().setTokens('jwt-abc123', mockUser)
      useAuthStore.getState().clearAuth()
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('sets isAuthenticated to false', () => {
      useAuthStore.getState().setTokens('jwt-abc123', mockUser)
      useAuthStore.getState().clearAuth()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
