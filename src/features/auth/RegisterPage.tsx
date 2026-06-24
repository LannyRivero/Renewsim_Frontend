import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from './components/RegisterForm'
import { useToastStore } from '@/stores/toastStore'

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
    <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.9fr)] lg:items-center">
        <section className="rounded-[2rem] border border-[#d5ddd4] bg-[linear-gradient(135deg,rgba(26,106,69,0.98)_0%,rgba(43,88,68,0.98)_100%)] p-5 text-white shadow-[0_28px_70px_-44px_rgba(26,106,69,0.55)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(18,71,49,1)_0%,rgba(25,52,40,1)_100%)] lg:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/68">
            Activación de cuenta
          </p>
          <h1 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.05em] md:text-[3.35rem]">
            Crea tu acceso y empieza a construir decisiones más defendibles.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/78">
            Registro simple, lectura clara y una plataforma lista para comparar escenarios energéticos con criterio técnico y de negocio.
          </p>
          <div className="mt-5 space-y-2.5">
            {[
              'Configura tu acceso en minutos',
              'Centraliza simulaciones y resultados',
              'Comparte una misma lectura dentro del equipo',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-2.5 text-sm leading-6 text-white/82">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 text-sm text-white/72">
            ¿Ya tienes cuenta?{' '}
            <Link to="/iniciar-sesion" className="font-semibold text-white underline-offset-4 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </section>

        <div className="rounded-[2rem] border border-[#d5ddd4] bg-white/80 p-5 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-white/[0.04] lg:p-6">
          <div className="mb-5 text-center lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/56">
              Registro
            </p>
            <h2 className="mt-2.5 text-[2rem] font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark">
              Crea tu cuenta
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-content-dark/58">
              Abre tu acceso a RenewSim y organiza tus analisis desde el primer escenario.
            </p>
          </div>

          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}
