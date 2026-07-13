import type { UseFormReturn } from 'react-hook-form'
import { FormField, SimulationReadonlyFormInput, SimulationTextInput } from '@/shared/components'
import { SIMULATION_FORM_LABELS, SIMULATION_FORM_PLACEHOLDERS } from '@/shared/components/simulation/form-copy'
import type { SimulationCreateFormInput, SimulationCreateFormValues } from '../../schemas/simulationSchema'

interface BasicFormFieldsProps {
  form: UseFormReturn<SimulationCreateFormInput, undefined, SimulationCreateFormValues>
}

export function BasicFormFields({ form }: BasicFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label={SIMULATION_FORM_LABELS.projectName} htmlFor="name">
        <SimulationTextInput id="name" type="text" placeholder={SIMULATION_FORM_PLACEHOLDERS.projectName} {...form.register('name')} />
      </FormField>

      <FormField label={SIMULATION_FORM_LABELS.technology} htmlFor="energyType">
        <SimulationReadonlyFormInput id="energyType" value="Solar" />
        <input type="hidden" {...form.register('technology')} />
      </FormField>

      <FormField label={SIMULATION_FORM_LABELS.installedCapacityKw} htmlFor="installedCapacityKw">
        <SimulationTextInput id="installedCapacityKw" type="number" min={0} placeholder={SIMULATION_FORM_PLACEHOLDERS.installedCapacityKw} {...form.register('system.installedCapacityKw')} />
      </FormField>

      <FormField label={SIMULATION_FORM_LABELS.annualConsumptionKwh} htmlFor="annualConsumptionKwh">
        <SimulationTextInput id="annualConsumptionKwh" type="number" min={0} placeholder={SIMULATION_FORM_PLACEHOLDERS.annualConsumptionKwh} {...form.register('demand.annualConsumptionKwh')} />
      </FormField>

      <FormField label={SIMULATION_FORM_LABELS.electricityPurchasePricePerKwh} htmlFor="electricityPurchasePricePerKwh">
        <SimulationTextInput
          id="electricityPurchasePricePerKwh"
          type="number"
          min={0}
          step="0.01"
          placeholder={SIMULATION_FORM_PLACEHOLDERS.electricityPurchasePricePerKwh}
          {...form.register('economics.electricityPurchasePricePerKwh')}
        />
      </FormField>

      <FormField label={SIMULATION_FORM_LABELS.capexTotal} htmlFor="capexTotal">
        <SimulationTextInput id="capexTotal" type="number" min={0} placeholder={SIMULATION_FORM_PLACEHOLDERS.capexTotal} {...form.register('economics.capexTotal')} />
      </FormField>
    </div>
  )
}
