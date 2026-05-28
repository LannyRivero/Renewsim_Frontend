import { useUiStore } from '@/stores/uiStore'

export function LocaleSwitcher() {
  const locale = useUiStore((state) => state.locale)
  const setLocale = useUiStore((state) => state.setLocale)

  return (
    <label className="inline-flex items-center gap-2 text-sm text-on-surface-variant dark:text-content-dark/70">
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        value={locale}
        onChange={(event) => setLocale(event.target.value as 'es' | 'en')}
        className="rounded-lg border border-outline-variant dark:border-white/10 bg-surface dark:bg-surface-dark px-2 py-1 text-sm text-on-surface dark:text-content-dark"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </label>
  )
}
