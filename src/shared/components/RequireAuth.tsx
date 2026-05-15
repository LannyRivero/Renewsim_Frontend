import { Navigate, useLocation } from 'react-router-dom'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  const token = localStorage.getItem('renewsim-token')

  if (!token) {
    return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />
  }

  return <>{children}</>
}
