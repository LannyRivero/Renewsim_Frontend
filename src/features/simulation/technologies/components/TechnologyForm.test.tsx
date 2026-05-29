import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TechnologyForm } from './TechnologyForm'

describe('TechnologyForm', () => {
  it('renders fields and submit action', () => {
    const onSubmit = vi.fn()
    const onDraftFieldChange = vi.fn()

    render(
      <TechnologyForm
        draft={{
          name: '',
          energyType: 'SOLAR',
          installedPower: 1,
          capacityFactor: 18,
          efficiency: 50,
          co2Reduction: 0,
          installationCost: 1000,
          maintenanceCost: 0,
          environmentalImpact: 50,
        }}
        formError={null}
        isSubmitting={false}
        isEditing={false}
        onSubmit={onSubmit}
        onCancelEdit={vi.fn()}
        onDraftFieldChange={onDraftFieldChange}
      />,
    )

    expect(screen.getByPlaceholderText('e.g. Premium Solar Panel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Technology' })).toBeInTheDocument()
  })

  it('calls change handler and submit', () => {
    const onSubmit = vi.fn((event: { preventDefault: VoidFunction }) => event.preventDefault())
    const onDraftFieldChange = vi.fn()

    render(
      <TechnologyForm
        draft={{
          name: '',
          energyType: 'SOLAR',
          installedPower: 1,
          capacityFactor: 18,
          efficiency: 50,
          co2Reduction: 0,
          installationCost: 1000,
          maintenanceCost: 0,
          environmentalImpact: 50,
        }}
        formError={null}
        isSubmitting={false}
        isEditing={false}
        onSubmit={onSubmit}
        onCancelEdit={vi.fn()}
        onDraftFieldChange={onDraftFieldChange}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText('e.g. Premium Solar Panel'), { target: { value: 'Wind X' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Technology' }))

    expect(onDraftFieldChange).toHaveBeenCalledWith('name', 'Wind X')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('renders error as alert for accessibility', () => {
    render(
      <TechnologyForm
        draft={{
          name: '',
          energyType: 'SOLAR',
          installedPower: 1,
          capacityFactor: 18,
          efficiency: 50,
          co2Reduction: 0,
          installationCost: 1000,
          maintenanceCost: 0,
          environmentalImpact: 50,
        }}
        formError="Technology name must be at least 2 characters"
        isSubmitting={false}
        isEditing={false}
        onSubmit={vi.fn()}
        onCancelEdit={vi.fn()}
        onDraftFieldChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Technology name must be at least 2 characters')
  })
})
