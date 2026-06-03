import { Cpu, Plus } from 'lucide-react'
import { TechnologyForm } from './components/TechnologyForm'
import { TechnologiesTable } from './components/TechnologiesTable'
import { useTechnologiesManager } from './hooks/useTechnologiesManager'
import {
  SimulationActionButton,
  ConfirmDialog,
  SimulationFiltersToolbar,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'

export function TechnologiesPage() {
  const {
    draft,
    setDraftField,
    technologies,
    isFormOpen,
    openCreateTechnologyForm,
    page,
    size,
    totalElements,
    totalPages,
    energyTypeFilter,
    setTechnologyEnergyTypeFilter,
    searchTerm,
    setTechnologySearchTerm,
    sortBy,
    sortDirection,
    setTechnologySort,
    goToPreviousPage,
    goToNextPage,
    isLoading,
    isTableUpdating,
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

  function handleEditTechnology(...args: Parameters<typeof startEditingTechnology>) {
    startEditingTechnology(...args)
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

        <div className="flex items-center justify-between gap-3">
          <div />
          <SimulationActionButton type="button" variant="primary" onClick={openCreateTechnologyForm}>
            <Plus className="h-4 w-4" />
            Nueva tecnología
          </SimulationActionButton>
        </div>

        {!isFormOpen ? (
          <SimulationFiltersToolbar
            searchId="technology-filter-search"
            searchLabel="Buscar tecnología"
            searchValue={searchTerm}
            searchPlaceholder="Escribí un nombre para filtrar"
            onSearchChange={setTechnologySearchTerm}
            searchHint="La búsqueda se activa con 3 o más letras."
            filterId="technology-filter-energy-type"
            filterLabel="Tipo de energía"
            filterValue={energyTypeFilter}
            onFilterChange={(value) => setTechnologyEnergyTypeFilter(value as 'ALL' | 'SOLAR' | 'WIND' | 'HYDRO')}
            filterOptions={[
              { value: 'ALL', label: 'Todos los tipos' },
              { value: 'SOLAR', label: 'Solar' },
              { value: 'WIND', label: 'Eólica' },
              { value: 'HYDRO', label: 'Hidro' },
            ]}
          />
        ) : null}

        {isFormOpen ? (
          <TechnologyForm
            draft={draft}
            formError={formError}
            isSubmitting={createOrUpdateMutation.isPending}
            isEditing={Boolean(editingTechnologyId)}
            onSubmit={submitTechnology}
            onCancelEdit={cancelEditingTechnology}
            onDraftFieldChange={setDraftField}
          />
        ) : null}

        {!isFormOpen ? (
          <TechnologiesTable
            technologies={technologies}
            page={page}
            size={size}
            totalElements={totalElements}
            totalPages={totalPages}
            editingTechnologyId={editingTechnologyId}
            deletingTechnologyId={deleteMutation.isPending ? technologyToDelete?.id ?? null : null}
            sortBy={sortBy}
            isUpdating={isTableUpdating}
            onEdit={handleEditTechnology}
            onDelete={requestDeleteTechnology}
            sortDirection={sortDirection}
            onSortChange={setTechnologySort}
            onPrevPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />
        ) : null}

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
