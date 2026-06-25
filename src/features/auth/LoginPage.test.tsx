import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './LoginPage'
import { useAuthStore } from '@/stores/authStore'

vi.mock('./components/LoginForm', () => ({
  LoginForm: ({ onSuccess }: { onSuccess: (token: string) => void }) => (
    <button type="button" onClick={() => onSuccess('token-123')}>
      Mock login success
    </button>
  ),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().clearAuth()
  })

  it('redirects to intended protected route after successful login', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/login',
            state: { from: { pathname: '/simulador/detalles' } },
          },
        ]}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/simulador/detalles" element={<p>Details page</p>} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mock login success' }))
    expect(screen.getByText('Details page')).toBeInTheDocument()
  })

  it('redirects to /simulador by default when no from state exists', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/simulador" element={<p>Simulator home</p>} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mock login success' }))
    expect(screen.getByText('Simulator home')).toBeInTheDocument()
  })
})
