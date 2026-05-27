import { render, screen } from '@testing-library/react'
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
  })

  it('hides admin link for non-admin users', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 3, username: 'omar', roles: ['USER'] },
    })

    renderSidebar()

    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })

  it('shows admin link for admin users', () => {
    useAuthStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: { id: 1, username: 'admin', roles: ['ADMIN'] },
    })

    renderSidebar()

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })
})
