export function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-background-dark border-t border-outline-variant dark:border-white/8">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-on-surface-variant dark:text-content-dark/40">
            © 2024 RenewSim. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Terminos del servicio', href: '#' },
              { label: 'Privacidad', href: '#' },
              { label: 'Contacto', href: '#' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-on-surface-variant dark:text-content-dark/40 hover:text-on-surface dark:hover:text-content-dark transition-colors"
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
