import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { SimulationHistoryPage } from './SimulationHistoryPage'
import { getRealSimulationHistory } from '../services/simulationService'

vi.mock('../services/simulationService', () => ({
  getRealSimulationHistory: vi.fn(),
  deleteSimulationById: vi.fn(),
}))

const mockedGetRealSimulationHistory = vi.mocked(getRealSimulationHistory)

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SimulationHistoryPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function buildRealHistoryRow(
  index: number,
  overrides: Partial<{
    id: string
    name: string
    status: 'draft' | 'processing' | 'completed' | 'failed'
    createdAt: string
    technology: 'solar' | 'wind' | 'hydro'
    locationLabel: string
    annualGenerationKwh: number
    annualSavings: number
    npv: number
    irrPct: number | null
    recommendation: 'recommended' | 'viable_with_reservations' | 'not_recommended'
    modelVersion: string
    resourceSource: 'PVGIS'
  }> = {},
) {
  return {
    id: overrides.id ?? `sim-${index}`,
    name: overrides.name ?? `Simulación ${index}`,
    status: overrides.status ?? 'completed',
    createdAt: overrides.createdAt ?? `2024-05-${String(index).padStart(2, '0')}T00:00:00.000Z`,
    technology: overrides.technology ?? 'solar',
    locationLabel: overrides.locationLabel ?? `Ubicación ${index}`,
    annualGenerationKwh: overrides.annualGenerationKwh ?? 100000 + index,
    annualSavings: overrides.annualSavings ?? 10000 + index,
    npv: overrides.npv ?? 5000 + index,
    irrPct: overrides.irrPct ?? 10 + index,
    recommendation: overrides.recommendation ?? 'recommended',
    modelVersion: overrides.modelVersion ?? 'solar-spain-v1',
    resourceSource: overrides.resourceSource ?? 'PVGIS',
  }
}

describe('SimulationHistoryPage', () => {
  it('renders empty state when there is no history', async () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({ items: [], total: 0 })
    renderPage()

    expect(await screen.findByText('Todavía no hay simulaciones. Creá tu primera simulación para ver resultados aquí.')).toBeInTheDocument()
  })

  it('renders heading and new simulation action', () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({ items: [], total: 0 })
    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Simulaciones disponibles para seguimiento' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nueva simulación' })).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar simulación')).toBeInTheDocument()
    expect(screen.getByLabelText('Abrir filtros')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fecha' })).toBeInTheDocument()
  })

  it('renders history table columns', () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({ items: [], total: 0 })
    renderPage()

    expect(screen.getByRole('columnheader', { name: 'Simulación' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Estado operativo' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Fecha' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ROI' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Ubicación' })).toBeInTheDocument()
  })

  it('renders simulation rows and action buttons', async () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({
      items: [
        buildRealHistoryRow(1, {
          id: 'sim-1',
          name: 'SOLAR - Sevilla, Spain',
          status: 'completed',
          locationLabel: 'Sevilla, Spain',
          createdAt: '2024-05-15T00:00:00.000Z',
          irrPct: 12,
        }),
      ],
      total: 1,
    })
    renderPage()

    expect((await screen.findAllByText('May 15, 2024')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('SOLAR - Sevilla, Spain').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sevilla, Spain').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Solar').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0)

    fireEvent.click(screen.getAllByLabelText('Acciones de simulación solar')[0])
    expect(screen.getAllByLabelText('Ver simulación solar').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Editar simulación solar').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Eliminar simulación solar').length).toBeGreaterThan(0)
  })

  it('filters visible simulations by search and technology', async () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({
      items: [
        buildRealHistoryRow(1, {
          id: 'sim-1',
          name: 'Parque Solar Norte',
          technology: 'solar',
          locationLabel: 'Sevilla, Spain',
          createdAt: '2024-05-15T00:00:00.000Z',
          irrPct: 12,
        }),
        buildRealHistoryRow(2, {
          id: 'sim-2',
          name: 'Corredor Eolico Sur',
          status: 'draft',
          technology: 'wind',
          locationLabel: 'Cadiz, Spain',
          createdAt: '2024-05-16T00:00:00.000Z',
          irrPct: 9,
        }),
      ],
      total: 2,
    })
    renderPage()

    expect((await screen.findAllByText('Parque Solar Norte')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Corredor Eolico Sur').length).toBeGreaterThan(0)

    fireEvent.change(screen.getByLabelText('Buscar simulación'), { target: { value: 'cadiz' } })
    expect(screen.queryAllByText('Parque Solar Norte')).toHaveLength(0)
    expect(screen.getAllByText('Corredor Eolico Sur').length).toBeGreaterThan(0)

    fireEvent.change(screen.getByLabelText('Buscar simulación'), { target: { value: '' } })
    fireEvent.click(screen.getByLabelText('Abrir filtros'))
    fireEvent.change(screen.getByLabelText('Filtrar por tecnología'), { target: { value: 'solar' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getAllByText('Parque Solar Norte').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Corredor Eolico Sur')).toHaveLength(0)
  })

  it('sorts and paginates visible simulations', async () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({
      items: [
        buildRealHistoryRow(1, { name: 'Alpha', irrPct: 11 }),
        buildRealHistoryRow(2, { name: 'Bravo', irrPct: 12 }),
        buildRealHistoryRow(3, { name: 'Charlie', irrPct: 13 }),
        buildRealHistoryRow(4, { name: 'Delta', irrPct: 14 }),
        buildRealHistoryRow(5, { name: 'Echo', irrPct: 15 }),
        buildRealHistoryRow(6, { name: 'Foxtrot', irrPct: 16 }),
        buildRealHistoryRow(7, { name: 'Golf', irrPct: 17 }),
        buildRealHistoryRow(8, { name: 'Hotel', irrPct: 18 }),
        buildRealHistoryRow(9, { name: 'India', irrPct: 19 }),
        buildRealHistoryRow(10, { name: 'Juliet', irrPct: 20 }),
        buildRealHistoryRow(11, { name: 'Zulu', irrPct: 99, createdAt: '2024-05-30T00:00:00.000Z' }),
      ],
      total: 11,
    })
    renderPage()

    expect((await screen.findAllByText('Zulu')).length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Alpha')).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Página actual, 1' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Simulación' }))
    expect((await screen.findAllByText('Alpha')).length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Zulu')).toHaveLength(0)

    fireEvent.click(screen.getByRole('button', { name: 'Simulación' }))
    expect((await screen.findAllByText('Zulu')).length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Alpha')).toHaveLength(0)

    fireEvent.click(screen.getByRole('button', { name: 'Estado operativo' }))
    expect(screen.getByRole('columnheader', { name: 'Estado operativo' })).toHaveAttribute('aria-sort', 'ascending')

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(screen.getByRole('button', { name: 'Página actual, 2' })).toBeInTheDocument()
  })
})
