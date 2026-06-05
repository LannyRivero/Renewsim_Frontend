import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NewSimulationPage } from './NewSimulationPage'

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

describe('NewSimulationPage', () => {
  it('renders description', () => {
    renderPage()

    expect(
      screen.getByText('Configura tu simulación con parámetros específicos del proyecto.'),
    ).toBeInTheDocument()
  })

  it('renders simulation setup section header', () => {
    renderPage()

    expect(screen.getByText('Simulación Setup')).toBeInTheDocument()
  })

  it('renders editable form fields', () => {
    renderPage()

    expect(screen.getByLabelText('Ubicación')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo de Energía')).toBeInTheDocument()
    expect(screen.getByLabelText('Tamaño del proyecto (kW/MW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Presupuesto (EUR)')).toBeInTheDocument()
  })

  it('renders read-only climate data fields', () => {
    renderPage()

    expect(screen.getByLabelText('Irradiancia (kWh/m2/día)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Velocidad del viento (m/s)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Hidrología (m3/s)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Irradiancia (kWh/m2/día)')).toHaveValue('-')
    expect(screen.getByLabelText('Velocidad del viento (m/s)')).toHaveValue('-')
    expect(screen.getByLabelText('Hidrología (m3/s)')).toHaveValue('3.0')
  })

  it('renders submit action', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Run simulation' })).toBeInTheDocument()
  })
})
