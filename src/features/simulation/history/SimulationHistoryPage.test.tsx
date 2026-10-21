import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SimulationHistoryPage } from './SimulationHistoryPage'
import { deleteSimulationById, getRealSimulationHistory } from '../services/simulationService'
import { buildSimulationHistoryRowMock } from '../test/simulationTestFactories'

vi.mock('../services/simulationService', () => ({
  getRealSimulationHistory: vi.fn(),
  deleteSimulationById: vi.fn(),
}))

const mockedGetRealSimulationHistory = vi.mocked(getRealSimulationHistory)
const mockedDeleteSimulationById = vi.mocked(deleteSimulationById)

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

describe('SimulationHistoryPage', () => {
  it('renders empty state when there is no history', async () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({ items: [], total: 0 })
    renderPage()

    const messages = await screen.findAllByText('Todavía no hay simulaciones. Creá tu primera simulación para ver resultados aquí.')
    expect(messages.length).toBeGreaterThanOrEqual(1)
  })

  it('renders heading and new simulation action', () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({ items: [], total: 0 })
    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Simulaciones disponibles para seguimiento' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nueva simulación' })).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar por nombre')).toBeInTheDocument()
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
        buildSimulationHistoryRowMock(1, {
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

  it('asks for confirmation before deleting a simulation', async () => {
    mockedGetRealSimulationHistory.mockResolvedValue({
      items: [
        buildSimulationHistoryRowMock(1, {
          id: 'sim-1',
          name: 'SOLAR - Sevilla, Spain',
          technology: 'solar',
        }),
      ],
      total: 1,
    })
    mockedDeleteSimulationById.mockResolvedValueOnce(undefined)
    renderPage()

    fireEvent.click((await screen.findAllByLabelText('Acciones de simulación solar'))[0])
    fireEvent.click(screen.getAllByLabelText('Eliminar simulación solar')[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('¿Seguro que querés eliminar "SOLAR - Sevilla, Spain"? Esta acción no se puede deshacer.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    await waitFor(() => {
      expect(mockedDeleteSimulationById).toHaveBeenCalled()
      expect(mockedDeleteSimulationById.mock.calls[0]?.[0]).toBe('sim-1')
    })
  })

  it('filters visible simulations by name and location', async () => {
    const items = [
        buildSimulationHistoryRowMock(1, {
          id: 'sim-1',
          name: 'Parque Solar Norte',
          technology: 'solar',
          locationLabel: 'Sevilla, Spain',
          createdAt: '2024-05-15T00:00:00.000Z',
          irrPct: 12,
        }),
        buildSimulationHistoryRowMock(2, {
          id: 'sim-2',
          name: 'Corredor Eolico Sur',
          status: 'draft',
          technology: 'wind',
          locationLabel: 'Cadiz, Spain',
          createdAt: '2024-05-16T00:00:00.000Z',
          irrPct: 9,
        }),
    ]
    mockedGetRealSimulationHistory.mockImplementation(async (query) => {
      const normalizedName = query?.name?.toLocaleLowerCase()
      const normalizedLocation = query?.location?.toLocaleLowerCase()
      const filteredItems = items.filter((item) => {
        const matchesName = !normalizedName || item.name.toLocaleLowerCase().includes(normalizedName)
        const matchesLocation = !normalizedLocation || item.locationLabel.toLocaleLowerCase().includes(normalizedLocation)
        return matchesName && matchesLocation
      })
      const size = query?.size ?? 10
      const page = query?.page ?? 0
      return { items: filteredItems.slice(page * size, (page + 1) * size), total: filteredItems.length }
    })
    renderPage()

    expect((await screen.findAllByText('Parque Solar Norte')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Corredor Eolico Sur').length).toBeGreaterThan(0)

    fireEvent.change(screen.getByLabelText('Buscar por nombre'), { target: { value: 'corredor' } })
    await waitFor(() => {
      expect(screen.queryAllByText('Parque Solar Norte')).toHaveLength(0)
      expect(screen.getAllByText('Corredor Eolico Sur').length).toBeGreaterThan(0)
    })

    fireEvent.change(screen.getByLabelText('Buscar por nombre'), { target: { value: '' } })
    await waitFor(() => expect(screen.getAllByText('Corredor Eolico Sur').length).toBeGreaterThan(0))
    fireEvent.click(screen.getByLabelText('Abrir filtros'))
    fireEvent.change(screen.getByLabelText('Filtrar por ubicación'), { target: { value: 'Sevilla' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect((await screen.findAllByText('Parque Solar Norte')).length).toBeGreaterThan(0)
    await waitFor(() => expect(screen.queryAllByText('Corredor Eolico Sur')).toHaveLength(0))
  })

  it('searches by name before applying server pagination', async () => {
    const items = paginatedHistoryRows()
    mockedGetRealSimulationHistory.mockImplementation(async (query) => {
      const normalizedName = query?.name?.toLocaleLowerCase()
      const matchingItems = normalizedName
        ? items.filter((item) => item.name.toLocaleLowerCase().includes(normalizedName))
        : items
      const page = query?.page ?? 0
      const size = query?.size ?? 10
      return { items: matchingItems.slice(page * size, (page + 1) * size), total: matchingItems.length }
    })
    renderPage()

    expect((await screen.findAllByText('Alpha')).length).toBeGreaterThan(0)
    const searchInput = screen.getByLabelText('Buscar por nombre')
    fireEvent.change(searchInput, { target: { value: 'zulu' } })
    expect(searchInput).toHaveValue('zulu')

    await waitFor(() => {
      expect(mockedGetRealSimulationHistory).toHaveBeenLastCalledWith(
        expect.objectContaining({ name: 'zulu', page: 0 }),
      )
    })
    expect((await screen.findAllByText('Zulu')).length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Alpha')).toHaveLength(0)
  })

  function paginatedHistoryRows() {
    return [
      buildSimulationHistoryRowMock(1, { name: 'Alpha', irrPct: 11 }),
      buildSimulationHistoryRowMock(2, { name: 'Bravo', irrPct: 12 }),
      buildSimulationHistoryRowMock(3, { name: 'Charlie', irrPct: 13 }),
      buildSimulationHistoryRowMock(4, { name: 'Delta', irrPct: 14 }),
      buildSimulationHistoryRowMock(5, { name: 'Echo', irrPct: 15 }),
      buildSimulationHistoryRowMock(6, { name: 'Foxtrot', irrPct: 16 }),
      buildSimulationHistoryRowMock(7, { name: 'Golf', irrPct: 17 }),
      buildSimulationHistoryRowMock(8, { name: 'Hotel', irrPct: 18 }),
      buildSimulationHistoryRowMock(9, { name: 'India', irrPct: 19 }),
      buildSimulationHistoryRowMock(10, { name: 'Juliet', irrPct: 20 }),
      buildSimulationHistoryRowMock(11, { name: 'Zulu', irrPct: 99, createdAt: '2024-05-30T00:00:00.000Z' }),
    ]
  }

  it('sorts visible simulations', async () => {
    const historyRows = paginatedHistoryRows()
    mockedGetRealSimulationHistory.mockImplementation(async (query) => {
      const sortField = query?.sortBy ?? 'createdAt'
      const direction = query?.direction ?? 'desc'
      const sortedRows = [...historyRows].sort((left, right) => {
        const leftFieldValue = sortField === 'location' ? left.locationLabel : left[sortField]
        const rightFieldValue = sortField === 'location' ? right.locationLabel : right[sortField]
        const leftValue = String(leftFieldValue ?? '').toLocaleLowerCase()
        const rightValue = String(rightFieldValue ?? '').toLocaleLowerCase()
        const comparison = leftValue.localeCompare(rightValue)
        return direction === 'asc' ? comparison : -comparison
      })
      const page = query?.page ?? 0
      const size = query?.size ?? 10

      return { items: sortedRows.slice(page * size, (page + 1) * size), total: historyRows.length }
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
  })

  it('paginates visible simulations', async () => {
    mockedGetRealSimulationHistory.mockResolvedValueOnce({
      items: paginatedHistoryRows(),
      total: 11,
    })
    renderPage()

    expect(await screen.findByRole('button', { name: 'Página actual, 1' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(screen.getByRole('button', { name: 'Página actual, 2' })).toBeInTheDocument()
  })

  it('returns to a valid page when deleting the only item on the last page', async () => {
    let items = paginatedHistoryRows()
    mockedGetRealSimulationHistory.mockImplementation(async (query) => {
      const sortField = query?.sortBy ?? 'createdAt'
      const direction = query?.direction ?? 'desc'
      const sortedItems = [...items].sort((left, right) => {
        const leftFieldValue = sortField === 'location' ? left.locationLabel : left[sortField]
        const rightFieldValue = sortField === 'location' ? right.locationLabel : right[sortField]
        const comparison = String(leftFieldValue ?? '').localeCompare(String(rightFieldValue ?? ''))
        return direction === 'asc' ? comparison : -comparison
      })
      const page = query?.page ?? 0
      const size = query?.size ?? 10
      return { items: sortedItems.slice(page * size, (page + 1) * size), total: items.length }
    })
    mockedDeleteSimulationById.mockImplementation(async (simulationId) => {
      items = items.filter((item) => item.id !== simulationId)
    })
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Siguiente' }))
    expect((await screen.findAllByText('Alpha')).length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByLabelText('Acciones de simulación solar')[0])
    fireEvent.click(screen.getAllByLabelText('Eliminar simulación solar')[0])
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    await waitFor(() => {
      expect(mockedGetRealSimulationHistory).toHaveBeenLastCalledWith(expect.objectContaining({ page: 0 }))
      expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    })
    expect((await screen.findAllByText('Zulu')).length).toBeGreaterThan(0)
  })
})
