import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function useSimulatorNav() {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)

  return function goToSimulator() {
    const token = accessToken ?? localStorage.getItem('renewsim-token')
    if (token) {
      navigate('/simulador')
    } else {
      navigate('/iniciar-sesion', { state: { from: '/simulador' } })
    }
  }
}
