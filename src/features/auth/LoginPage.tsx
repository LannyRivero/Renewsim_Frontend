import { useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { readUserFromToken } from '@/shared/utils/authToken'

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
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.9fr)] lg:items-center">
        <section className="rounded-[2rem] border border-[#d5ddd4] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(246,249,245,0.96)_100%)] p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.025)_100%)] lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a6a45] dark:text-emerald-300">
            Acceso seguro
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-slate-950 dark:text-content-dark md:text-5xl">
            Entra a tu espacio de simulación con una experiencia más sobria.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-content-dark/62">
            Accede a tus escenarios, resultados y comparativas desde una interfaz pensada para trabajo real, no para una demo pasajera.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              'Seguimiento de simulaciones',
              'Lectura técnica y financiera',
              'Continuidad entre equipos',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-[#f6f9f5] px-4 py-4 text-sm leading-6 text-slate-700 dark:bg-white/[0.03] dark:text-content-dark/62">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-[2rem] border border-[#d5ddd4] bg-white/80 p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-white/[0.04] lg:p-8">
          <div className="mb-8 text-center lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/56">
              Iniciar sesión
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark">
              Accede a tu cuenta
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-content-dark/58">
              Continúa donde dejaste tus análisis en RenewSim.
            </p>
          </div>

          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}
