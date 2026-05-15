import { useNavigate } from 'react-router-dom'

export function useSimulatorNav() {
  const navigate = useNavigate()

  return function goToSimulator() {
    const token = localStorage.getItem('renewsim-token')
    if (token) {
      navigate('/simulador')
    } else {
      navigate('/iniciar-sesion', { state: { from: '/simulador' } })
    }
  }
}
