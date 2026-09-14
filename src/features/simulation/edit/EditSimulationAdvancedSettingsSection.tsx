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
import { SIMULATION_FORM_DESCRIPTIONS, SIMULATION_FORM_LABELS } from '@/shared/components/simulation/form-copy'
import type { EditSimulationFormDefaults } from './editSimulationViewModel'

export function EditSimulationAdvancedSettingsSection({ defaults }: { defaults: EditSimulationFormDefaults }) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  return (
    <SimulationAdvancedSettingsPanel description={SIMULATION_FORM_DESCRIPTIONS.advancedSettings} title={SIMULATION_FORM_LABELS.advancedSettings} isOpen={isAdvancedOpen} onToggle={() => setIsAdvancedOpen((current) => !current)}>
      <SimulationTechnicalSettingsFields
        performanceRatioField={
          <FormField label={SIMULATION_FORM_LABELS.performanceRatio} htmlFor="performanceRatio">
            <SimulationTextInput id="performanceRatio" name="performanceRatio" type="number" min={0} max={1} step="0.01" defaultValue={defaults.performanceRatio} />
          </FormField>
        }
        degradationField={
          <FormField label={SIMULATION_FORM_LABELS.degradationRateAnnualPct} htmlFor="degradationRateAnnualPct">
            <SimulationTextInput id="degradationRateAnnualPct" name="degradationRateAnnualPct" type="number" min={0} max={5} step="0.1" defaultValue={defaults.degradationRateAnnualPct} />
          </FormField>
        }
        availabilityField={
          <FormField label={SIMULATION_FORM_LABELS.availabilityPct} htmlFor="availabilityPct">
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
            <SimulationTextInput id={`monthly-${index}`} name={`monthlyConsumptionKwh.${index}`} type="number" min={0} step="0.01" defaultValue={defaults.monthlyConsumptionKwh[index]} />
          </FormField>
        )}
      />

      <SimulationAdvancedEconomicsFields
        currencyField={
          <FormField label={SIMULATION_FORM_LABELS.currency} htmlFor="currencyLabel">
            <SimulationReadonlyFormInput id="currencyLabel" value={defaults.currency} />
            <input type="hidden" name="currency" value={defaults.currency} />
          </FormField>
        }
        opexField={
          <FormField label={SIMULATION_FORM_LABELS.opexAnnual} htmlFor="opexAnnual">
            <SimulationTextInput id="opexAnnual" name="opexAnnual" type="number" min={0} defaultValue={defaults.opexAnnual} />
          </FormField>
        }
        exportPriceField={
          <FormField label={SIMULATION_FORM_LABELS.exportPricePerKwh} htmlFor="exportPricePerKwh">
            <SimulationTextInput id="exportPricePerKwh" name="exportPricePerKwh" type="number" min={0} step="0.01" defaultValue={defaults.exportPricePerKwh} />
          </FormField>
        }
        discountRateField={
          <FormField label={SIMULATION_FORM_LABELS.discountRatePct} htmlFor="discountRatePct">
            <SimulationTextInput id="discountRatePct" name="discountRatePct" type="number" min={0} step="0.1" defaultValue={defaults.discountRatePct} />
          </FormField>
        }
        projectLifetimeField={
          <FormField label={SIMULATION_FORM_LABELS.projectLifetimeYears} htmlFor="projectLifetimeYears">
            <SimulationTextInput id="projectLifetimeYears" name="projectLifetimeYears" type="number" min={5} defaultValue={defaults.projectLifetimeYears} />
          </FormField>
        }
      />
    </SimulationAdvancedSettingsPanel>
  )
}
