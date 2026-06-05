import { SimulationSelect, SimulationTextInput } from '@/shared/components'

interface SimulationInputFieldsProps {
  energyType: 'solar' | 'wind' | 'hydro'
  projectSize: number
  budget: number
  energyConsumption: number
  onEnergyTypeChange: (value: 'solar' | 'wind' | 'hydro') => void
  onProjectSizeChange: (value: number) => void
  onBudgetChange: (value: number) => void
  onEnergyConsumptionChange: (value: number) => void
}

export function SimulationInputFields({
  energyType,
  projectSize,
  budget,
  energyConsumption,
  onEnergyTypeChange,
  onProjectSizeChange,
  onBudgetChange,
  onEnergyConsumptionChange,
}: SimulationInputFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="energy-type" className="mb-1 block text-sm font-medium">
          Tipo de Energía
        </label>
        <SimulationSelect
          id="energy-type"
          className="h-12"
          value={energyType}
          onChange={(event) => onEnergyTypeChange(event.target.value as 'solar' | 'wind' | 'hydro')}
        >
          <option value="solar">Solar</option>
          <option value="wind">Eólica</option>
          <option value="hydro">Hidroeléctrica</option>
        </SimulationSelect>
      </div>

      <div>
        <label htmlFor="project-size" className="mb-1 block text-sm font-medium">
          Tamaño del proyecto (kW/MW)
        </label>
        <SimulationTextInput
          id="project-size"
          type="number"
          min={1}
          value={projectSize}
          onChange={(event) => onProjectSizeChange(Number(event.target.value))}
          placeholder="Ejemplo: 500 kW"
          className="h-12"
        />
      </div>

      <div>
        <label htmlFor="budget" className="mb-1 block text-sm font-medium">
          Presupuesto (EUR)
        </label>
        <SimulationTextInput
          id="budget"
          type="number"
          min={1}
          value={budget}
          onChange={(event) => onBudgetChange(Number(event.target.value))}
          placeholder="Ejemplo: 1000000"
          className="h-12"
        />
      </div>

      <div>
        <label htmlFor="energy-consumption" className="mb-1 block text-sm font-medium">
          Consumo energético anual (kWh)
        </label>
        <SimulationTextInput
          id="energy-consumption"
          type="number"
          min={1}
          value={energyConsumption}
          onChange={(event) => onEnergyConsumptionChange(Number(event.target.value))}
          placeholder="Ejemplo: 1000"
          className="h-12"
        />
      </div>
    </>
  )
}
