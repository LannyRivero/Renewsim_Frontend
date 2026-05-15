export function Footer() {
  return (
    <footer className="bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-subtle-light dark:text-subtle-dark">
            © 2024 RenewSim. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Términos de Servicio', href: '#' },
              { label: 'Política de Privacidad', href: '#' },
              { label: 'Contacto', href: '#' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors"
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
