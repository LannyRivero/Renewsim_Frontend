import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { RootLayout } from './RootLayout'
import { useAuthStore } from '@/stores/authStore'

function renderLayout(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<p>Home content</p>} />
          <Route path="login" element={<p>Login page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('RootLayout auth actions', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    })
    localStorage.clear()
    useAuthStore.getState().clearAuth()
  })

  it('shows Sign In and Sign Up when user is not authenticated', () => {
    renderLayout()

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })

  it('shows profile and logout when user is authenticated', () => {
    useAuthStore.setState({
      accessToken: 'token-1',
      isAuthenticated: true,
      user: { id: 7, username: 'omar', roles: ['USER'] },
    })

    renderLayout()

    expect(screen.getByRole('link', { name: 'Hi, omar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()
  })

  it('clears auth and redirects to login on logout', () => {
    localStorage.setItem('renewsim-token', 'legacy-token')
    useAuthStore.setState({
      accessToken: 'token-1',
      isAuthenticated: true,
      user: { id: 9, username: 'lanny', roles: ['USER'] },
    })

    renderLayout()
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }))

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(localStorage.getItem('renewsim-token')).toBeNull()
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })
})
