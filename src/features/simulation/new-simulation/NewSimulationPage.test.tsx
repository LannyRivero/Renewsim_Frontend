import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NewSimulationPage } from './NewSimulationPage'

describe('NewSimulationPage', () => {
  it('renders heading and description', () => {
    render(<NewSimulationPage />)

    expect(screen.getByRole('heading', { name: 'Nueva simulacion personalizada' })).toBeInTheDocument()
    expect(
      screen.getByText('Configura tu simulacion con parametros especificos de tu proyecto.'),
    ).toBeInTheDocument()
  })

  it('renders top header navigation from stitch design', () => {
    render(<NewSimulationPage />)

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Simulations' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resources' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Community' })).toBeInTheDocument()
    expect(screen.getByLabelText('Notificaciones')).toBeInTheDocument()
  })

  it('renders editable form fields', () => {
    render(<NewSimulationPage />)

    expect(screen.getByLabelText('Ubicacion')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo de energia')).toBeInTheDocument()
    expect(screen.getByLabelText('Tamano del proyecto (kW/MW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Presupuesto (EUR)')).toBeInTheDocument()
  })

  it('renders read-only climate data fields', () => {
    render(<NewSimulationPage />)

    expect(screen.getByLabelText('Irradiancia (kWh/m2/dia)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Velocidad del viento (m/s)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Hidrologia (m3/s)')).toHaveAttribute('readonly')
  })

  it('renders submit action', () => {
    render(<NewSimulationPage />)
    expect(screen.getByRole('button', { name: 'Ejecutar simulacion' })).toBeInTheDocument()
  })
})
