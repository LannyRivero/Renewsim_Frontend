import { useSimulatorNav } from '../../../shared/hooks'

export function CtaSection() {
  const goToSimulator = useSimulatorNav()
  return (
    <section className="mt-20">
      {/* Accent top bar */}
      <div className="h-1 w-16 rounded-full accent-bar mb-10 mx-auto" />

      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface dark:text-content-dark">
          ¿Listo para optimizar tu energía?
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-lg text-on-surface-variant dark:text-content-dark/55">
          Únete a las empresas que ya toman decisiones energéticas inteligentes con RenewSim.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={goToSimulator}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg h-12 px-10 bg-primary-container text-on-primary text-base font-bold hover:brightness-95 transition-all shadow-sm"
          >
            Comenzar Simulación
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg h-12 px-8 text-base font-semibold text-on-surface dark:text-content-dark border border-outline-variant dark:border-white/10 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors"
          >
            Solicitar demo
          </button>
        </div>
      </div>
    </section>
  )
}
