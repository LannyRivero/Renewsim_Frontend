import { useEffect, useState } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [shouldRender, setShouldRender] = useState(open)
  const [isVisible, setIsVisible] = useState(open)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      const frame = window.requestAnimationFrame(() => {
        setIsVisible(true)
      })
      return () => window.cancelAnimationFrame(frame)
    }

    setIsVisible(false)
    const timeout = window.setTimeout(() => {
      setShouldRender(false)
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [open])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-150 dark:bg-black/65 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className={`relative w-full max-w-lg rounded-md border border-slate-200 bg-white p-4 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] transition-all duration-150 dark:border-white/12 dark:bg-[#111d18] ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-[0.985] opacity-0'
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/65">Confirmation</p>
        <h2 id="confirm-dialog-title" className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-content-dark">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-content-dark/75">{description}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/15 dark:text-content-dark dark:hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`rounded-sm px-4 py-2 text-sm font-bold transition disabled:opacity-60 ${
              danger
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
            }`}
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
