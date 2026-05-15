import { useNavigate } from 'react-router-dom'
import { RegisterForm } from './components/RegisterForm'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWXIjX9KAk1E_1P7GpyzM6oaZQoZwlmvCQ6xF5EVTJ38IRoWWbpuqNUJknZJw4zjH1Eu7-0BRDZufztI56ZaqEQh5u3xtxWnkY2B21pkvrZn78X7atJLNAsdAcpyk2SK1afkUEY7dvIvMV3QkBx7_1SavajdGYUvZBuhdEBfbKHztDSyltBtK06-f44cqzWAvFcZK3YfsVHTLI_kvlWQ_KRre-rfBN_XD6HW3Kh_Mn0aMVz8QiYoI6_Phlkk3_vvE0oF4vZHAsEIw'

export function RegisterPage() {
  const navigate = useNavigate()

  function handleSuccess(token: string) {
    useAuthStore.setState((state) => ({
      ...state,
      accessToken: token,
      isAuthenticated: true,
    }))
    localStorage.setItem('renewsim-token', token)
    useToastStore.getState().pushToast({
      title: 'Cuenta creada',
      description: 'Tu registro fue exitoso.',
      variant: 'success',
    })
    navigate('/')
  }

  return (
    <div className="flex flex-1 justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-lg">
        {/* Hero image */}
        <div
          className="w-full aspect-[3/1.5] rounded-2xl overflow-hidden mb-8 bg-center bg-cover border border-outline-variant dark:border-white/8"
          style={{ backgroundImage: `url("${HERO_IMAGE}")` }}
          role="img"
          aria-label="Energías renovables"
        />

        <h1 className="text-3xl font-extrabold text-center text-on-surface dark:text-content-dark mb-8">
          Crea tu cuenta
        </h1>

        <RegisterForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
