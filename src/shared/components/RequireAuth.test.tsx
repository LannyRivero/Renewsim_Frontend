import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'

function Protected() {
  return <p>Contenido protegido</p>
}

function LoginPage() {
  return <p>Página de login</p>
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
        <Route path="/iniciar-sesion" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => localStorage.clear())

describe('RequireAuth', () => {
  it('renders children when token exists in localStorage', () => {
    renderWithRouter('fake-token')
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('redirects to /iniciar-sesion when no token', () => {
    renderWithRouter(null)
    expect(screen.getByText('Página de login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('preserves the intended location so login can redirect back', () => {
    // After redirect, the login page is shown (location.state.from would be /simulador)
    renderWithRouter(null)
    expect(screen.getByText('Página de login')).toBeInTheDocument()
  })
})
