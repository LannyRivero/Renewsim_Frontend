import { SimulationSelect, SimulationTextInput } from '@/shared/components'

interface SimulationInputFieldsProps {
  energyType: 'solar' | 'wind' | 'hydro'
  projectSize: number
  budget: number
  onEnergyTypeChange: (value: 'solar' | 'wind' | 'hydro') => void
  onProjectSizeChange: (value: number) => void
  onBudgetChange: (value: number) => void
}

export function SimulationInputFields({
  energyType,
  projectSize,
  budget,
  onEnergyTypeChange,
  onProjectSizeChange,
  onBudgetChange,
}: SimulationInputFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="energy-type" className="mb-1 block text-sm font-medium">
          Energy type
        </label>
        <SimulationSelect
          id="energy-type"
          className="h-12"
          value={energyType}
          onChange={(event) => onEnergyTypeChange(event.target.value as 'solar' | 'wind' | 'hydro')}
        >
          <option value="solar">Solar</option>
          <option value="wind">Wind</option>
          <option value="hydro">Hydroelectric</option>
        </SimulationSelect>
      </div>

      <div>
        <label htmlFor="project-size" className="mb-1 block text-sm font-medium">
          Project size (kW/MW)
        </label>
        <SimulationTextInput
          id="project-size"
          type="number"
          min={1}
          value={projectSize}
          onChange={(event) => onProjectSizeChange(Number(event.target.value))}
          placeholder="Example: 500 kW"
          className="h-12"
        />
      </div>

      <div>
        <label htmlFor="budget" className="mb-1 block text-sm font-medium">
          Budget (EUR)
        </label>
        <SimulationTextInput
          id="budget"
          type="number"
          min={1}
          value={budget}
          onChange={(event) => onBudgetChange(Number(event.target.value))}
          placeholder="Example: 1000000"
          className="h-12"
        />
      </div>
    </>
  )
}
