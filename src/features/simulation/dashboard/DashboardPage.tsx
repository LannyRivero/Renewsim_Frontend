import { StatsGrid } from './components/StatsGrid'
import { EnergyBarChart } from './components/EnergyBarChart'
import { DistributionDonut } from './components/DistributionDonut'
import {
  DASHBOARD_STATS,
  ENERGY_BY_SOURCE,
  DISTRIBUTION,
} from './data/dashboardMock'

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-on-surface dark:text-content-dark mb-8">
        Dashboard
      </h1>

      {/* KPI cards */}
      <StatsGrid stats={DASHBOARD_STATS} />

      {/* Charts section */}
      <h2 className="text-xl font-bold text-on-surface dark:text-content-dark mt-10 mb-6">
        Energy Summary
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnergyBarChart data={ENERGY_BY_SOURCE} />
        </div>
        <div>
          <DistributionDonut data={DISTRIBUTION} />
        </div>
      </div>
    </div>
  )
}
