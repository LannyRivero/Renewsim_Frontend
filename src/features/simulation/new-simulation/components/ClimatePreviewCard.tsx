import { SimulationCard, SimulationReadonlyInput, SimulationStateMessage } from '@/shared/components'
import type { ClimatePreviewValues } from '../helpers/climate'

interface ClimatePreviewCardProps {
  energyType: 'solar' | 'wind' | 'hydro'
  isRefreshingClimate: boolean
  hasLocationQuery: boolean
  preview: ClimatePreviewValues
}

export function ClimatePreviewCard({
  energyType,
  isRefreshingClimate,
  hasLocationQuery,
  preview,
}: ClimatePreviewCardProps) {
  return (
    <SimulationCard density="comfortable">
      <h2 className="text-lg font-bold text-on-surface dark:text-content-dark">Climate data (read-only)</h2>
      <p className="mt-1 text-xs text-on-surface-variant dark:text-content-dark/60">
        Values are adjusted for {energyType} projects at the selected location.
      </p>
      {hasLocationQuery && isRefreshingClimate ? (
        <SimulationStateMessage className="mt-1 text-xs">Refreshing data for selected location and energy type...</SimulationStateMessage>
      ) : null}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="irradiance" className="mb-1 block text-sm font-medium">
            Irradiance (kWh/m2/day)
          </label>
          <SimulationReadonlyInput id="irradiance" value={preview.irradiance} />
        </div>

        <div>
          <label htmlFor="wind-speed" className="mb-1 block text-sm font-medium">
            Wind speed (m/s)
          </label>
          <SimulationReadonlyInput id="wind-speed" value={preview.windSpeed} />
        </div>

        <div>
          <label htmlFor="hydrology" className="mb-1 block text-sm font-medium">
            Hydrology (m3/s)
          </label>
          <SimulationReadonlyInput id="hydrology" value={preview.hydrology} />
        </div>
      </div>
    </SimulationCard>
  )
}
