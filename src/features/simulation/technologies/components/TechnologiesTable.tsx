import { ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react'
import type { TechnologySortBy, TechnologySortDirection } from '../services/technologyService'
import {
  SimulationCard,
  SimulationTable,
  SimulationTableBodyRow,
  SimulationTableCell,
  SimulationTableContainer,
  SimulationTableHeadCell,
  SimulationTableHeaderRow,
  SimulationPagination,
} from '@/shared/components'
import type { TechnologyItem } from '@/shared/types'

interface TechnologiesTableProps {
  technologies: TechnologyItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  editingTechnologyId: string | null
  deletingTechnologyId: string | null
  sortBy: TechnologySortBy
  sortDirection: TechnologySortDirection
  isUpdating: boolean
  onEdit: (technology: TechnologyItem) => void
  onDelete: (technologyId: string, technologyName: string) => void
  onSortChange: (sortBy: TechnologySortBy) => void
  onPrevPage: () => void
  onNextPage: () => void
}

export function TechnologiesTable({
  technologies,
  page,
  size,
  totalElements,
  totalPages,
  editingTechnologyId,
  deletingTechnologyId,
  sortBy,
  sortDirection,
  isUpdating,
  onEdit,
  onDelete,
  onSortChange,
  onPrevPage,
  onNextPage,
}: TechnologiesTableProps) {
  const showingFrom = technologies.length === 0 ? 0 : page * size + 1
  const showingTo = page * size + technologies.length

  function renderSortButton(label: string, field: TechnologySortBy) {
    const isActive = sortBy === field

    return (
      <button
        type="button"
        onClick={() => onSortChange(field)}
        disabled={isUpdating}
        className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 dark:text-content-dark dark:hover:text-white"
      >
        <span>{label}</span>
        <span className="flex flex-col leading-none">
          <ChevronUp
            className={`h-3 w-3 ${isActive && sortDirection === 'asc' ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-content-dark/35'}`}
          />
          <ChevronDown
            className={`-mt-1 h-3 w-3 ${isActive && sortDirection === 'desc' ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-content-dark/35'}`}
          />
        </span>
      </button>
    )
  }

  return (
    <SimulationCard density="comfortable">
      <h2 className="text-xl font-bold text-on-surface dark:text-content-dark">Tecnologías Registradas</h2>
      <SimulationTableContainer className="mt-4">
        <SimulationTable>
          <thead>
            <SimulationTableHeaderRow>
              <SimulationTableHeadCell aria-sort={sortBy === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                {renderSortButton('Nombre', 'name')}
              </SimulationTableHeadCell>
              <SimulationTableHeadCell aria-sort={sortBy === 'energyType' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>{renderSortButton('Tipo', 'energyType')}</SimulationTableHeadCell>
              <SimulationTableHeadCell aria-sort={sortBy === 'efficiency' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>{renderSortButton('Eficiencia', 'efficiency')}</SimulationTableHeadCell>
              <SimulationTableHeadCell aria-sort={sortBy === 'co2Reduction' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>{renderSortButton('Reducción de CO2', 'co2Reduction')}</SimulationTableHeadCell>
              <SimulationTableHeadCell>Acciones</SimulationTableHeadCell>
            </SimulationTableHeaderRow>
          </thead>
          <tbody>
            {technologies.map((tech) => (
              <SimulationTableBodyRow key={tech.id}>
                <SimulationTableCell className="font-semibold text-slate-900 dark:text-content-dark">{tech.name}</SimulationTableCell>
                <SimulationTableCell>{tech.energyType}</SimulationTableCell>
                <SimulationTableCell>{Math.round(tech.efficiency * 100) / 100}</SimulationTableCell>
                <SimulationTableCell>{tech.co2Reduction}</SimulationTableCell>
                <SimulationTableCell>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(tech)}
                      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-content-dark dark:hover:bg-white/10"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      {editingTechnologyId === tech.id ? 'Editando' : 'Editar'}
                    </button>
                    <button
                      type="button"
                      disabled={deletingTechnologyId === tech.id}
                      onClick={() => onDelete(tech.id, tech.name)}
                      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingTechnologyId === tech.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </SimulationTableCell>
              </SimulationTableBodyRow>
            ))}
          </tbody>
        </SimulationTable>
      </SimulationTableContainer>
      <SimulationPagination
        summaryLabel={`Mostrando ${showingFrom}-${showingTo} de ${totalElements} tecnologías`}
        pageLabel={`Página ${page + 1} de ${totalPages}`}
        prevLabel="Anterior"
        nextLabel="Siguiente"
        onPrev={onPrevPage}
        onNext={onNextPage}
        isPrevDisabled={isUpdating || page === 0}
        isNextDisabled={isUpdating || page + 1 >= totalPages}
      />
    </SimulationCard>
  )
}
