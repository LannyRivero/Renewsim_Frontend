import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { SimulationHistoryPage } from './SimulationHistoryPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <SimulationHistoryPage />
    </MemoryRouter>,
  )
}

describe('SimulationHistoryPage', () => {
  it('renders heading and new simulation action', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Historial de Simulaciones' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nueva Simulacion' })).toBeInTheDocument()
  })

  it('renders history table columns', () => {
    renderPage()

    expect(screen.getByRole('columnheader', { name: 'Fecha' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Tipo de Energia' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Eficiencia' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ROI' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument()
  })

  it('renders simulation rows and action buttons', () => {
    renderPage()

    expect(screen.getByText('15 de mayo de 2024')).toBeInTheDocument()
    expect(screen.getByText('Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Ver simulacion Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Editar simulacion Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Eliminar simulacion Solar')).toBeInTheDocument()
  })
})
