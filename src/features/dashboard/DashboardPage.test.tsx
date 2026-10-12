import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardPage } from './DashboardPage'
import { getDashboardData } from './services/dashboardService'
import type { DashboardData } from './services/dashboardTypes'
import { useAuthStore } from '@/stores/authStore'

vi.mock('./services/dashboardService', () => ({
  getDashboardData: vi.fn(),
}))

const mockedGetDashboardData = vi.mocked(getDashboardData)

const emptyDashboardData: DashboardData = {
  summary: {
    totalSimulations: 0,
    activeSimulations: null,
    averageRoiPercent: null,
    medianPaybackYears: null,
    totalEnergyGeneratedKwh: null,
    totalCo2SavedKg: null,
    atRiskCount: null,
  },
  stats: [
    { label: 'Simulaciones totales', value: '0', icon: 'insights' },
    { label: 'CO2 evitado', value: 'N/D', icon: 'eco' },
    { label: 'ROI promedio', value: 'N/D', icon: 'trending_up' },
    { label: 'Energía generada', value: 'N/D', icon: 'bolt' },
  ],
  energyBySource: [],
  distribution: [],
  statusDistribution: [],
  efficiencyMetrics: [],
  targetVsActual: [],
  recommendedScenario: null,
  prioritizedScenarios: [],
  riskAlerts: [],
}

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockedGetDashboardData.mockReset()
    useAuthStore.getState().clearAuth()
  })

  it('shows a loading state before rendering the final empty dashboard state', async () => {
    useAuthStore.setState({
      accessToken: 'token-daniel',
      user: { id: 1, username: 'daniel', roles: ['USER'] },
      isAuthenticated: true,
    })
    mockedGetDashboardData.mockResolvedValueOnce(emptyDashboardData)

    renderDashboard()

    expect(screen.getByText('Cargando lectura de portafolio.')).toBeInTheDocument()
    expect(screen.queryByText('Todavía no hay suficiente señal para construir una lectura de portafolio.')).not.toBeInTheDocument()

    expect(await screen.findByText('Todavía no hay suficiente señal para construir una lectura de portafolio.')).toBeInTheDocument()
  })

  it('refetches dashboard data when the authenticated user changes', async () => {
    useAuthStore.setState({
      accessToken: 'token-daniel',
      user: { id: 1, username: 'daniel', roles: ['USER'] },
      isAuthenticated: true,
    })
    mockedGetDashboardData.mockResolvedValue(emptyDashboardData)

    renderDashboard()

    await waitFor(() => expect(mockedGetDashboardData).toHaveBeenCalledTimes(1))

    useAuthStore.setState({
      accessToken: 'token-demo-admin',
      user: { id: 2, username: 'demo.admin', roles: ['ADMIN'] },
      isAuthenticated: true,
    })

    await waitFor(() => expect(mockedGetDashboardData).toHaveBeenCalledTimes(2))
  })
})
