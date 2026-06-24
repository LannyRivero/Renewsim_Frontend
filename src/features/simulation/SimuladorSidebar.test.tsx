import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { SimuladorSidebar } from './SimuladorSidebar'
import { useAuthStore } from '@/stores/authStore'

function renderSidebar() {
  return render(
    <MemoryRouter>
      <SimuladorSidebar />
    </MemoryRouter>,
  )
}

describe('SimuladorSidebar', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    localStorage.removeItem('renewsim-theme')
  })

  it('hides admin link for non-admin users', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 3, username: 'omar', roles: ['USER'] },
    })

    renderSidebar()

    expect(screen.queryByText('Panel de admin')).not.toBeInTheDocument()
    expect(screen.queryByText('Tecnologías')).not.toBeInTheDocument()
  })

  it('shows admin link for admin users', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 1, username: 'admin', roles: ['ADMIN'] },
    })

    renderSidebar()

    expect(screen.getByText('Panel de admin')).toBeInTheDocument()
    expect(screen.getByText('Tecnologías')).toBeInTheDocument()
  })

  it('clears auth and token on logout', () => {
    localStorage.setItem('renewsim-token', 'legacy-token')
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 1, username: 'admin', roles: ['ADMIN'] },
    })

    renderSidebar()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(localStorage.getItem('renewsim-token')).toBeNull()
  })

  it('updates theme mode from sidebar appearance controls', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 1, username: 'admin', roles: ['ADMIN'] },
    })

    renderSidebar()
    fireEvent.click(screen.getByRole('button', { name: /Apariencia/i }))
    fireEvent.click(screen.getByRole('button', { name: 'dark' }))

    expect(localStorage.getItem('renewsim-theme')).toBe('dark')
  })

  it('links the brand block to the home page', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 1, username: 'admin', roles: ['ADMIN'] },
    })

    renderSidebar()

    expect(screen.getByRole('link', { name: /RenewSim/i })).toHaveAttribute('href', '/')
  })
})
