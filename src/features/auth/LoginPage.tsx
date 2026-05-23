import { useNavigate } from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

export function LoginPage() {
  const navigate = useNavigate()

  function handleSuccess(token: string) {
    useAuthStore.setState((state) => ({
      ...state,
      accessToken: token,
      isAuthenticated: true,
    }))
    localStorage.setItem('renewsim-token', token)
    useToastStore.getState().pushToast({
      title: 'Sesion iniciada',
      description: 'Bienvenido a RenewSim.',
      variant: 'success',
    })
    navigate('/simulador')
  }

  return (
    <div className="flex flex-1 justify-center items-center py-16 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Logo + title */}
        <div className="text-center mb-10">
          <div className="h-1 w-10 rounded-full accent-bar mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold text-on-surface dark:text-content-dark">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-content-dark/50">
            Accede a tu cuenta de RenewSim
          </p>
        </div>

        <div className="card rounded-2xl p-8">
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}
