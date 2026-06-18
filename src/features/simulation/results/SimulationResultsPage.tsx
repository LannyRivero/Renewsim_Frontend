import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSimulationById } from '../services/simulationService'
import { getAllTechnologies } from '../technologies/services/technologyService'
import { useSimulationStore } from '@/stores/simulationStore'
import {
  SimulationActionButton,
  SimulationPageShell,
  SimulationSectionHeader,
} from '@/shared/components'
import {
  ClimateConditionsSection,
  MetricsSection,
  QuickReadingSection,
  ResultsHeroSection,
  TechnologyComparisonSection,
} from './SimulationResultsSections'
import { buildSimulationResultsViewModel } from './simulationResultsViewModel'

export function SimulationResultsPage() {
  const [searchParams] = useSearchParams()
  const lastResult = useSimulationStore((state) => state.lastResult)
  const lastRunInput = useSimulationStore((state) => state.lastRunInput)
  const simulationId = searchParams.get('id') ?? lastResult?.id ?? null

  const { data } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const technologiesQuery = useQuery({
    queryKey: ['technologies', 'results-comparison'],
    queryFn: async () => {
      const response = await getAllTechnologies(0, 100)
      return response.items
    },
  })
  const viewModel = buildSimulationResultsViewModel({
    data,
    lastResult,
    lastRunInput,
    technologies: technologiesQuery.data ?? [],
  })

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="px-3 pt-4 pb-4 sm:px-4 lg:h-auto lg:p-5">
      <div className="flex flex-col gap-5">
        <SimulationSectionHeader
          eyebrow="Resultados de simulación"
          title="Resultado operativo"
          description="Leé el rendimiento real de la simulación y compará tecnologías candidatas antes de tomar una decisión." 
          actions={
            <Link to="/simulador/nueva">
              <SimulationActionButton type="button" variant="primary">
                Nueva simulación
              </SimulationActionButton>
            </Link>
          }
          className="md:items-center"
        />
        <ResultsHeroSection
          recommendedTechnology={viewModel.recommendedTechnology}
          simulationName={viewModel.effectiveResult?.name}
          resultLocation={viewModel.resultLocation}
          normalizedEnergyType={viewModel.normalizedEnergyType}
          simulationId={viewModel.effectiveResult?.id}
          roiValue={viewModel.roiValue}
          savingsValue={viewModel.savingsValue}
          energyValue={viewModel.energyValue}
        />

        <ClimateConditionsSection
          irradiance={viewModel.effectiveResult?.irradiance}
          windSpeed={viewModel.effectiveResult?.windSpeed}
          hydrology={viewModel.effectiveResult?.hydrology}
          averageTemperature={viewModel.averageTemperature}
          climateSource={viewModel.climateSource}
          climatePeriod={viewModel.climatePeriod}
        />

        <MetricsSection metrics={viewModel.metrics} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <TechnologyComparisonSection
            normalizedEnergyType={viewModel.normalizedEnergyType}
            comparableTechnologies={viewModel.comparableTechnologies}
            isLoading={technologiesQuery.isLoading}
          />

          <QuickReadingSection
            comparisonHeights={viewModel.comparisonHeights}
            conclusion={viewModel.conclusion}
          />
        </div>
      </div>
    </SimulationPageShell>
  )
}
