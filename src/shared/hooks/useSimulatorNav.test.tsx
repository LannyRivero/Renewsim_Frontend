import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useSimulatorNav } from './useSimulatorNav'

// Captures the latest navigate call
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

afterEach(() => {
  localStorage.clear()
  mockNavigate.mockClear()
})

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('useSimulatorNav', () => {
  it('navigates to /simulador when token exists', () => {
    localStorage.setItem('renewsim-token', 'fake-token')
    const { result } = renderHook(() => useSimulatorNav(), { wrapper })
    result.current()
    expect(mockNavigate).toHaveBeenCalledWith('/simulador')
  })

  it('navigates to /login with state.from when no token', () => {
    const { result } = renderHook(() => useSimulatorNav(), { wrapper })
    result.current()
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { from: '/simulador' },
    })
  })
})
