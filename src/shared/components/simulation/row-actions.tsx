import type { ReactNode } from 'react'
import { Ellipsis, Eye, PencilLine, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuickActionItem {
  icon: ReactNode
  label: string
  ariaLabel: string
  href?: string
  tone?: 'default' | 'danger'
  disabled?: boolean
  onClick?: () => void
}

interface QuickActionsMenuProps {
  triggerAriaLabel: string
  isOpen: boolean
  onToggle: () => void
  items: QuickActionItem[]
}

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

export function QuickActionsMenu({ triggerAriaLabel, isOpen, onToggle, items }: QuickActionsMenuProps) {
  return (
    <div className="relative shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={triggerAriaLabel}
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`rounded-sm border border-transparent text-[#55695e] transition-colors hover:border-[#d8e0d7] hover:bg-[#f3f6f2] dark:text-content-dark/65 dark:hover:border-white/10 dark:hover:bg-white/[0.04] ${
          isOpen ? 'border-[#d8e0d7] bg-[#f3f6f2] dark:border-white/10 dark:bg-white/[0.04]' : ''
        }`}
      >
        <Ellipsis className="h-4 w-4" />
      </Button>

      {isOpen ? (
        <div className="absolute right-0 bottom-10 z-20 min-w-[190px] overflow-hidden rounded-md border border-[#dce3db] bg-white shadow-[0_18px_38px_-24px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-[#16201d]">
          <div className="p-1.5">
            {items.map((item) => (
              item.href ? (
                <Link
                  key={item.ariaLabel}
                  to={item.href}
                  aria-label={item.ariaLabel}
                  onClick={item.onClick}
                  className={cn(
                    'flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium',
                    item.tone === 'danger'
                      ? 'text-[#bb4455] hover:bg-[#fdf1f3] hover:text-[#bb4455] dark:text-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-300'
                      : 'text-[#385247] hover:bg-[#f4f7f3] dark:text-content-dark dark:hover:bg-white/[0.04]',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <Button
                  key={item.ariaLabel}
                  type="button"
                  variant="ghost"
                  aria-label={item.ariaLabel}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={cn(
                    'h-auto w-full justify-start rounded-sm px-3 py-2 text-sm font-medium',
                    item.tone === 'danger'
                      ? 'text-[#bb4455] hover:bg-[#fdf1f3] hover:text-[#bb4455] dark:text-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-300'
                      : 'text-[#385247] hover:bg-[#f4f7f3] dark:text-content-dark dark:hover:bg-white/[0.04]',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Button>
              )
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
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
    <QuickActionsMenu
      triggerAriaLabel={`Acciones de simulación ${subjectLabel}`}
      isOpen={isOpen}
      onToggle={onToggle}
      items={[
        {
          icon: <Eye className="h-4 w-4" />,
          label: 'Ver detalles',
          ariaLabel: `Ver simulación ${subjectLabel}`,
          href: detailsTo,
          onClick: onClose,
        },
        {
          icon: <PencilLine className="h-4 w-4" />,
          label: 'Editar',
          ariaLabel: `Editar simulación ${subjectLabel}`,
          href: editTo,
          onClick: onClose,
        },
        {
          icon: <Trash2 className="h-4 w-4" />,
          label: 'Eliminar',
          ariaLabel: `Eliminar simulación ${subjectLabel}`,
          tone: 'danger',
          disabled: isDeleting,
          onClick: onDelete,
        },
      ]}
    />
  )
}
