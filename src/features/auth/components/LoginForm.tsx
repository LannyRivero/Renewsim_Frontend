import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PasswordInput } from './PasswordInput'
import { login } from '../services/authService'

interface LoginFormProps {
  onSuccess: (token: string) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    setIsLoading(true)

    try {
      const { token } = await login({ username: email, password })
      onSuccess(token)
    } catch {
      setServerError('Credenciales incorrectas. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-on-surface dark:text-content-dark" htmlFor="login-email">
          Correo electrónico
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
          className="w-full h-14 px-4 rounded-lg text-base text-on-surface dark:text-content-dark bg-primary-container/10 dark:bg-primary-container/15 border border-outline-variant dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors placeholder:text-on-surface-variant/50 dark:placeholder:text-content-dark/40"
        />
      </div>

      {/* Password */}
      <PasswordInput
        id="login-password"
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        aria-label={isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      <p className="text-sm text-on-surface-variant dark:text-content-dark/50 text-center pt-2">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-semibold text-primary dark:text-primary-inverse hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
