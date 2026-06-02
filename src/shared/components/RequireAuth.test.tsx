import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'

function Protected() {
  return <p>Protected content</p>
}

function LoginPage() {
  return <p>Login page</p>
}

function renderWithRouter(token: string | null) {
  if (token) {
    localStorage.setItem('renewsim-token', token)
  } else {
    localStorage.removeItem('renewsim-token')
  }

  return render(
    <MemoryRouter initialEntries={['/simulador']}>
      <Routes>
        <Route
          path="/simulador"
          element={
            <RequireAuth>
              <Protected />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => localStorage.clear())

describe('RequireAuth', () => {
  it('renders children when token exists in localStorage', () => {
    renderWithRouter('fake-token')
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /login when no token', () => {
    renderWithRouter(null)
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('preserves the intended location so login can redirect back', () => {
    // After redirect, the login page is shown (location.state.from would be /simulador)
    renderWithRouter(null)
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })
})
