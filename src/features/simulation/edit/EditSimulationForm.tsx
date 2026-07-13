import { useState } from 'react'
import {
  FormField,
  SimulationCard,
  SimulationReadonlyFormInput,
  SimulationTextInput,
} from '@/shared/components'
import { useBrowserLocationResolution } from '../hooks/useBrowserLocationResolution'
import { EditSimulationAdvancedSettingsSection } from './EditSimulationAdvancedSettingsSection'
import { EditSimulationLocationField } from './EditSimulationLocationField'
import type { EditSimulationFormDefaults } from './editSimulationViewModel'

export function EditSimulationForm({
  defaults,
  onSubmit,
}: {
  defaults: EditSimulationFormDefaults
  isSubmitting: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  const [, setLocationVersion] = useState(0)

  function updateLocationField(nextValue: string) {
    const input = document.getElementById('location') as HTMLInputElement | null
    if (input) {
      input.value = nextValue
      setLocationVersion((current) => current + 1)
    }
  }

  const {
    isResolvingBrowserLocation,
    locationAssistMessage,
    startBrowserLocationResolution,
  } = useBrowserLocationResolution({
    onResolved: (resolvedLocation) => {
      updateLocationField(resolvedLocation.label)
    },
  })

  return (
    <form id="edit-simulation-form" className="space-y-4" onSubmit={onSubmit}>
      <SimulationCard className="space-y-5 rounded-sm border-[#d7dde6] bg-white/85 backdrop-blur-sm dark:border-white/10 dark:bg-[#121417]/85" density="comfortable">
        <EditSimulationLocationField
          defaultValue={defaults.location}
          isResolvingBrowserLocation={isResolvingBrowserLocation}
          locationAssistMessage={locationAssistMessage}
          onUseBrowserLocation={startBrowserLocationResolution}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Nombre del proyecto" htmlFor="name">
            <SimulationTextInput id="name" name="name" type="text" defaultValue={defaults.name} />
          </FormField>

          <FormField label="Tecnología" htmlFor="technologyLabel">
            <SimulationReadonlyFormInput id="technologyLabel" value={defaults.technologyLabel} />
            <input type="hidden" name="technology" value={defaults.technology} />
          </FormField>

          <FormField label="Potencia instalada (kW)" htmlFor="installedCapacityKw">
            <SimulationTextInput id="installedCapacityKw" name="installedCapacityKw" type="number" min={0} step="0.1" defaultValue={defaults.installedCapacityKw} />
          </FormField>

          <FormField label="Consumo anual (kWh)" htmlFor="annualConsumptionKwh">
            <SimulationTextInput id="annualConsumptionKwh" name="annualConsumptionKwh" type="number" min={0} defaultValue={defaults.annualConsumptionKwh} />
          </FormField>

          <FormField label="Precio de electricidad" htmlFor="electricityPurchasePricePerKwh">
            <SimulationTextInput
              id="electricityPurchasePricePerKwh"
              name="electricityPurchasePricePerKwh"
              type="number"
              min={0}
              step="0.01"
              defaultValue={defaults.electricityPurchasePricePerKwh}
            />
          </FormField>

          <FormField label="Inversión estimada" htmlFor="capexTotal">
            <SimulationTextInput id="capexTotal" name="capexTotal" type="number" min={0} defaultValue={defaults.capexTotal} />
          </FormField>

          <div className="md:col-span-2">
            <EditSimulationAdvancedSettingsSection defaults={defaults} />
          </div>
        </div>
      </SimulationCard>
    </form>
  )
}
