function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-1 justify-center items-center py-24">
      <div className="text-center">
        <div className="h-1 w-10 rounded-full accent-bar mx-auto mb-6" />
        <h1 className="text-2xl font-extrabold text-on-surface dark:text-content-dark">{title}</h1>
        <p className="mt-2 text-on-surface-variant dark:text-content-dark/50 text-sm">
          Próximamente disponible.
        </p>
      </div>
    </div>
  )
}

export function TecnologiasPage() {
  return <PlaceholderPage title="Tecnologías" />
}

export function ConfiguracionPage() {
  return <PlaceholderPage title="Configuración" />
}

export function AdminPage() {
  return <PlaceholderPage title="Panel Admin" />
}
