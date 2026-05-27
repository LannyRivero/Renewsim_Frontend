import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface RequireRoleProps {
  role: string
  children: React.ReactNode
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const roles = user?.roles ?? []

  if (!roles.includes(role)) {
    return <Navigate to="/simulador" state={{ from: location }} replace />
  }

  return <>{children}</>
}
