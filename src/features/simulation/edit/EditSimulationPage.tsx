import { Link } from 'react-router-dom'

export function EditSimulationPage() {
  return (
    <section className="min-h-screen bg-surface dark:bg-background-dark">
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface/80 backdrop-blur-sm dark:border-white/10 dark:bg-background-dark/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-full bg-primary-container" />
            <h2 className="text-xl font-bold">RenewSim</h2>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/simulador" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/simulador/historial" className="text-sm font-medium text-primary">
              Simulations
            </Link>
            <Link to="/como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/acerca-de" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notificaciones"
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low dark:text-content-dark/60"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-10 rounded-full bg-surface-container" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface dark:text-content-dark">
            Edit Simulation
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-content-dark/60">
            Update the parameters for your existing simulation below.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="simulation-name" className="mb-2 block text-sm font-medium">
              Simulation Name
            </label>
            <input
              id="simulation-name"
              defaultValue="My Solar Project"
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium">
              Location
            </label>
            <select
              id="location"
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              defaultValue="San Francisco, CA"
            >
              <option>San Francisco, CA</option>
              <option>Austin, TX</option>
              <option>Miami, FL</option>
              <option>Denver, CO</option>
            </select>
          </div>

          <div>
            <label htmlFor="energy-source" className="mb-2 block text-sm font-medium">
              Energy Source
            </label>
            <select
              id="energy-source"
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              defaultValue="Solar Panels"
            >
              <option>Solar Panels</option>
              <option>Wind Turbine</option>
              <option>Geothermal</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="system-size" className="mb-2 block text-sm font-medium">
                System Size (kW)
              </label>
              <input
                id="system-size"
                type="number"
                defaultValue={7.5}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              />
            </div>
            <div>
              <label htmlFor="energy-consumption" className="mb-2 block text-sm font-medium">
                Annual Energy Consumption (kWh)
              </label>
              <input
                id="energy-consumption"
                type="number"
                defaultValue={10000}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="incentives" className="mb-2 block text-sm font-medium">
                Incentives/Rebates ($)
              </label>
              <input
                id="incentives"
                type="number"
                defaultValue={1500}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              />
            </div>
            <div>
              <label htmlFor="electricity-rate" className="mb-2 block text-sm font-medium">
                Electricity Rate ($/kWh)
              </label>
              <input
                id="electricity-rate"
                type="number"
                step="0.01"
                defaultValue={0.18}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </section>
  )
}
