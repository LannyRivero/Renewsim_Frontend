import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { RequireRole } from './RequireRole'
import { useAuthStore } from '@/stores/authStore'

function ProtectedAdmin() {
  return <p>Admin content</p>
}

function Dashboard() {
  return <p>Dashboard page</p>
}

describe('RequireRole', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('renders children when user has required role', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 1, username: 'admin', roles: ['ADMIN'] },
    })

    render(
      <MemoryRouter initialEntries={['/simulador/admin']}>
        <Routes>
          <Route
            path="/simulador/admin"
            element={
              <RequireRole role="ADMIN">
                <ProtectedAdmin />
              </RequireRole>
            }
          />
          <Route path="/simulador" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Admin content')).toBeInTheDocument()
  })

  it('accepts ROLE_ADMIN naming convention', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 1, username: 'admin', roles: ['ROLE_ADMIN'] },
    })

    render(
      <MemoryRouter initialEntries={['/simulador/admin']}>
        <Routes>
          <Route
            path="/simulador/admin"
            element={
              <RequireRole role="ADMIN">
                <ProtectedAdmin />
              </RequireRole>
            }
          />
          <Route path="/simulador" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Admin content')).toBeInTheDocument()
  })

  it('redirects to /simulador when user lacks role', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 2, username: 'user', roles: ['USER'] },
    })

    render(
      <MemoryRouter initialEntries={['/simulador/admin']}>
        <Routes>
          <Route
            path="/simulador/admin"
            element={
              <RequireRole role="ADMIN">
                <ProtectedAdmin />
              </RequireRole>
            }
          />
          <Route path="/simulador" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByText('Admin content')).not.toBeInTheDocument()
    expect(screen.getByText('Dashboard page')).toBeInTheDocument()
  })
})
