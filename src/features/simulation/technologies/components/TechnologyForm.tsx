import { useMemo } from 'react'
import {
  FormTooltip,
  SimulationActionButton,
  SimulationCard,
  SimulationSelect,
  SimulationStateMessage,
  SimulationTextInput,
} from '@/shared/components'
import { Tooltip } from '@base-ui/react/tooltip'
import { Zap } from 'lucide-react'
import { CAPACITY_FACTOR_DEFAULTS, computeAnnualEnergyProduction } from '../schemas/technologySchema'
import type { TechnologyFormValues } from '../schemas/technologySchema'

interface TechnologyFormProps {
  draft: TechnologyFormValues
  formError: string | null
  isSubmitting: boolean
  isEditing: boolean
  onSubmit: (event: React.FormEvent) => void
  onCancelEdit: () => void
  onDraftFieldChange: <K extends keyof TechnologyFormValues>(field: K, value: TechnologyFormValues[K]) => void
}

export function TechnologyForm({
  draft,
  formError,
  isSubmitting,
  isEditing,
  onSubmit,
  onCancelEdit,
  onDraftFieldChange,
}: TechnologyFormProps) {
  const toNumeric = (value: string) => Number(value)

  const estimatedAnnualEnergy = useMemo(
    () => computeAnnualEnergyProduction(draft.installedPower, draft.capacityFactor),
    [draft.installedPower, draft.capacityFactor],
  )

  function handleEnergyTypeChange(type: string) {
    onDraftFieldChange('energyType', type as 'SOLAR' | 'WIND' | 'HYDRO')
    const defaultCf = CAPACITY_FACTOR_DEFAULTS[type]
    if (defaultCf != null) {
      onDraftFieldChange('capacityFactor', defaultCf)
    }
  }

  const formattedEnergy = new Intl.NumberFormat('en-US').format(estimatedAnnualEnergy)

  return (
    <SimulationCard density="comfortable">
      <Tooltip.Provider>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div>
            <label htmlFor="technology-name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Nombre de la tecnología
              <FormTooltip content="Nombre único que se muestra en los resultados y comparaciones de la simulación." />
            </label>
            <SimulationTextInput id="technology-name" value={draft.name} onChange={(e) => onDraftFieldChange('name', e.target.value)} placeholder="e.g. Premium Solar Panel" />
          </div>

          <div>
            <label htmlFor="technology-energy-type" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Tipo de energía
              <FormTooltip content="Fuente de energía principal — determina las horas disponibles y los patrones estacionales." />
            </label>
            <SimulationSelect id="technology-energy-type" value={draft.energyType} onChange={(e) => handleEnergyTypeChange(e.target.value)}>
              <option value="SOLAR">Solar</option>
              <option value="WIND">Eólica</option>
              <option value="HYDRO">Hidro</option>
            </SimulationSelect>
          </div>

          <div>
            <label htmlFor="technology-installed-power" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">

              Potencia instalada (kW)
              <FormTooltip content="Capacidad nominal de la instalación. Por ejemplo, una turbina eólica de 2 MW = 2000 kW." />
            </label>
            <SimulationTextInput id="technology-installed-power" type="number" min={1} step="any" value={draft.installedPower} onChange={(e) => onDraftFieldChange('installedPower', toNumeric(e.target.value))} placeholder="e.g. 100" />
          </div>

          <div>
            <label htmlFor="technology-capacity-factor" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Factor de capacidad (%)
              <FormTooltip content="% del tiempo que la instalación produce a su capacidad nominal. Varía según la calidad del recurso — por ejemplo, solar en Buenos Aires ≈ 18%, eólica en la costa patagónica ≈ 40%." />
            </label>
            <SimulationTextInput id="technology-capacity-factor" type="number" min={0} max={100} step="any" value={draft.capacityFactor} onChange={(e) => onDraftFieldChange('capacityFactor', toNumeric(e.target.value))} placeholder="0 a 100" />
            <p className="mt-1 text-xs text-slate-500 dark:text-content-dark/65">Se ajusta automáticamente según el tipo de energía. Ajuste si tiene datos específicos del sitio.</p>
          </div>

          <div className="md:col-span-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <Zap className="h-4 w-4" />
              Energía anual estimada: {formattedEnergy} kWh/año
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-content-dark/65">
              Calculado como: {draft.installedPower} kW × {draft.capacityFactor}% × 8760 h
            </p>
          </div>

          <div>
            <label htmlFor="technology-efficiency" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Eficiencia (%)
              <FormTooltip content="% de energía capturada convertida en electricidad utilizable. Las hojas de datos de los paneles suelen indicar esto." />
            </label>
            <SimulationTextInput id="technology-efficiency" type="number" min={0} max={100} value={draft.efficiency} onChange={(e) => onDraftFieldChange('efficiency', toNumeric(e.target.value))} placeholder="0 to 100" />
          </div>

          <div>
            <label htmlFor="technology-co2-reduction" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Reducción de CO2 (kg/año)
              <FormTooltip content="Kg de CO₂ evitados por año en comparación con la línea base de combustibles fósiles." />
            </label>
            <SimulationTextInput id="technology-co2-reduction" type="number" min={0} value={draft.co2Reduction} onChange={(e) => onDraftFieldChange('co2Reduction', toNumeric(e.target.value))} placeholder="e.g. 1200" />
          </div>

          <div>
            <label htmlFor="technology-installation-cost" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Costo de instalación (EUR)
              <FormTooltip content="Gasto de capital único que incluye equipo y mano de obra." />
            </label>
            <SimulationTextInput id="technology-installation-cost" type="number" min={1} value={draft.installationCost} onChange={(e) => onDraftFieldChange('installationCost', toNumeric(e.target.value))} placeholder="e.g. 10000" />
          </div>

          <div>
            <label htmlFor="technology-maintenance-cost" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Coste de mantenimiento (EUR/año)
              <FormTooltip content="Coste anual recurrente para inspecciones, reparaciones y piezas." />
            </label>
            <SimulationTextInput id="technology-maintenance-cost" type="number" min={0} value={draft.maintenanceCost} onChange={(e) => onDraftFieldChange('maintenanceCost', toNumeric(e.target.value))} placeholder="e.g. 500" />
          </div>

          <div>
            <label htmlFor="technology-environmental-impact" className="mb-1 block text-sm font-medium text-slate-700 dark:text-content-dark/90">
              Puntuación de impacto ambiental (0-100)
              <FormTooltip content="Índice compuesto (0 = impacto mínimo, 100 = máximo). Cubre uso del suelo, ruido, impacto visual." />
            </label>
            <SimulationTextInput id="technology-environmental-impact" type="number" min={0} max={100} value={draft.environmentalImpact} onChange={(e) => onDraftFieldChange('environmentalImpact', toNumeric(e.target.value))} placeholder="Lower is better" />
          </div>

          {formError ? (
            <SimulationStateMessage role="alert" tone="error" className="md:col-span-2">
              {formError}
            </SimulationStateMessage>
          ) : null}

          <div className="md:col-span-2 flex justify-end">
            <div className="flex items-center gap-2">
              <SimulationActionButton type="button" variant="soft" onClick={onCancelEdit} disabled={isSubmitting}>
                  Cancel
              </SimulationActionButton>
              <SimulationActionButton type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : isEditing ? 'Save Changes' : 'Create Technology'}
              </SimulationActionButton>
            </div>
          </div>
        </form>
      </Tooltip.Provider>
    </SimulationCard>
  )
}
