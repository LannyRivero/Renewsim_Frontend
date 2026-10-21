import { useState } from 'react'
import { Clock3, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  SimulationActionButton,
  SimulationPageContent,
  SimulationPageHeader,
  SimulationPageShell,
} from '@/shared/components'
import type { BreadcrumbItem } from '@/shared/components'
import { SimulationHistoryTable } from './SimulationHistoryTable'
import { SimulationHistoryFilters } from './components/SimulationHistoryFilters'
import { SimulationHistoryDeleteDialog } from './components/SimulationHistoryDeleteDialog'
import { SimulationHistoryPagination } from './components/SimulationHistoryPagination'
import { useSimulationHistoryDelete } from './useSimulationHistoryDelete'
import { useSimulationHistoryViewState } from './useSimulationHistoryViewState'

export function SimulationHistoryPage() {
  const deleteMutation = useSimulationHistoryDelete()
  const {
    search,
    draftLocation,
    isLoading,
    isError,
    isFilterPanelOpen,
    sortField,
    sortDirection,
    rows,
    paginatedRows,
    safeCurrentPage,
    totalPages,
    setIsFilterPanelOpen,
    setCurrentPage,
    handleSearchChange,
    handleLocationChange,
    handleApplyFilters,
    handleResetFilters,
    handleSortChange,
  } = useSimulationHistoryViewState()
  const [simulationIdToDelete, setSimulationIdToDelete] = useState<string | null>(null)
  const simulationToDelete = rows.find((row) => row.id === simulationIdToDelete) ?? null

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="rounded-md px-3 pt-4 pb-4 sm:px-4 lg:h-auto lg:p-5" bodyClassName="lg:h-auto">
      <SimulationPageContent spacing="compact" className="lg:h-auto">
        <SimulationPageHeader
          items={[
            { label: 'Simulador', href: '/simulador' },
            { label: 'Historial' },
          ] satisfies BreadcrumbItem[]}
          eyebrow="Archivo de simulaciones"
          eyebrowIcon={<Clock3 className="h-3.5 w-3.5" />}
          title="Simulaciones disponibles para seguimiento"
          description="Encontrá escenarios previos, reabrí análisis puntuales y gestioná el archivo operativo sin duplicar la lectura agregada del dashboard."
          actions={
            <div className="w-full md:w-auto md:min-w-fit">
              <Link to="/simulador/nueva">
                <SimulationActionButton type="button" variant="primary" className="w-full px-3 py-1.5 text-sm md:w-auto">
                  <Plus className="h-4 w-4" />
                  Nueva simulación
                </SimulationActionButton>
              </Link>
            </div>
          }
        />

        <SimulationHistoryFilters
          search={search}
          draftLocation={draftLocation}
          isFilterPanelOpen={isFilterPanelOpen}
          onSearchChange={handleSearchChange}
          onLocationChange={handleLocationChange}
          onTogglePanel={() => setIsFilterPanelOpen((current) => !current)}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        <SimulationHistoryTable
          rows={paginatedRows}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          isLoading={isLoading}
          isError={isError}
          isDeleting={deleteMutation.isPending}
          onDelete={(simulationId) => setSimulationIdToDelete(simulationId)}
        />

        <SimulationHistoryPagination
          safeCurrentPage={safeCurrentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          onPageSelect={(page) => setCurrentPage(page)}
        />

        <SimulationHistoryDeleteDialog
          simulationToDelete={simulationToDelete}
          isDeleting={deleteMutation.isPending}
          onConfirm={() => {
            if (!simulationIdToDelete) return

            deleteMutation.mutate(simulationIdToDelete, {
              onSettled: () => setSimulationIdToDelete(null),
            })
          }}
          onCancel={() => {
            if (deleteMutation.isPending) return
            setSimulationIdToDelete(null)
          }}
        />
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
