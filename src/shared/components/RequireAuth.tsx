import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const storedToken = localStorage.getItem('renewsim-token')
  const hasToken = Boolean(accessToken ?? storedToken)

  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
