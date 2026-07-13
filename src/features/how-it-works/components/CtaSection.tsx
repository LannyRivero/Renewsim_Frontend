import { Link } from 'react-router-dom'
import { SimulationActionButton, SimulationCard } from '@/shared/components/SimulationPrimitives'
import { useSimulatorNav } from '../../../shared/hooks'

export function CtaSection() {
  const goToSimulator = useSimulatorNav()

  return (
    <section>
      <SimulationCard className="rounded-sm border-[#cfd8ce] bg-[linear-gradient(135deg,#123b28_0%,#184f37_100%)] py-3 text-white dark:border-white/10 dark:bg-[linear-gradient(135deg,#123b28_0%,#153525_100%)]">
        <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/62">
              Siguiente paso
            </p>
            <h2 className="mt-1.5 text-[1.18rem] font-black leading-[1] tracking-[-0.035em] sm:text-[1.3rem]">
              Lleva esta metodología al simulador.
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-5 text-white/78">
              Carga un escenario, compara alternativas y revisa una recomendación con la misma lógica que viste en esta página.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <SimulationActionButton variant="outline" onClick={goToSimulator} className="h-8 border-white/15 bg-white px-4 text-[#184f37] hover:bg-[#f3f7f2]">
              Abrir simulador
            </SimulationActionButton>
            <Link
              to="/registro"
              className="inline-flex h-8 items-center justify-center rounded-sm border border-white/18 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/8"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </SimulationCard>
    </section>
  )
}
