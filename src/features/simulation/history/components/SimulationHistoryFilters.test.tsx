import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { getSavedLocationSuggestions } from '../../services/simulationService'
import { SimulationHistoryFilters } from './SimulationHistoryFilters'

vi.mock('../../services/simulationService', () => ({
  getSavedLocationSuggestions: vi.fn(),
}))

const mockedGetSavedLocationSuggestions = vi.mocked(getSavedLocationSuggestions)

describe('SimulationHistoryFilters', () => {
  it('suggests locations from the current user simulation history', async () => {
    mockedGetSavedLocationSuggestions.mockResolvedValueOnce(['Canarias, ES', 'Sevilla, ES'])

    const onLocationChange = vi.fn()
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={queryClient}>
        <SimulationHistoryFilters
          search=""
          draftLocation="Can"
          isFilterPanelOpen
          onSearchChange={vi.fn()}
          onLocationChange={onLocationChange}
          onTogglePanel={vi.fn()}
          onApplyFilters={vi.fn()}
          onResetFilters={vi.fn()}
        />
      </QueryClientProvider>,
    )

    await screen.findByRole('option', { name: 'Canarias, ES' })
    expect(screen.queryAllByRole('option')).toHaveLength(2)
    expect(mockedGetSavedLocationSuggestions).toHaveBeenCalledWith('Can')

    fireEvent.click(screen.getByRole('button', { name: 'Canarias, ES' }))
    await waitFor(() => expect(onLocationChange).toHaveBeenCalledWith('Canarias, ES'))
  })
})
