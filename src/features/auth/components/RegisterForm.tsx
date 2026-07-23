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
      setServerError('No se pudo crear la cuenta. Intenta nuevamente.')
      useToastStore.getState().pushToast({
        title: 'Error de registro',
        description: 'No se pudo crear la cuenta. Intenta nuevamente.',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#526559] dark:text-content-dark/72" htmlFor="reg-name">
          Nombre
        </label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          className="h-12 w-full rounded-sm border border-[#ced8cd] bg-[#f7faf6] px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#97b19f] focus:outline-none focus:ring-2 focus:ring-[#c7d5cb] dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark dark:placeholder:text-content-dark/36 dark:focus:border-white/16 dark:focus:ring-white/10"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#526559] dark:text-content-dark/72" htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@empresa.com"
          className="h-12 w-full rounded-sm border border-[#ced8cd] bg-[#f7faf6] px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#97b19f] focus:outline-none focus:ring-2 focus:ring-[#c7d5cb] dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark dark:placeholder:text-content-dark/36 dark:focus:border-white/16 dark:focus:ring-white/10"
        />
      </div>

      <PasswordInput
        id="reg-password"
        label="Contrasena"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (passwordErrors.length > 0) setPasswordErrors(validatePassword(e.target.value))
        }}
        errors={passwordErrors}
      />

      {serverError && (
        <div role="alert" className="flex items-center gap-2 rounded-sm border border-[#d7b8b8] bg-[#fff5f5] p-3 text-sm text-[#8f2f2f] dark:border-[#6c3434] dark:bg-[#2b1717] dark:text-[#f2b8b8]">
          <span className="material-symbols-outlined text-base">error</span>
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 h-12 rounded-sm bg-[#0d5a37] text-sm font-bold text-white shadow-[0_12px_24px_-18px_rgba(13,90,55,0.34)] transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-950"
        aria-label={isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      >
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="pt-1 text-center text-sm text-slate-500 dark:text-content-dark/52">
        ¿Ya tenés cuenta?{' '}
        <Link to="/iniciar-sesion" className="font-semibold text-[#1d5a3c] hover:underline dark:text-emerald-300">
          Iniciar sesión
        </Link>
      </p>
    </form>
  )
}
