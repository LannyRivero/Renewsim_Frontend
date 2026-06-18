import { SimulationActionButton, SimulationCard } from '@/shared/components'
import type { EditSimulationFormDefaults } from './editSimulationViewModel'

export function EditSimulationForm({
  defaults,
  isSubmitting,
  onSubmit,
}: {
  defaults: EditSimulationFormDefaults
  isSubmitting: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <SimulationCard className="p-6 sm:p-7">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="simulation-name" className="mb-2 block text-sm font-medium">
            Nombre de la simulación
          </label>
          <input
            id="simulation-name"
            name="simulationName"
            defaultValue={defaults.simulationName}
            className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-medium">
            Ubicación
          </label>
          <select
            id="location"
            name="location"
            className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
            defaultValue={defaults.location}
          >
            <option>{defaults.location}</option>
            <option>San Francisco, CA</option>
            <option>Austin, TX</option>
            <option>Miami, FL</option>
            <option>Denver, CO</option>
          </select>
        </div>

        <div>
          <label htmlFor="energy-source" className="mb-2 block text-sm font-medium">
            Fuente de energía
          </label>
          <select
            id="energy-source"
            name="energySource"
            className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
            defaultValue={defaults.energySource}
          >
            <option>Paneles solares</option>
            <option>Turbina eólica</option>
            <option>Hidroeléctrica</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="system-size" className="mb-2 block text-sm font-medium">
              Tamaño del sistema (kW)
            </label>
            <input
              id="system-size"
              name="systemSizeKw"
              type="number"
              step="0.1"
              defaultValue={defaults.systemSizeKw}
              className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
            />
          </div>
          <div>
            <label htmlFor="energy-consumption" className="mb-2 block text-sm font-medium">
              Consumo energético anual (kWh)
            </label>
            <input
              id="energy-consumption"
              name="annualConsumptionKwh"
              type="number"
              defaultValue={defaults.annualConsumptionKwh}
              className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="incentives" className="mb-2 block text-sm font-medium">
              Incentivos/bonificaciones ($)
            </label>
            <input
              id="incentives"
              name="incentives"
              type="number"
              defaultValue={defaults.incentives}
              className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
            />
          </div>
          <div>
            <label htmlFor="electricity-rate" className="mb-2 block text-sm font-medium">
              Tarifa eléctrica ($/kWh)
            </label>
            <input
              id="electricity-rate"
              name="electricityRate"
              type="number"
              step="0.01"
              defaultValue={defaults.electricityRate}
              className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SimulationActionButton type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </SimulationActionButton>
        </div>
      </form>
    </SimulationCard>
  )
}
