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
import { SIMULATION_FORM_DESCRIPTIONS, SIMULATION_FORM_LABELS, SIMULATION_FORM_PLACEHOLDERS } from '@/shared/components/simulation/form-copy'
import type { SimulationCreateFormInput, SimulationCreateFormValues } from '../../schemas/simulationSchema'

interface AdvancedSettingsSectionProps {
  form: UseFormReturn<SimulationCreateFormInput, undefined, SimulationCreateFormValues>
  isAdvancedOpen: boolean
  onToggle: () => void
}

export function AdvancedSettingsSection({ form, isAdvancedOpen, onToggle }: AdvancedSettingsSectionProps) {
  return (
    <SimulationAdvancedSettingsPanel description={SIMULATION_FORM_DESCRIPTIONS.advancedSettings} title={SIMULATION_FORM_LABELS.advancedSettings} isOpen={isAdvancedOpen} onToggle={onToggle}>
      <SimulationTechnicalSettingsFields
        performanceRatioField={
          <FormField label={SIMULATION_FORM_LABELS.performanceRatio} htmlFor="performanceRatio">
            <SimulationTextInput id="performanceRatio" type="number" min={0} max={1} step="0.01" placeholder={SIMULATION_FORM_PLACEHOLDERS.performanceRatio} {...form.register('system.performanceRatio')} />
          </FormField>
        }
        degradationField={
          <FormField label={SIMULATION_FORM_LABELS.degradationRateAnnualPct} htmlFor="degradationRateAnnualPct">
            <SimulationTextInput id="degradationRateAnnualPct" type="number" min={0} max={5} step="0.1" placeholder={SIMULATION_FORM_PLACEHOLDERS.degradationRateAnnualPct} {...form.register('system.degradationRateAnnualPct')} />
          </FormField>
        }
        availabilityField={
          <FormField label={SIMULATION_FORM_LABELS.availabilityPct} htmlFor="availabilityPct">
            <SimulationTextInput id="availabilityPct" type="number" min={0} max={100} step="0.1" placeholder={SIMULATION_FORM_PLACEHOLDERS.availabilityPct} {...form.register('system.availabilityPct')} />
          </FormField>
        }
      />

      <SimulationLossesFields
        renderField={(field, label) => (
          <FormField key={field} label={label} htmlFor={`loss-${field}`}>
            <SimulationTextInput id={`loss-${field}`} type="number" min={0} step="0.1" placeholder={SIMULATION_FORM_PLACEHOLDERS.lossesPct} {...form.register(`system.lossesPct.${field}` as const)} />
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
          <FormField label={SIMULATION_FORM_LABELS.currency} htmlFor="currency">
            <SimulationReadonlyFormInput id="currency" value="EUR" />
            <input type="hidden" {...form.register('economics.currency')} />
          </FormField>
        }
        opexField={
          <FormField label={SIMULATION_FORM_LABELS.opexAnnual} htmlFor="opexAnnual">
            <SimulationTextInput id="opexAnnual" type="number" min={0} placeholder={SIMULATION_FORM_PLACEHOLDERS.opexAnnual} {...form.register('economics.opexAnnual')} />
          </FormField>
        }
        exportPriceField={
          <FormField label={SIMULATION_FORM_LABELS.exportPricePerKwh} htmlFor="exportPricePerKwh">
            <SimulationTextInput id="exportPricePerKwh" type="number" min={0} step="0.01" placeholder={SIMULATION_FORM_PLACEHOLDERS.exportPricePerKwh} {...form.register('economics.exportPricePerKwh')} />
          </FormField>
        }
        discountRateField={
          <FormField label={SIMULATION_FORM_LABELS.discountRatePct} htmlFor="discountRatePct">
            <SimulationTextInput id="discountRatePct" type="number" min={0} step="0.1" placeholder={SIMULATION_FORM_PLACEHOLDERS.discountRatePct} {...form.register('economics.discountRatePct')} />
          </FormField>
        }
        projectLifetimeField={
          <FormField label={SIMULATION_FORM_LABELS.projectLifetimeYears} htmlFor="projectLifetimeYears">
            <SimulationTextInput id="projectLifetimeYears" type="number" min={5} placeholder={SIMULATION_FORM_PLACEHOLDERS.projectLifetimeYears} {...form.register('economics.projectLifetimeYears')} />
          </FormField>
        }
      />
    </SimulationAdvancedSettingsPanel>
  )
}
