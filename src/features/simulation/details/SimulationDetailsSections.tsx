import { SimulationCard } from '@/shared/components'
import type { EnergyComparisonRow } from './simulationDetailsViewModel'

export function SimulationOverviewCard({
  simulationName,
  date,
  location,
}: {
  simulationName: string
  date: string
  location: string
}) {
  return (
    <SimulationCard tone="soft" className="p-6">
      <h2 className="mb-4 text-xl font-bold">Resumen de la simulación</h2>
      <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
        <div>
          <p className="text-on-surface-variant dark:text-content-dark/60">Nombre de la simulación</p>
          <p className="mt-1 font-medium">{simulationName}</p>
        </div>
        <div>
          <p className="text-on-surface-variant dark:text-content-dark/60">Fecha</p>
          <p className="mt-1 font-medium">{date}</p>
        </div>
        <div>
          <p className="text-on-surface-variant dark:text-content-dark/60">Ubicación</p>
          <p className="mt-1 font-medium">{location}</p>
        </div>
      </div>
    </SimulationCard>
  )
}

export function EnergyComparisonCard({ comparisonRows }: { comparisonRows: EnergyComparisonRow[] }) {
  return (
    <SimulationCard className="overflow-hidden p-0">
      <div className="p-6">
        <h2 className="text-xl font-bold">Comparación de fuentes de energía</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/85 dark:bg-white/8">
            <tr>
              <th className="px-6 py-3 font-medium" scope="col">Fuente de energía</th>
              <th className="px-6 py-3 font-medium" scope="col">Inversión inicial</th>
              <th className="px-6 py-3 font-medium" scope="col">Ahorro anual</th>
              <th className="px-6 py-3 font-medium" scope="col">ROI</th>
              <th className="px-6 py-3 font-medium" scope="col">Reducción de CO2</th>
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
  )
}

export function SimulationSummaryCards({
  totalInvestment,
  totalSavings,
  roi,
  co2Reduction,
  efficiency,
}: {
  totalInvestment: string
  totalSavings: string
  roi: string
  co2Reduction: string
  efficiency: string
}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <SimulationCard tone="soft" className="p-6">
        <h3 className="font-semibold">Resumen financiero</h3>
        <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">Inversión total: {totalInvestment}</p>
        <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Ahorro total: {totalSavings}</p>
        <p className="text-sm text-on-surface-variant dark:text-content-dark/70">ROI total: {roi}</p>
      </SimulationCard>
      <SimulationCard tone="soft" className="p-6">
        <h3 className="font-semibold">Impacto ambiental</h3>
        <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">
          Reducción total de CO2: {co2Reduction}
        </p>
        <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Eficiencia: {efficiency}</p>
      </SimulationCard>
    </div>
  )
}

export function ClimateConditionsCard({
  irradiance,
  windSpeed,
  hydrology,
  averageTemperature,
  climateSource,
  climatePeriod,
}: {
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  averageTemperature: string
  climateSource: string
  climatePeriod: string
}) {
  return (
    <SimulationCard tone="soft" className="p-6">
      <h3 className="font-semibold">Condiciones climáticas utilizadas</h3>
      <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">Irradiancia: {irradiance} kWh/m2/día</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Velocidad del viento: {windSpeed} m/s</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Hidrología: {hydrology}</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Temperatura: {averageTemperature}</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Fuente: {climateSource}</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Período: {climatePeriod}</p>
    </SimulationCard>
  )
}

export function EducationalConclusionsCard() {
  return (
    <SimulationCard className="border-l-4 border-l-emerald-500 bg-emerald-50/72 p-6 dark:bg-emerald-500/10">
      <h3 className="mb-2 text-xl font-bold">Conclusiones educativas</h3>
      <p className="text-sm text-on-surface dark:text-content-dark/80">
        Esta simulación demuestra los beneficios financieros y ambientales de avanzar hacia fuentes de energía renovable. Combinar múltiples tecnologías puede optimizar tanto el ROI como la reducción de emisiones.
      </p>
    </SimulationCard>
  )
}
