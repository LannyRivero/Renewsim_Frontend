interface DarkModeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="p-2 rounded-lg text-content-light dark:text-content-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer"
    >
      <span className="material-symbols-outlined text-xl leading-none">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
