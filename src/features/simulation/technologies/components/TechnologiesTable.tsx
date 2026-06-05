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

  const energyTypeTone: Record<string, string> = {
    SOLAR: 'bg-[#eef7e9] text-[#58744d] border-[#d7e7cd]',
    WIND: 'bg-[#edf4f7] text-[#4e6974] border-[#cfdee6]',
    HYDRO: 'bg-[#edf2fa] text-[#51667f] border-[#d3dcef]',
  }

  function renderSortButton(label: string, field: TechnologySortBy) {
    const isActive = sortBy === field

    return (
      <button
        type="button"
        onClick={() => onSortChange(field)}
        disabled={isUpdating}
        className="inline-flex items-center gap-2 font-semibold text-[#486053] hover:text-[#193126] dark:text-content-dark dark:hover:text-white"
      >
        <span>{label}</span>
        <span className="flex flex-col leading-none">
          <ChevronUp
            className={`h-3 w-3 ${isActive && sortDirection === 'asc' ? 'text-[#193126] dark:text-white' : 'text-[#b7c4b7] dark:text-content-dark/35'}`}
          />
          <ChevronDown
            className={`-mt-1 h-3 w-3 ${isActive && sortDirection === 'desc' ? 'text-[#193126] dark:text-white' : 'text-[#b7c4b7] dark:text-content-dark/35'}`}
          />
        </span>
      </button>
    )
  }

  return (
    <SimulationCard density="comfortable" className="pt-3 pb-3">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[1.55rem] font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">Tecnologías Registradas</h2>
        <div className="rounded-full border border-[#d5ddd3] bg-[#f4f7f3] px-3 py-1 text-xs font-semibold text-[#587063] dark:border-white/10 dark:bg-white/5 dark:text-content-dark/75">
          {totalElements} registros
        </div>
      </div>
      <SimulationTableContainer className="mt-1.5">
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
              <SimulationTableBodyRow key={tech.id} className="transition-colors hover:bg-[#f5f8f4] dark:hover:bg-white/[0.035]">
                <SimulationTableCell className="font-semibold text-[#274034] dark:text-content-dark">{tech.name}</SimulationTableCell>
                <SimulationTableCell>
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${energyTypeTone[tech.energyType] ?? 'bg-[#eef2ef] text-[#587063] border-[#d7dfd6]'}`}>
                    {tech.energyType}
                  </span>
                </SimulationTableCell>
                <SimulationTableCell className="font-semibold text-[#355145]">{Math.round(tech.efficiency * 100) / 100}</SimulationTableCell>
                <SimulationTableCell className="font-semibold text-[#355145]">{tech.co2Reduction}</SimulationTableCell>
                <SimulationTableCell>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(tech)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ddd3] bg-[#f5f8f4] px-3 py-1 text-xs font-semibold text-[#486053] transition-colors hover:bg-[#eaf0e8] dark:border-white/10 dark:text-content-dark dark:hover:bg-white/10"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      {editingTechnologyId === tech.id ? 'Editando' : 'Editar'}
                    </button>
                    <button
                      type="button"
                      disabled={deletingTechnologyId === tech.id}
                      onClick={() => onDelete(tech.id, tech.name)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#edd3d8] bg-[#fbf1f3] px-3 py-1 text-xs font-semibold text-[#b04756] transition-colors hover:bg-[#f7e7ea] disabled:opacity-60 dark:border-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
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
