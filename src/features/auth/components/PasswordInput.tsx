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
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  errors = [],
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-on-surface dark:text-content-dark" htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-14 px-4 pr-12 rounded-lg text-base text-on-surface dark:text-content-dark bg-primary-container/10 dark:bg-primary-container/15 border focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors placeholder:text-on-surface-variant/50 dark:placeholder:text-content-dark/40 ${
            errors.length > 0
              ? 'border-error dark:border-error'
              : 'border-outline-variant dark:border-white/10'
          }`}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-content-dark/50 hover:text-on-surface dark:hover:text-content-dark transition-colors"
        >
          <span className="material-symbols-outlined text-xl">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1">
          {errors.map((err) => (
            <li key={err} className="text-xs text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
