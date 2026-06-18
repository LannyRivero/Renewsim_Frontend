import { BarChart3 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'
import {
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'
import {
  ClimateConditionsCard,
  EducationalConclusionsCard,
  EnergyComparisonCard,
  SimulationOverviewCard,
  SimulationSummaryCards,
} from './SimulationDetailsSections'
import { buildSimulationDetailsViewModel } from './simulationDetailsViewModel'

export function SimulationDetailsPage() {
  const [searchParams] = useSearchParams()
  const resultFromStore = useSimulationStore((state) => state.lastResult)
  const lastRunInput = useSimulationStore((state) => state.lastRunInput)
  const requestedSimulationId = searchParams.get('id')
  const simulationId = requestedSimulationId ?? resultFromStore?.id ?? null

  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const viewModel = buildSimulationDetailsViewModel({
    data,
    requestedSimulationId,
    resultFromStore,
    lastRunInput,
  })

  return (
    <SimulationPageShell>
      <div className="flex flex-col gap-6">
        <SimulationSectionHeader
          eyebrow="Inteligencia de simulación"
          eyebrowIcon={<BarChart3 className="h-3.5 w-3.5" />}
          title="Detalles de la simulación"
          description="Revisá el escenario activo en una vista consistente: contexto, economía, impacto ambiental y supuestos climáticos."
        />

        {requestedSimulationId && isLoading ? (
          <SimulationStateMessage>Cargando detalles de la simulación...</SimulationStateMessage>
        ) : null}
        {requestedSimulationId && isError ? (
          <SimulationStateMessage tone="error">
            No se pudieron cargar los detalles de la simulación. Intentá nuevamente.
          </SimulationStateMessage>
        ) : null}

        <div className="space-y-6">
          <SimulationOverviewCard
            simulationName={viewModel.simulationName}
            date={viewModel.date}
            location={viewModel.location}
          />
          <EnergyComparisonCard comparisonRows={viewModel.comparisonRows} />
          <SimulationSummaryCards
            totalInvestment={viewModel.totalInvestment}
            totalSavings={viewModel.totalSavings}
            roi={viewModel.roi}
            co2Reduction={viewModel.co2Reduction}
            efficiency={viewModel.efficiency}
          />
          <ClimateConditionsCard
            irradiance={viewModel.irradiance}
            windSpeed={viewModel.windSpeed}
            hydrology={viewModel.hydrology}
            averageTemperature={viewModel.averageTemperature}
            climateSource={viewModel.climateSource}
            climatePeriod={viewModel.climatePeriod}
          />
          <EducationalConclusionsCard />
        </div>
      </div>
    </SimulationPageShell>
  )
}
