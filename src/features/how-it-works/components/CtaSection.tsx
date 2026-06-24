import { Link } from 'react-router-dom'
import { useSimulatorNav } from '../../../shared/hooks'

export function CtaSection() {
  const goToSimulator = useSimulatorNav()

  return (
    <section className="mt-16 lg:mt-20">
      <div className="rounded-[2rem] border border-[#d5ddd4] bg-[linear-gradient(135deg,rgba(26,106,69,0.98)_0%,rgba(43,88,68,0.98)_100%)] px-6 py-8 text-white shadow-[0_28px_70px_-44px_rgba(26,106,69,0.55)] sm:px-8 lg:px-10 lg:py-10 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(18,71,49,1)_0%,rgba(25,52,40,1)_100%)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/68">
              Siguiente paso
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] md:text-4xl">
              Si el producto quiere verse premium, el recorrido también tiene que sentirse directo.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
              Entra al simulador, carga un escenario y evalúa resultados con una interfaz pensada para análisis real, no para decorar una demo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <button
              type="button"
              onClick={goToSimulator}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-[#184f37] transition-colors hover:bg-[#f3f7f2]"
            >
              Abrir simulador
            </button>
            <Link
              to="/registro"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/18 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/8"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
