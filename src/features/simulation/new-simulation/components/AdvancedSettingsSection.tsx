import type { UseFormReturn } from 'react-hook-form'
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
import type { SimulationCreateFormInput, SimulationCreateFormValues } from '../../schemas/simulationSchema'

interface AdvancedSettingsSectionProps {
  form: UseFormReturn<SimulationCreateFormInput, undefined, SimulationCreateFormValues>
  isAdvancedOpen: boolean
  onToggle: () => void
}

export function AdvancedSettingsSection({ form, isAdvancedOpen, onToggle }: AdvancedSettingsSectionProps) {
  return (
    <SimulationAdvancedSettingsPanel isOpen={isAdvancedOpen} onToggle={onToggle}>
      <SimulationTechnicalSettingsFields
        performanceRatioField={
          <FormField label="Factor de rendimiento" htmlFor="performanceRatio">
            <SimulationTextInput id="performanceRatio" type="number" min={0} max={1} step="0.01" placeholder="0.81" {...form.register('system.performanceRatio')} />
          </FormField>
        }
        degradationField={
          <FormField label="Degradación anual (%)" htmlFor="degradationRateAnnualPct">
            <SimulationTextInput id="degradationRateAnnualPct" type="number" min={0} max={5} step="0.1" placeholder="0.5" {...form.register('system.degradationRateAnnualPct')} />
          </FormField>
        }
        availabilityField={
          <FormField label="Disponibilidad (%)" htmlFor="availabilityPct">
            <SimulationTextInput id="availabilityPct" type="number" min={0} max={100} step="0.1" placeholder="99" {...form.register('system.availabilityPct')} />
          </FormField>
        }
      />

      <SimulationLossesFields
        renderField={(field, label) => (
          <FormField key={field} label={label} htmlFor={`loss-${field}`}>
            <SimulationTextInput id={`loss-${field}`} type="number" min={0} step="0.1" placeholder="0" {...form.register(`system.lossesPct.${field}` as const)} />
          </FormField>
        )}
      />

      <SimulationMonthlyConsumptionFields
        renderField={(month, index) => (
          <FormField key={month} label={month} htmlFor={`monthly-${index}`}>
            <SimulationTextInput id={`monthly-${index}`} type="number" min={0} placeholder="0" {...form.register(`demand.monthlyConsumptionKwh.${index}` as const)} />
          </FormField>
        )}
      />

      <SimulationAdvancedEconomicsFields
        currencyField={
          <FormField label="Moneda" htmlFor="currency">
            <SimulationReadonlyFormInput id="currency" value="EUR" />
            <input type="hidden" {...form.register('economics.currency')} />
          </FormField>
        }
        opexField={
          <FormField label="OPEX anual" htmlFor="opexAnnual">
            <SimulationTextInput id="opexAnnual" type="number" min={0} placeholder="7200" {...form.register('economics.opexAnnual')} />
          </FormField>
        }
        exportPriceField={
          <FormField label="Precio de exportación" htmlFor="exportPricePerKwh">
            <SimulationTextInput id="exportPricePerKwh" type="number" min={0} step="0.01" placeholder="0.07" {...form.register('economics.exportPricePerKwh')} />
          </FormField>
        }
        discountRateField={
          <FormField label="Tasa de descuento (%)" htmlFor="discountRatePct">
            <SimulationTextInput id="discountRatePct" type="number" min={0} step="0.1" placeholder="8" {...form.register('economics.discountRatePct')} />
          </FormField>
        }
        projectLifetimeField={
          <FormField label="Vida útil (años)" htmlFor="projectLifetimeYears">
            <SimulationTextInput id="projectLifetimeYears" type="number" min={5} placeholder="20" {...form.register('economics.projectLifetimeYears')} />
          </FormField>
        }
      />
    </SimulationAdvancedSettingsPanel>
  )
}
