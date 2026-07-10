import type { UseFormReturn } from 'react-hook-form'
import { FormField, SimulationReadonlyFormInput, SimulationTextInput } from '@/shared/components'
import type { SimulationCreateFormInput, SimulationCreateFormValues } from '../../schemas/simulationSchema'

interface BasicFormFieldsProps {
  form: UseFormReturn<SimulationCreateFormInput, undefined, SimulationCreateFormValues>
}

export function BasicFormFields({ form }: BasicFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label="Nombre del proyecto" htmlFor="name">
        <SimulationTextInput id="name" type="text" placeholder="Ej: Planta solar nave Sevilla" {...form.register('name')} />
      </FormField>

      <FormField label="Tecnología" htmlFor="energyType">
        <SimulationReadonlyFormInput id="energyType" value="Solar" />
        <input type="hidden" {...form.register('technology')} />
      </FormField>

      <FormField label="Potencia instalada (kW)" htmlFor="installedCapacityKw">
        <SimulationTextInput id="installedCapacityKw" type="number" min={0} placeholder="300" {...form.register('system.installedCapacityKw')} />
      </FormField>

      <FormField label="Consumo anual (kWh)" htmlFor="annualConsumptionKwh">
        <SimulationTextInput id="annualConsumptionKwh" type="number" min={0} placeholder="120000" {...form.register('demand.annualConsumptionKwh')} />
      </FormField>

      <FormField label="Precio de electricidad" htmlFor="electricityPurchasePricePerKwh">
        <SimulationTextInput
          id="electricityPurchasePricePerKwh"
          type="number"
          min={0}
          step="0.01"
          placeholder="0.18"
          {...form.register('economics.electricityPurchasePricePerKwh')}
        />
      </FormField>

      <FormField label="Inversión estimada" htmlFor="capexTotal">
        <SimulationTextInput id="capexTotal" type="number" min={0} placeholder="315000" {...form.register('economics.capexTotal')} />
      </FormField>
    </div>
  )
}
