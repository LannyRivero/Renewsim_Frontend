import { useState } from 'react'
import {
  FormField,
  SimulationAdvancedEconomicsFields,
  SimulationAdvancedSettingsPanel,
  SimulationLossesFields,
  SimulationMonthlyConsumptionFields,
  SimulationReadonlyFormInput,
  SimulationTechnicalSettingsFields,
  SimulationTextInput,
} from '@/shared/components'
import type { EditSimulationFormDefaults } from './editSimulationViewModel'

export function EditSimulationAdvancedSettingsSection({ defaults }: { defaults: EditSimulationFormDefaults }) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  return (
    <SimulationAdvancedSettingsPanel isOpen={isAdvancedOpen} onToggle={() => setIsAdvancedOpen((current) => !current)}>
      <SimulationTechnicalSettingsFields
        performanceRatioField={
          <FormField label="Factor de rendimiento" htmlFor="performanceRatio">
            <SimulationTextInput id="performanceRatio" name="performanceRatio" type="number" min={0} max={1} step="0.01" defaultValue={defaults.performanceRatio} />
          </FormField>
        }
        degradationField={
          <FormField label="Degradación anual (%)" htmlFor="degradationRateAnnualPct">
            <SimulationTextInput id="degradationRateAnnualPct" name="degradationRateAnnualPct" type="number" min={0} max={5} step="0.1" defaultValue={defaults.degradationRateAnnualPct} />
          </FormField>
        }
        availabilityField={
          <FormField label="Disponibilidad (%)" htmlFor="availabilityPct">
            <SimulationTextInput id="availabilityPct" name="availabilityPct" type="number" min={0} max={100} step="0.1" defaultValue={defaults.availabilityPct} />
          </FormField>
        }
      />

      <SimulationLossesFields
        renderField={(field, label) => (
          <FormField key={field} label={label} htmlFor={`loss-${field}`}>
            <SimulationTextInput id={`loss-${field}`} name={`lossesPct.${field}`} type="number" min={0} step="0.1" defaultValue={defaults.lossesPct[field]} />
          </FormField>
        )}
      />

      <SimulationMonthlyConsumptionFields
        renderField={(month, index) => (
          <FormField key={month} label={month} htmlFor={`monthly-${index}`}>
            <SimulationTextInput id={`monthly-${index}`} name={`monthlyConsumptionKwh.${index}`} type="number" min={0} defaultValue={defaults.monthlyConsumptionKwh[index]} />
          </FormField>
        )}
      />

      <SimulationAdvancedEconomicsFields
        currencyField={
          <FormField label="Moneda" htmlFor="currencyLabel">
            <SimulationReadonlyFormInput id="currencyLabel" value={defaults.currency} />
            <input type="hidden" name="currency" value={defaults.currency} />
          </FormField>
        }
        opexField={
          <FormField label="OPEX anual" htmlFor="opexAnnual">
            <SimulationTextInput id="opexAnnual" name="opexAnnual" type="number" min={0} defaultValue={defaults.opexAnnual} />
          </FormField>
        }
        exportPriceField={
          <FormField label="Precio de exportación" htmlFor="exportPricePerKwh">
            <SimulationTextInput id="exportPricePerKwh" name="exportPricePerKwh" type="number" min={0} step="0.01" defaultValue={defaults.exportPricePerKwh} />
          </FormField>
        }
        discountRateField={
          <FormField label="Tasa de descuento (%)" htmlFor="discountRatePct">
            <SimulationTextInput id="discountRatePct" name="discountRatePct" type="number" min={0} step="0.1" defaultValue={defaults.discountRatePct} />
          </FormField>
        }
        projectLifetimeField={
          <FormField label="Vida útil (años)" htmlFor="projectLifetimeYears">
            <SimulationTextInput id="projectLifetimeYears" name="projectLifetimeYears" type="number" min={5} defaultValue={defaults.projectLifetimeYears} />
          </FormField>
        }
      />
    </SimulationAdvancedSettingsPanel>
  )
}
