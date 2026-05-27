import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { hasRole, readRoles } from '@/shared/utils/authToken'

interface RequireRoleProps {
  role: string
  children: React.ReactNode
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken) ?? localStorage.getItem('renewsim-token')
  const user = useAuthStore((state) => state.user)
  const roles = user?.roles?.length ? user.roles : readRoles(accessToken)

  if (!hasRole(roles, role)) {
    return <Navigate to="/simulador" state={{ from: location }} replace />
  }

  return <>{children}</>
}
