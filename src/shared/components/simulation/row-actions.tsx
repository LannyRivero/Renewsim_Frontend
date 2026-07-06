import { Ellipsis, Eye, PencilLine, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface SimulationRowActionsMenuProps {
  subjectLabel: string
  detailsTo: string
  editTo: string
  isOpen: boolean
  isDeleting: boolean
  onToggle: () => void
  onClose: () => void
  onDelete: () => void
}

export function SimulationRowActionsMenu({
  subjectLabel,
  detailsTo,
  editTo,
  isOpen,
  isDeleting,
  onToggle,
  onClose,
  onDelete,
}: SimulationRowActionsMenuProps) {
  return (
    <div className="relative shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Acciones de simulación ${subjectLabel}`}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="rounded-sm text-[#55695e] hover:bg-[#f3f6f2] dark:text-content-dark/65 dark:hover:bg-white/[0.04]"
      >
        <Ellipsis className="h-4 w-4" />
      </Button>

      {isOpen ? (
        <div className="absolute right-0 top-10 z-20 min-w-[160px] rounded-sm border border-[#dce3db] bg-white p-1 shadow-[0_16px_32px_-24px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-[#16201d]">
          <Link
            to={detailsTo}
            aria-label={`Ver simulación ${subjectLabel}`}
            onClick={onClose}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#385247] transition-colors hover:bg-[#f4f7f3] dark:text-content-dark dark:hover:bg-white/[0.04]"
          >
            <Eye className="h-4 w-4" />
            Ver detalles
          </Link>
          <Link
            to={editTo}
            aria-label={`Editar simulación ${subjectLabel}`}
            onClick={onClose}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#385247] transition-colors hover:bg-[#f4f7f3] dark:text-content-dark dark:hover:bg-white/[0.04]"
          >
            <PencilLine className="h-4 w-4" />
            Editar
          </Link>
          <Button
            type="button"
            variant="ghost"
            aria-label={`Eliminar simulación ${subjectLabel}`}
            onClick={onDelete}
            disabled={isDeleting}
            className="h-auto w-full justify-start rounded-sm px-3 py-2 text-sm text-[#bb4455] hover:bg-[#fdf1f3] hover:text-[#bb4455] dark:text-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      ) : null}
    </div>
  )
}
