import { SimulationRowActionsMenu } from '@/shared/components'
import type { SimulationHistoryItem } from '@/shared/types'

interface SimulationHistoryRowActionsProps {
  row: SimulationHistoryItem
  isOpen: boolean
  isDeleting: boolean
  onToggle: () => void
  onClose: () => void
  onDelete: (simulationId: string) => void
}

export function SimulationHistoryRowActions({
  row,
  isOpen,
  isDeleting,
  onToggle,
  onClose,
  onDelete,
}: SimulationHistoryRowActionsProps) {
  return (
    <SimulationRowActionsMenu
      subjectLabel={row.energyType}
      detailsTo={`/simulador/detalles?id=${encodeURIComponent(row.id)}`}
      editTo={`/simulador/editar?id=${encodeURIComponent(row.id)}`}
      isOpen={isOpen}
      isDeleting={isDeleting}
      onToggle={onToggle}
      onClose={onClose}
      onDelete={() => {
        onClose()
        onDelete(row.id)
      }}
    />
  )
}
