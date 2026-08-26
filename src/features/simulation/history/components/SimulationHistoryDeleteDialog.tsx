import { ConfirmDialog } from '@/shared/components'
import type { SimulationHistoryItem } from '@/shared/types'

interface SimulationHistoryDeleteDialogProps {
  simulationToDelete: SimulationHistoryItem | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function SimulationHistoryDeleteDialog({
  simulationToDelete,
  isDeleting,
  onConfirm,
  onCancel,
}: SimulationHistoryDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(simulationToDelete)}
      title="Eliminar simulación"
      description={
        simulationToDelete
          ? `¿Seguro que querés eliminar "${simulationToDelete.name}"? Esta acción no se puede deshacer.`
          : ''
      }
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      danger
      isLoading={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
