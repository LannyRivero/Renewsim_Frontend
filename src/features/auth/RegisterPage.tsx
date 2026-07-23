import { useNavigate } from 'react-router-dom'
import { RegisterForm } from './components/RegisterForm'
import { useToastStore } from '@/stores/toastStore'
import { SimulationCard, SimulationSectionHeader } from '@/shared/components/SimulationPrimitives'

const REGISTER_SIGNALS = [
  { label: 'Alta simple', value: 'Creá tu acceso sin friccion innecesaria.' },
  { label: 'Lectura compartida', value: 'Ordená escenarios, resultados y criterio en un mismo lugar.' },
  { label: 'Trabajo continuo', value: 'Empezá a construir casos sin depender de hojas dispersas.' },
]

export function RegisterPage() {
  const navigate = useNavigate()

  function handleSuccess() {
    useToastStore.getState().pushToast({
      title: 'Cuenta creada',
      description: 'Tu cuenta fue creada. Inicia sesión para continuar.',
      variant: 'success',
    })
    navigate('/iniciar-sesion')
  }

  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(52,88,69,0.08),transparent_30%),linear-gradient(180deg,#f4f7f2_0%,#edf2eb_48%,#f3f7f2_100%)] px-3 py-6 sm:px-4 lg:min-h-[calc(100vh-138px)] lg:px-5 lg:py-8 dark:bg-[radial-gradient(circle_at_top,rgba(34,84,59,0.28),rgba(8,16,13,0)_30%),linear-gradient(180deg,#0c1511_0%,#0a120f_100%)]">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-center lg:min-h-[calc(100vh-202px)]">
        <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,600px)_240px] lg:items-center xl:grid-cols-[minmax(0,640px)_260px]">
          <SimulationCard className="rounded-sm border-[#cfd8ce] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,250,246,0.98)_100%)] p-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,32,29,0.98)_0%,rgba(17,25,22,0.98)_100%)] lg:p-7">
            <SimulationSectionHeader
              eyebrow="Registro"
              title="Abrí tu acceso"
              description="Configurá tu cuenta para empezar a trabajar con escenarios, resultados y comparativas en una sola capa de lectura."
            />

            <div className="mt-6">
              <RegisterForm onSuccess={handleSuccess} />
            </div>
          </SimulationCard>

          <div className="grid gap-3">
            <SimulationCard tone="soft" className="rounded-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                Activacion de cuenta
              </p>
              <p className="mt-2 text-lg font-bold tracking-[-0.03em] text-[#1b2a22] dark:text-content-dark">
                Entrada al producto
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-content-dark/64">
                Una incorporacion simple para entrar al simulador con una base mas ordenada y mas profesional.
              </p>
              <div className="mt-5 space-y-3 border-t border-[#dde5dc] pt-4 dark:border-white/8">
                {REGISTER_SIGNALS.map((item) => (
                  <div key={item.label} className="border-b border-[#dde5dc] pb-3 last:border-b-0 last:pb-0 dark:border-white/8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/55">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-800 dark:text-content-dark/72">{item.value}</p>
                  </div>
                ))}
              </div>
            </SimulationCard>
          </div>
        </div>
      </div>
    </div>
  )
}
