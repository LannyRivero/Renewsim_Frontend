import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PasswordInput } from './PasswordInput'
import { register } from '../services/authService'
import { validatePassword } from '../../../shared/utils/validatePassword'
import { useToastStore } from '@/stores/toastStore'

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const errors = validatePassword(password)
    setPasswordErrors(errors)
    if (errors.length > 0) return

    setIsLoading(true)
    try {
      await register({ email, password, fullName: name })
      onSuccess()
    } catch {
      setServerError('No se pudo crear la cuenta. Inténtalo de nuevo.')
      useToastStore.getState().pushToast({
        title: 'Error de registro',
        description: 'No se pudo crear la cuenta. Intentalo de nuevo.',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-on-surface dark:text-content-dark" htmlFor="reg-name">
          Nombre
        </label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingresa tu nombre"
          className="w-full h-14 px-4 rounded-lg text-base text-on-surface dark:text-content-dark bg-primary-container/10 dark:bg-primary-container/15 border border-outline-variant dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors placeholder:text-on-surface-variant/50 dark:placeholder:text-content-dark/40"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-on-surface dark:text-content-dark" htmlFor="reg-email">
          Correo electrónico
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
          className="w-full h-14 px-4 rounded-lg text-base text-on-surface dark:text-content-dark bg-primary-container/10 dark:bg-primary-container/15 border border-outline-variant dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors placeholder:text-on-surface-variant/50 dark:placeholder:text-content-dark/40"
        />
      </div>

      {/* Password */}
      <PasswordInput
        id="reg-password"
        label="Contraseña"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (passwordErrors.length > 0) setPasswordErrors(validatePassword(e.target.value))
        }}
        errors={passwordErrors}
      />

      {/* Server error */}
      {serverError && (
        <div role="alert" className="flex items-center gap-2 p-3 rounded-lg bg-error-container/20 border border-error/30 text-sm text-error">
          <span className="material-symbols-outlined text-base">error</span>
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 h-12 rounded-lg text-base font-bold bg-primary-container text-on-primary hover:brightness-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label={isLoading ? 'Registrando...' : 'Registrarse'}
      >
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </button>

      <p className="text-sm text-on-surface-variant dark:text-content-dark/50 text-center pt-2">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/iniciar-sesion" className="font-semibold text-primary dark:text-primary-inverse hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
