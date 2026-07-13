interface FooterProps {
  variant?: 'default' | 'home-console'
}

export function Footer({ variant = 'default' }: FooterProps) {
  return (
    <footer
      className={
        variant === 'home-console'
          ? 'border-t border-[#d7dfd6] bg-[#f4f7f2] dark:border-white/8 dark:bg-[#0c1511]'
          : 'bg-surface-container-lowest border-t border-outline-variant dark:border-white/8 dark:bg-background-dark'
      }
    >
      <div className={variant === 'home-console' ? 'mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-5' : 'container mx-auto px-6 py-8'}>
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className={variant === 'home-console' ? 'text-xs text-[#67796d] dark:text-content-dark/40' : 'text-sm text-on-surface-variant dark:text-content-dark/40'}>
            © 2024 RenewSim. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Términos del servicio', href: '#' },
              { label: 'Privacidad', href: '#' },
              { label: 'Contacto', href: '#' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={
                  variant === 'home-console'
                    ? 'text-xs text-[#67796d] transition-colors hover:text-[#1b2a22] dark:text-content-dark/40 dark:hover:text-content-dark'
                    : 'text-sm text-on-surface-variant transition-colors hover:text-on-surface dark:text-content-dark/40 dark:hover:text-content-dark'
                }
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
