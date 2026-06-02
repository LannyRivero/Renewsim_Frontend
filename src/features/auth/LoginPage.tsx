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
      title: 'Signed In',
      description: 'Welcome to RenewSim.',
      variant: 'success',
    })
    navigate(redirectPath)
  }

  return (
    <div className="flex flex-1 justify-center items-center py-16 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Logo + title */}
        <div className="text-center mb-10">
          <div className="h-1 w-10 rounded-full accent-bar mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold text-on-surface dark:text-content-dark">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-content-dark/50">
            Access your RenewSim account
          </p>
        </div>

        <div className="card rounded-2xl p-8">
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}
