import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getRealSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'
import {
  SimulationActionButton,
  SimulationBreadcrumbs,
  SimulationPageContent,
  SimulationPageShell,
  SimulationStateMessage,
} from '@/shared/components'
import type { BreadcrumbItem } from '@/shared/components'
import { buildSimulationDetailsViewModel } from './simulationDetailsViewModel'
import { formatEnergyTypeLabel } from './simulationDetailsFormatters'
import {
  ClimateCompactBar,
  ComparisonCompactNote,
  ExecutiveDecisionHero,
  ExecutiveInsightGrid,
  FinancialCommandCenter,
  MetricTile,
} from './SimulationDetailsSections'
import type { DetailMetric } from './simulationDetailsViewModel'

function MetricGridRow({ metrics }: { metrics: DetailMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <MetricTile key={metric.label} metric={metric} />
      ))}
    </div>
  )
}

export function SimulationDetailsPage() {
  const [searchParams] = useSearchParams()
  const resultFromStore = useSimulationStore((state) => state.lastResult)
  const requestedSimulationId = searchParams.get('id')
  const simulationId = requestedSimulationId ?? resultFromStore?.id ?? null
  const [isFinancialOpen, setIsFinancialOpen] = useState(true)
  const [isClimateOpen, setIsClimateOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getRealSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const viewModel = buildSimulationDetailsViewModel({
    data: null,
    realData: data,
    requestedSimulationId,
    resultFromStore,
  })

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="lg:h-auto" bodyClassName="lg:h-auto">
      <SimulationPageContent className="lg:h-auto">
        <SimulationBreadcrumbs
          className="mb-2"
          items={[
            { label: 'Simulador', href: '/simulador' },
            { label: 'Historial', href: '/simulador/historial' },
            { label: viewModel.simulationName },
          ] satisfies BreadcrumbItem[]}
        />
        {requestedSimulationId && isLoading ? (
          <SimulationStateMessage>Cargando detalles de la simulación...</SimulationStateMessage>
        ) : null}
        {requestedSimulationId && isError ? (
          <SimulationStateMessage tone="error">
            No se pudieron cargar los detalles de la simulación. Intentá nuevamente.
          </SimulationStateMessage>
        ) : null}

        <div className="space-y-4">
          <ExecutiveDecisionHero
            pageTitle="Detalles de la simulación"
            pageDescription="Vista consolidada del escenario para revisar desempeño, viabilidad financiera y condiciones operativas."
            action={
              <Link to="/simulador/nueva">
                <SimulationActionButton type="button" variant="primary" className="w-full lg:w-auto">
                  Nueva simulación
                </SimulationActionButton>
              </Link>
            }
            simulationName={viewModel.simulationName}
            location={viewModel.location}
            date={viewModel.date}
            energyType={formatEnergyTypeLabel(viewModel.energyType)}
            decisionStatus={viewModel.decisionStatus}
            decisionHeadline={viewModel.decisionHeadline}
            keyMetrics={viewModel.summarySection.primaryMetrics}
            decisionDrivers={viewModel.decisionDrivers}
          />

          {viewModel.summarySection.supportingMetrics?.length ? (
            <ExecutiveInsightGrid metrics={viewModel.summarySection.supportingMetrics} />
          ) : null}

          {viewModel.summarySnapshotSection.supportingMetrics?.length ? (
            <MetricGridRow metrics={viewModel.summarySnapshotSection.supportingMetrics} />
          ) : null}

          <FinancialCommandCenter
            content={viewModel.financialSection}
            isOpen={isFinancialOpen}
            onToggle={() => setIsFinancialOpen((current) => !current)}
          />

          {viewModel.climateSection.primaryMetrics[0]?.value !== 'N/D' ? (
            <ClimateCompactBar
              content={viewModel.climateSection}
              isOpen={isClimateOpen}
              onToggle={() => setIsClimateOpen((current) => !current)}
            />
          ) : null}

          <ComparisonCompactNote
            content={viewModel.comparisonPlaceholder}
            isOpen={isComparisonOpen}
            onToggle={() => setIsComparisonOpen((current) => !current)}
          />
        </div>
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
