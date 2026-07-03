import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NewSimulationPage } from './NewSimulationPage'
import { resolveLocation, searchLocations } from '../services/simulationService'

vi.mock('../services/simulationService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/simulationService')>()
  return {
    ...actual,
    resolveLocation: vi.fn(),
    searchLocations: vi.fn(),
  }
})

const mockedResolveLocation = vi.mocked(resolveLocation)
const mockedSearchLocations = vi.mocked(searchLocations)

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <NewSimulationPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  mockedResolveLocation.mockReset()
  mockedSearchLocations.mockReset()
})

describe('NewSimulationPage', () => {


  it('renders simulation setup section header', () => {
    renderPage()

    expect(screen.getByText('Configuración de simulación')).toBeInTheDocument()
  })

  it('renders editable form fields', () => {
    renderPage()

    expect(screen.getByLabelText('Ubicación')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre del proyecto')).toBeInTheDocument()
    expect(screen.getByLabelText('Tecnología')).toBeInTheDocument()
    expect(screen.getByLabelText('Potencia instalada (kW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Inversión estimada')).toBeInTheDocument()
    expect(screen.getByLabelText('Tecnología')).toHaveValue('Solar')
  })

  it('renders merged location section', () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Usar mi ubicación' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingresá ciudad o región')).toBeInTheDocument()
  })

  it('does not render climate preview on this page', () => {
    renderPage()

    expect(screen.queryByText('Datos climáticos (solo lectura)')).not.toBeInTheDocument()
  })

  it('renders submit action', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Ejecutar simulación' })).toBeInTheDocument()
  })

  it('keeps advanced settings collapsed by default', () => {
    renderPage()

    expect(screen.getByRole('button', { name: /Mostrar ajustes/ })).toBeInTheDocument()
    expect(screen.queryByLabelText('Performance ratio')).not.toBeInTheDocument()
  })

  it('fills location and coordinates when browser geolocation succeeds', async () => {
    mockedResolveLocation.mockResolvedValueOnce({
      label: 'Mendoza, AR',
      name: 'Mendoza',
      country: 'AR',
      countryCode: 'AR',
      lat: -32.8895,
      lon: -68.8458,
    })

    vi.stubGlobal('navigator', {
      ...navigator,
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: {
              latitude: -32.8895,
              longitude: -68.8458,
              accuracy: 1,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              toJSON: () => ({}),
            },
            timestamp: Date.now(),
            toJSON: () => ({}),
          } as GeolocationPosition)
        },
      },
    })

    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Usar mi ubicación' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Ubicación')).toHaveValue('Mendoza, AR')
    })

    expect(mockedResolveLocation).toHaveBeenCalledWith(-32.8895, -68.8458)
  })

  it('shows backend suggestions while typing and applies the selected location', async () => {
    mockedSearchLocations.mockResolvedValueOnce([
      {
        label: 'Mendoza, AR',
        name: 'Mendoza',
        country: 'AR',
        countryCode: 'AR',
        lat: -32.8895,
        lon: -68.8458,
      },
    ])

    renderPage()

    fireEvent.change(screen.getByLabelText('Ubicación'), { target: { value: 'Mend' } })

    await waitFor(() => {
      expect(mockedSearchLocations).toHaveBeenCalledWith('Mend')
      expect(screen.getByRole('button', { name: 'Mendoza, AR' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Mendoza, AR' }))

    expect(screen.getByLabelText('Ubicación')).toHaveValue('Mendoza, AR')
  })
})
