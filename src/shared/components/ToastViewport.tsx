import { useToastStore, type ToastItem } from '@/stores/toastStore'

const VARIANT_STYLES: Record<ToastItem['variant'], string> = {
  success: 'border-green-300 bg-green-50 text-green-900 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-200',
  error: 'border-red-300 bg-red-50 text-red-900 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200',
  info: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200',
  warning:
    'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200',
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <article
          key={toast.id}
          role="status"
          className={`pointer-events-auto rounded-xl border p-4 shadow-lg ${VARIANT_STYLES[toast.variant]}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-xs opacity-90">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              aria-label="Close notification"
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              X
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
