import { BarChart3 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'
import { buildSimulationInsights } from '../utils/simulationInsights'
import {
  SimulationCard,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'

type EnergyProfile = {
  label: string
  roiBonus: number
  savingsMultiplier: number
  co2Multiplier: number
  investmentMultiplier: number
}

const ENERGY_PROFILES: EnergyProfile[] = [
  {
    label: 'Solar Panels',
    roiBonus: 0,
    savingsMultiplier: 1,
    co2Multiplier: 1,
    investmentMultiplier: 1,
  },
  {
    label: 'Wind Turbine',
    roiBonus: -1.2,
    savingsMultiplier: 1.2,
    co2Multiplier: 1.35,
    investmentMultiplier: 1.55,
  },
  {
    label: 'Hydroelectric',
    roiBonus: -0.4,
    savingsMultiplier: 1.4,
    co2Multiplier: 1.7,
    investmentMultiplier: 2.1,
  },
]

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

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

  const effectiveResult = data
    ? {
        id: data.id,
        location: data.location,
        energyType: data.energyType,
        roi: data.roi,
        efficiency: data.efficiency,
      }
    : requestedSimulationId
      ? null
      : resultFromStore

  const location = effectiveResult?.location ?? 'N/A'
  const energyType = effectiveResult?.energyType ?? 'Unknown'
  const simulationName = `${energyType} Simulation`
  const date = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'
  const insights = buildSimulationInsights(lastRunInput, effectiveResult)
  const roi = typeof effectiveResult?.roi === 'number' ? `${effectiveResult.roi}%` : `${insights.roiPercent}%`
  const efficiency =
    typeof effectiveResult?.efficiency === 'number'
      ? `${effectiveResult.efficiency}%`
      : `${insights.efficiencyPercent}%`

  const comparisonRows = ENERGY_PROFILES.map((profile) => {
    const annualSavings = insights.energyGeneratedKwh * 0.11 * profile.savingsMultiplier
    const initialInvestment = (lastRunInput?.budget ?? 1_000_000) * 0.1 * profile.investmentMultiplier
    const simulatedRoi = Math.max(2, insights.roiPercent + profile.roiBonus)

    return {
      energySource: profile.label,
      initialInvestment: formatCurrency(initialInvestment),
      annualSavings: `${formatCurrency(annualSavings)}/year`,
      roi: `${simulatedRoi.toFixed(1)}%`,
      co2Reduction: `${(insights.co2AvoidedTons * profile.co2Multiplier).toFixed(1)} tons`,
    }
  })

  const totalInvestment = comparisonRows.reduce((sum, row) => {
    const raw = Number(row.initialInvestment.replace(/[$,]/g, ''))
    return sum + raw
  }, 0)
  const totalSavings = comparisonRows.reduce((sum, row) => {
    const raw = Number(row.annualSavings.replace('/year', '').replace(/[$,]/g, ''))
    return sum + raw
  }, 0)

  return (
    <SimulationPageShell>
      <div className="flex flex-col gap-6">
        <SimulationSectionHeader
          eyebrow="Simulation Intelligence"
          eyebrowIcon={<BarChart3 className="h-3.5 w-3.5" />}
          title="Simulation Details"
          description="Review the active scenario through one consistent analysis surface: context, economics, environmental impact, and climate assumptions."
        />

        {requestedSimulationId && isLoading ? (
          <SimulationStateMessage>Loading simulation details...</SimulationStateMessage>
        ) : null}
        {requestedSimulationId && isError ? (
          <SimulationStateMessage tone="error">
            Could not load simulation details. Please try again.
          </SimulationStateMessage>
        ) : null}

        <div className="space-y-6">
          <SimulationCard tone="soft" className="p-6">
            <h2 className="mb-4 text-xl font-bold">Simulation Overview</h2>
            <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
              <div>
                <p className="text-on-surface-variant dark:text-content-dark/60">Simulation Name</p>
                <p className="mt-1 font-medium">{simulationName}</p>
              </div>
              <div>
                <p className="text-on-surface-variant dark:text-content-dark/60">Date</p>
                <p className="mt-1 font-medium">{date}</p>
              </div>
              <div>
                <p className="text-on-surface-variant dark:text-content-dark/60">Location</p>
                <p className="mt-1 font-medium">{location}</p>
              </div>
            </div>
          </SimulationCard>

          <SimulationCard className="overflow-hidden p-0">
            <div className="p-6">
              <h2 className="text-xl font-bold">Energy Source Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/85 dark:bg-white/8">
                  <tr>
                    <th className="px-6 py-3 font-medium" scope="col">Energy Source</th>
                    <th className="px-6 py-3 font-medium" scope="col">Initial Investment</th>
                    <th className="px-6 py-3 font-medium" scope="col">Annual Savings</th>
                    <th className="px-6 py-3 font-medium" scope="col">ROI</th>
                    <th className="px-6 py-3 font-medium" scope="col">CO2 Reduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant dark:divide-white/10">
                  {comparisonRows.map((row) => (
                    <tr key={row.energySource}>
                      <td className="px-6 py-4 font-medium">{row.energySource}</td>
                      <td className="px-6 py-4">{row.initialInvestment}</td>
                      <td className="px-6 py-4">{row.annualSavings}</td>
                      <td className="px-6 py-4">{row.roi}</td>
                      <td className="px-6 py-4">{row.co2Reduction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SimulationCard>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <SimulationCard tone="soft" className="p-6">
              <h3 className="font-semibold">Financial Summary</h3>
              <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">Total Investment: {formatCurrency(totalInvestment)}</p>
              <p className="text-sm text-on-surface-variant dark:text-content-dark/70">
                Total Savings: {formatCurrency(totalSavings)}/year
              </p>
              <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Overall ROI: {roi}</p>
            </SimulationCard>
            <SimulationCard tone="soft" className="p-6">
              <h3 className="font-semibold">Environmental Impact</h3>
              <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">
                Total CO2 Reduction: {insights.co2AvoidedTons} tons/year
              </p>
              <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Efficiency: {efficiency}</p>
            </SimulationCard>
          </div>

          <SimulationCard tone="soft" className="p-6">
            <h3 className="font-semibold">Climate Conditions Used</h3>
            <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">
              Irradiance: {lastRunInput?.climate.irradiance ?? 'N/A'} kWh/m2/day
            </p>
            <p className="text-sm text-on-surface-variant dark:text-content-dark/70">
              Wind speed: {lastRunInput?.climate.windSpeed ?? 'N/A'} m/s
            </p>
            <p className="text-sm text-on-surface-variant dark:text-content-dark/70">
              Hydrology: {lastRunInput?.climate.hydrology ?? 'N/A'} m3/s
            </p>
          </SimulationCard>

          <SimulationCard className="border-l-4 border-l-emerald-500 bg-emerald-50/72 p-6 dark:bg-emerald-500/10">
            <h3 className="mb-2 text-xl font-bold">Educational Insights</h3>
            <p className="text-sm text-on-surface dark:text-content-dark/80">
              This simulation demonstrates the significant financial and environmental benefits of transitioning to
              renewable energy sources. Combining multiple technologies can optimize both ROI and emissions
              reduction.
            </p>
          </SimulationCard>
        </div>
      </div>
    </SimulationPageShell>
  )
}
