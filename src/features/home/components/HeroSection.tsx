import { Link } from 'react-router-dom'
import { useSimulatorNav } from '../../../shared/hooks'

const METRICS = [
  { value: '8.4 MWh', label: 'Energy generated / year', icon: 'bolt', delta: '+12%' },
  { value: '$1,240', label: 'Estimated savings / year', icon: 'savings', delta: '+8%' },
  { value: '3.2 t', label: 'CO2 avoided / year', icon: 'eco', delta: '-18%' },
  { value: '4.2 years', label: 'Return on investment', icon: 'trending_up', delta: null },
]

const STATS = [
  { value: '+10K', label: 'Simulations' },
  { value: '98%', label: 'Accuracy' },
  { value: '50+', label: 'Companies' },
]

export function HeroSection() {
  const goToSimulator = useSimulatorNav()
  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Editorial text ── */}
          <div className="text-center lg:text-left">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full bg-surface-container border border-outline-variant dark:bg-white/5 dark:border-white/10">
              <span className="size-1.5 rounded-full bg-primary-container" />
              <span className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant dark:text-content-dark/50">
                 Enterprise Platform · AI + Simulation
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-on-surface dark:text-content-dark">
              Smart{' '}
              <br className="hidden sm:inline" />
              energy{' '}
              <br className="hidden sm:inline" />
              <span className="text-gradient-primary">decisions.</span>
            </h1>

            <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed text-on-surface-variant dark:text-content-dark/60">
              Simulate, compare, and optimize renewable energy sources with
              AI-powered predictive analytics. Reduce costs and carbon
              footprint using accurate data.
            </p>

            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={goToSimulator}
                className="px-8 py-3.5 rounded-lg text-base font-bold bg-primary-container text-on-primary hover:brightness-95 transition-all cursor-pointer shadow-sm"
              >
                Start Simulation
              </button>
              <Link
                to="/how-it-works"
                className="px-8 py-3.5 rounded-lg text-base font-semibold text-on-surface dark:text-content-dark border border-outline-variant dark:border-white/10 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors"
              >
                How it works
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-14 flex justify-center lg:justify-start gap-8 pt-8 border-t border-outline-variant dark:border-white/8">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-on-surface dark:text-content-dark">{value}</p>
                  <p className="mt-0.5 text-xs text-on-surface-variant dark:text-content-dark/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Clean data card ── */}
          <div className="card-elevated rounded-2xl p-8 space-y-3">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant dark:text-content-dark/50">
                   Active simulation
                </p>
                <p className="mt-0.5 text-base font-bold text-on-surface dark:text-content-dark">
                   Solar Panel · 6 kWp · Madrid
                </p>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 dark:bg-primary-container/20 text-xs font-semibold text-primary dark:text-primary-inverse">
                <span className="size-1.5 rounded-full bg-primary-container animate-pulse" />
                Live
              </span>
            </div>

            {/* Metrics list */}
            {METRICS.map(({ value, label, icon, delta }) => (
              <div
                key={label}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low dark:bg-white/4 border border-outline-variant/50 dark:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-container/12 dark:bg-primary-container/15">
                    <span className="material-symbols-outlined text-primary dark:text-primary-inverse text-lg">{icon}</span>
                  </div>
                  <span className="text-sm text-on-surface-variant dark:text-content-dark/60">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-on-surface dark:text-content-dark">{value}</span>
                  {delta && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      delta.startsWith('-')
                        ? 'bg-primary-container/15 text-primary dark:text-primary-inverse'
                        : 'bg-primary-container/15 text-primary dark:text-primary-inverse'
                    }`}>
                      {delta}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Progress bar */}
            <div className="pt-4">
              <div className="flex justify-between text-xs text-on-surface-variant dark:text-content-dark/40 mb-2">
                 <span>Analysis completed</span>
                <span className="font-semibold">87%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-container-highest dark:bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full accent-bar transition-all"
                  style={{ width: '87%' }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
