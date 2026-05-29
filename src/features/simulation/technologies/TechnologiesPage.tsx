import { Cpu } from 'lucide-react'
import { TechnologyForm } from './components/TechnologyForm'
import { TechnologiesTable } from './components/TechnologiesTable'
import { useTechnologiesManager } from './hooks/useTechnologiesManager'
import {
  ConfirmDialog,
  SimulationPageShell,
  SimulationSectionHeader,
} from '@/shared/components'

export function TechnologiesPage() {
  const {
    draft,
    setDraftField,
    technologies,
    formError,
    submitTechnology,
    createOrUpdateMutation,
    deleteMutation,
    technologyToDelete,
    requestDeleteTechnology,
    confirmDeleteTechnology,
    cancelDeleteTechnology,
    editingTechnologyId,
    startEditingTechnology,
    cancelEditingTechnology,
  } = useTechnologiesManager()

  return (
    <SimulationPageShell className="lg:h-auto lg:py-2" contentClassName="lg:overflow-visible">
      <div className="flex flex-col gap-6">
        <SimulationSectionHeader
          eyebrow="Catálogo de Tecnologías"
          eyebrowIcon={<Cpu className="h-3.5 w-3.5" fill="currentColor" />}
          title="Tecnologías"
          description="Crea y gestiona tecnologías renovables."
          className="md:items-center"
        />

        <TechnologyForm
          draft={draft}
          formError={formError}
          isSubmitting={createOrUpdateMutation.isPending}
          isEditing={Boolean(editingTechnologyId)}
          onSubmit={submitTechnology}
          onCancelEdit={cancelEditingTechnology}
          onDraftFieldChange={setDraftField}
        />

        <TechnologiesTable
          technologies={technologies}
          editingTechnologyId={editingTechnologyId}
          deletingTechnologyId={deleteMutation.isPending ? technologyToDelete?.id ?? null : null}
          onEdit={startEditingTechnology}
          onDelete={requestDeleteTechnology}
        />
      </div>

      <ConfirmDialog
        open={Boolean(technologyToDelete)}
        title="Eliminar tecnología"
        description={
          technologyToDelete
            ? `¿Estás seguro de que deseas eliminar "${technologyToDelete.name}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDeleteTechnology}
        onCancel={cancelDeleteTechnology}
      />
    </SimulationPageShell>
  )
}
