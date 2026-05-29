import { ConfirmDialog } from '@/shared/components'

interface AdminDeleteDialogProps {
  userToDelete: { id: string; username: string } | null
  isDeletePending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function AdminDeleteDialog({
  userToDelete,
  isDeletePending,
  onConfirm,
  onCancel,
}: AdminDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(userToDelete)}
      title="Delete user"
      description={
        userToDelete
          ? `Are you sure you want to delete "${userToDelete.username}"? This action cannot be undone.`
          : ''
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      danger
      isLoading={isDeletePending}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
