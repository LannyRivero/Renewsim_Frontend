import { useEffect, useState } from 'react'
import { Cpu, Plus } from 'lucide-react'
import { TechnologyForm } from './components/TechnologyForm'
import { TechnologiesTable } from './components/TechnologiesTable'
import { useTechnologiesManager } from './hooks/useTechnologiesManager'
import {
  SimulationActionButton,
  ConfirmDialog,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'

export function TechnologiesPage() {
  const {
    draft,
    setDraftField,
    technologies,
    isLoading,
    isError,
    error,
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

  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (createOrUpdateMutation.isSuccess) {
      setIsFormOpen(false)
    }
  }, [createOrUpdateMutation.isSuccess])

  function handleCreateTechnology() {
    cancelEditingTechnology()
    setIsFormOpen(true)
  }

  function handleEditTechnology(...args: Parameters<typeof startEditingTechnology>) {
    startEditingTechnology(...args)
    setIsFormOpen(true)
  }

  function handleCancelForm() {
    cancelEditingTechnology()
    setIsFormOpen(false)
  }

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

        <div className="flex items-center justify-end">
          <SimulationActionButton type="button" onClick={handleCreateTechnology}>
            <Plus className="h-4 w-4" />
            Nueva tecnología
          </SimulationActionButton>
        </div>

        {isFormOpen ? (
          <TechnologyForm
            draft={draft}
            formError={formError}
            isSubmitting={createOrUpdateMutation.isPending}
            isEditing={Boolean(editingTechnologyId)}
            onSubmit={submitTechnology}
            onCancelEdit={handleCancelForm}
            onDraftFieldChange={setDraftField}
          />
        ) : null}

        <TechnologiesTable
          technologies={technologies}
          editingTechnologyId={editingTechnologyId}
          deletingTechnologyId={deleteMutation.isPending ? technologyToDelete?.id ?? null : null}
          onEdit={handleEditTechnology}
          onDelete={requestDeleteTechnology}
        />

        {isLoading ? <SimulationStateMessage>Cargando tecnologías...</SimulationStateMessage> : null}

        {isError ? (
          <SimulationStateMessage tone="error">
            {error instanceof Error ? error.message : 'No se pudieron cargar las tecnologías.'}
          </SimulationStateMessage>
        ) : null}
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
