import { useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { readUserFromToken } from '@/shared/utils/authToken'
import { SimulationCard, SimulationSectionHeader } from '@/shared/components/SimulationPrimitives'

const LOGIN_SIGNALS = [
  { label: 'Portafolio activo', value: '12 escenarios en seguimiento' },
  { label: 'Lectura ejecutiva', value: 'ROI, payback y viabilidad en una misma vista' },
  { label: 'Continuidad', value: 'Retomá decisiones sin reconstruir contexto' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromState =
    typeof location.state === 'object' && location.state !== null && 'from' in location.state
      ? (location.state as { from?: unknown }).from
      : undefined

  const redirectPath =
    typeof fromState === 'string'
      ? fromState
      : typeof fromState === 'object' &&
          fromState !== null &&
          'pathname' in fromState &&
          typeof (fromState as { pathname?: unknown }).pathname === 'string'
        ? (fromState as { pathname: string }).pathname
        : '/simulador'

  function handleSuccess(token: string) {
    const userFromToken = readUserFromToken(token)
    useAuthStore.setState((state) => ({
      ...state,
      accessToken: token,
      user: userFromToken
        ? {
            id: 0,
            username: userFromToken.username,
            roles: userFromToken.roles,
          }
        : state.user,
      isAuthenticated: true,
    }))
    localStorage.setItem('renewsim-token', token)
    useToastStore.getState().pushToast({
      title: 'Sesión iniciada',
      description: 'Bienvenido a RenewSim.',
      variant: 'success',
    })
    navigate(redirectPath)
  }

  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(52,88,69,0.08),transparent_30%),linear-gradient(180deg,#f4f7f2_0%,#edf2eb_48%,#f3f7f2_100%)] px-3 py-6 sm:px-4 lg:min-h-[calc(100vh-138px)] lg:px-5 lg:py-8 dark:bg-[radial-gradient(circle_at_top,rgba(34,84,59,0.28),rgba(8,16,13,0)_30%),linear-gradient(180deg,#0c1511_0%,#0a120f_100%)]">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-center lg:min-h-[calc(100vh-202px)]">
        <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,560px)_280px] lg:items-center xl:grid-cols-[minmax(0,600px)_300px]">
          <SimulationCard className="rounded-sm border-[#cfd8ce] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,250,246,0.98)_100%)] p-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,32,29,0.98)_0%,rgba(17,25,22,0.98)_100%)] lg:p-7">
            <SimulationSectionHeader
              eyebrow="Iniciar sesion"
              title="Accedé a tu consola"
              description="Retomá escenarios, comparativas y resultados desde una capa de trabajo sobria y profesional."
            />

            <div className="mt-6">
              <LoginForm onSuccess={handleSuccess} />
            </div>
          </SimulationCard>

          <div className="grid gap-3">
            <SimulationCard tone="soft" className="rounded-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                RenewSim access
              </p>
              <p className="mt-2 text-lg font-bold tracking-[-0.03em] text-[#1b2a22] dark:text-content-dark">
                Entrada al espacio de trabajo
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-content-dark/64">
                Una entrada directa al producto, sin ruido de landing ni decoracion innecesaria.
              </p>
            </SimulationCard>

            <SimulationCard className="rounded-sm">
              <div className="space-y-3">
                {LOGIN_SIGNALS.map((item) => (
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
