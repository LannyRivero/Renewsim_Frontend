import { SimulationCard } from '@/shared/components/SimulationPrimitives'

interface Step {
  number: string
  title: string
  description: string
  checkpoint: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Captura del contexto energético',
    description:
      'Se ordenan ubicación, consumo, restricciones y preferencia tecnológica para partir de una base comparable.',
    checkpoint: 'Entrada clara y consistente',
  },
  {
    number: '02',
    title: 'Simulación técnica con lectura económica',
    description:
      'El motor cruza variables operativas con rendimiento esperado, costos y retorno para aterrizar escenarios viables.',
    checkpoint: 'Análisis técnico-financiero',
  },
  {
    number: '03',
    title: 'Resultado listo para defender',
    description:
      'La salida resume comparativas, impacto y recomendación ejecutiva para que negocio y operaciones tomen una decisión con contexto.',
    checkpoint: 'Conclusión accionable',
  },
]

function StepCard({ number, title, description, checkpoint }: Step) {
  return (
    <SimulationCard className="rounded-sm">
      <div className="flex items-start justify-between gap-4 border-b border-[#dde5dc] pb-2.5 dark:border-white/8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#51665a] dark:text-content-dark/72">
            {checkpoint}
          </p>
          <h3 className="mt-2 text-[1.05rem] font-bold tracking-[-0.03em] text-[#1c2a22] dark:text-content-dark">
            {title}
          </h3>
        </div>
        <span className="text-2xl font-black tracking-[-0.05em] text-[#1a6a45] dark:text-emerald-300">{number}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-content-dark/64">{description}</p>
    </SimulationCard>
  )
}

export function StepsSection() {
  return (
    <section className="grid gap-2 lg:h-full xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#627468] dark:text-content-dark/72">
          Flujo de simulación
        </p>
        <h2 className="mt-2 text-[1.45rem] font-black leading-[0.98] tracking-[-0.05em] text-[#122033] dark:text-content-dark sm:text-[1.65rem]">
          Tres pasos para pasar de datos a criterio.
        </h2>
      </div>

      <div className="grid gap-2 xl:h-full xl:grid-cols-3">
        {STEPS.map((step) => (
          <StepCard key={step.title} {...step} />
        ))}
      </div>
    </section>
  )
}
