import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TechnologiesTable } from './TechnologiesTable'

describe('TechnologiesTable', () => {
  it('renders rows and triggers delete callback', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    const onSortChange = vi.fn()

    render(
        <TechnologiesTable
          technologies={[
          {
            id: 't1',
            name: 'Solar One',
            energyType: 'SOLAR',
            installedPower: 100,
            capacityFactor: 18,
            efficiency: 0.91,
            co2Reduction: 120,
            installationCost: 1000,
            maintenanceCost: 10,
            environmentalImpact: 20,
          },
          ]}
          page={0}
          size={20}
          totalElements={1}
          totalPages={1}
          editingTechnologyId={null}
          deletingTechnologyId={null}
          sortBy="name"
          sortDirection="asc"
          isUpdating={false}
          onEdit={onEdit}
          onDelete={onDelete}
          onSortChange={onSortChange}
          onPrevPage={vi.fn()}
          onNextPage={vi.fn()}
        />,
    )

    expect(screen.getByText('Solar One')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onDelete).toHaveBeenCalledWith('t1', 'Solar One')

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))
    expect(onEdit).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Nombre/i }))
    expect(onSortChange).toHaveBeenCalledWith('name')

    fireEvent.click(screen.getByRole('button', { name: /Eficiencia/i }))
    expect(onSortChange).toHaveBeenCalledWith('efficiency')
  })
})
