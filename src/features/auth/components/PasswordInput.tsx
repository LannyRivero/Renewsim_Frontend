import { useState } from 'react'

interface PasswordInputProps {
  id: string
  label?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  errors?: string[]
}

export function PasswordInput({
  id,
  label = 'Contraseña',
  value,
  onChange,
  placeholder = 'Ingresa tu contraseña',
  errors = [],
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#526559] dark:text-content-dark/72" htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-12 w-full rounded-sm border bg-[#f7faf6] px-4 pr-12 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-white/[0.04] dark:text-content-dark dark:placeholder:text-content-dark/36 ${
            errors.length > 0
              ? 'border-[#d7b8b8] focus:border-[#cb9090] focus:ring-[#ecd1d1] dark:border-[#6c3434] dark:focus:border-[#925151] dark:focus:ring-[#452525]'
              : 'border-[#ced8cd] focus:border-[#97b19f] focus:ring-[#c7d5cb] dark:border-white/10 dark:focus:border-white/16 dark:focus:ring-white/10'
          }`}
        />
        <button
          type="button"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 dark:text-content-dark/45 dark:hover:text-content-dark"
        >
          <span className="material-symbols-outlined text-xl">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1">
          {errors.map((err) => (
            <li key={err} className="flex items-center gap-1 text-xs text-[#8f2f2f] dark:text-[#f2b8b8]">
              <span className="material-symbols-outlined text-sm">error</span>
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
