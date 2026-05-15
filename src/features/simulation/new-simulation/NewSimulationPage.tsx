const FIELD_CLASS =
  'w-full h-12 px-4 rounded-lg bg-surface dark:bg-surface-dark border border-outline-variant dark:border-white/10 placeholder:text-on-surface-variant/60 dark:placeholder:text-content-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-container/60 focus:border-primary-container transition'

const READONLY_CLASS =
  'w-full h-12 px-4 rounded-lg bg-surface-container-low dark:bg-white/5 border border-outline-variant dark:border-white/10 text-on-surface-variant dark:text-content-dark/70 cursor-not-allowed'

export function NewSimulationPage() {
  return (
    <section className="min-h-screen bg-surface dark:bg-background-dark">
      <header className="sticky top-0 z-10 border-b border-outline-variant dark:border-white/10 bg-surface/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-primary font-bold">
              Simulations
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              Resources
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              Community
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              aria-label="Notificaciones"
              className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div
              aria-label="Avatar"
              className="h-10 w-10 rounded-full bg-primary-container/30 border border-outline-variant dark:border-white/10"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface dark:text-content-dark">
            Nueva simulacion personalizada
          </h1>
          <p className="mt-2 text-base text-on-surface-variant dark:text-content-dark/60">
            Configura tu simulacion con parametros especificos de tu proyecto.
          </p>
        </div>

        <form className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-medium">
                Ubicacion
              </label>
              <input id="location" type="text" placeholder="Ingresa ubicacion o usa geolocalizacion" className={FIELD_CLASS} />
            </div>

            <div>
              <label htmlFor="energy-type" className="mb-1 block text-sm font-medium">
                Tipo de energia
              </label>
              <select id="energy-type" className={FIELD_CLASS} defaultValue="solar">
                <option value="solar">Solar</option>
                <option value="wind">Eolica</option>
                <option value="hydro">Hidroelectrica</option>
              </select>
            </div>

            <div>
              <label htmlFor="project-size" className="mb-1 block text-sm font-medium">
                Tamano del proyecto (kW/MW)
              </label>
              <input id="project-size" type="text" placeholder="Ejemplo: 500 kW" className={FIELD_CLASS} />
            </div>

            <div>
              <label htmlFor="budget" className="mb-1 block text-sm font-medium">
                Presupuesto (EUR)
              </label>
              <input id="budget" type="number" placeholder="Ejemplo: 1000000" className={FIELD_CLASS} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-on-surface dark:text-content-dark">Datos climaticos (solo lectura)</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="irradiance" className="mb-1 block text-sm font-medium">
                  Irradiancia (kWh/m2/dia)
                </label>
                <input id="irradiance" readOnly value="5.4" className={READONLY_CLASS} />
              </div>

              <div>
                <label htmlFor="wind-speed" className="mb-1 block text-sm font-medium">
                  Velocidad del viento (m/s)
                </label>
                <input id="wind-speed" readOnly value="7.2" className={READONLY_CLASS} />
              </div>

              <div>
                <label htmlFor="hydrology" className="mb-1 block text-sm font-medium">
                  Hidrologia (m3/s)
                </label>
                <input id="hydrology" readOnly value="12.5" className={READONLY_CLASS} />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="w-full rounded-lg bg-primary-container px-8 py-3 text-base font-semibold text-on-primary transition hover:brightness-95 md:w-auto"
            >
              Ejecutar simulacion
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
