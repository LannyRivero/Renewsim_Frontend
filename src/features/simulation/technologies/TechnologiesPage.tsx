import { Plus } from 'lucide-react'
import { TechnologyForm } from './components/TechnologyForm'
import { TechnologiesTable } from './components/TechnologiesTable'
import { useTechnologiesManager } from './hooks/useTechnologiesManager'
import {
  SimulationActionButton,
  ConfirmDialog,
  SimulationFiltersToolbar,
  SimulationPageShell,
  SimulationStateMessage,
  SimulationSectionHeader,
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
    <SimulationPageShell contentClassName="px-2.5 pt-4 pb-0 sm:px-2.5 sm:pt-4 sm:pb-0 lg:h-full lg:px-2.5 lg:pt-4 lg:pb-0">
      <div className="flex flex-col  lg:h-full">

        <SimulationSectionHeader
          eyebrow="Technology Catalog"
          description="Manage your technology catalog and configure project-specific parameters."
          className="md:items-center"
        />

        <div className="mt-7 w-full flex justify-end">
          <SimulationActionButton type="button" variant="primary" onClick={openCreateTechnologyForm} className="rounded-full px-2.5 py-2 shadow-[0_14px_26px_-20px_rgba(13,90,55,0.28)]">
            <Plus className="h-4 w-4" />
            Nueva tecnología
          </SimulationActionButton>
        </div>

        < div className=' mt-5 space-y-3'>

          {!isFormOpen ? (
            <div >
              <SimulationFiltersToolbar
                searchId="technology-filter-search"
                searchLabel="Buscar tecnología"
                searchValue={searchTerm}
                searchPlaceholder="Escribí un nombre para filtrar"
                onSearchChange={setTechnologySearchTerm}
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
            </div>
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
            <div>
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
            </div>
          ) : null}
        </div>
        {isLoading ? <SimulationStateMessage className="text-[#5e7063]">Cargando tecnologías...</SimulationStateMessage> : null}

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
