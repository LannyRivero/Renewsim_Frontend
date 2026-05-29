import { Edit3, Trash2 } from 'lucide-react'
import {
  SimulationCard,
  SimulationTable,
  SimulationTableBodyRow,
  SimulationTableCell,
  SimulationTableContainer,
  SimulationTableHeadCell,
  SimulationTableHeaderRow,
} from '@/shared/components'
import type { TechnologyItem } from '@/shared/types'

interface TechnologiesTableProps {
  technologies: TechnologyItem[]
  editingTechnologyId: string | null
  deletingTechnologyId: string | null
  onEdit: (technology: TechnologyItem) => void
  onDelete: (technologyId: string, technologyName: string) => void
}

export function TechnologiesTable({
  technologies,
  editingTechnologyId,
  deletingTechnologyId,
  onEdit,
  onDelete,
}: TechnologiesTableProps) {
  return (
    <SimulationCard density="comfortable">
      <h2 className="text-xl font-bold text-on-surface dark:text-content-dark">Tecnologías Registradas</h2>
      <SimulationTableContainer className="mt-4">
        <SimulationTable>
          <thead>
            <SimulationTableHeaderRow>
              <SimulationTableHeadCell>Nombre</SimulationTableHeadCell>
              <SimulationTableHeadCell>Tipo</SimulationTableHeadCell>
              <SimulationTableHeadCell>Eficiencia</SimulationTableHeadCell>
              <SimulationTableHeadCell>Reducción de CO2</SimulationTableHeadCell>
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
    </SimulationCard>
  )
}
