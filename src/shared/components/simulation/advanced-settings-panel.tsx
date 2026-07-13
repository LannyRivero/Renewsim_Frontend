import type { ReactNode } from 'react'
import { ChevronDown, Sliders } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationActionButton } from './buttons'

export function SimulationAdvancedSettingsPanel({
  eyebrow = 'Ajustes avanzados',
  title = 'Ajustes avanzados',
  description = 'Ajustes para técnicos, pérdidas, consumo mensual y economía avanzada solo si necesitás más control.',
  icon = <Sliders className="h-4 w-4" />,
  openLabel = 'Mostrar ajustes',
  closeLabel = 'Ocultar ajustes',
  tone = 'form',
  isOpen,
  onToggle,
  children,
}: {
  eyebrow?: string
  title?: string
  description?: string
  icon?: ReactNode | null
  openLabel?: string
  closeLabel?: string
  tone?: 'form' | 'detail'
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-sm p-4',
        tone === 'detail'
          ? 'border border-[#d7dfd6] bg-white dark:border-white/10 dark:bg-[#16201d]'
          : 'border border-[#d8dee8] bg-[#f6f8fb] dark:border-white/10 dark:bg-[#15191d]',
      )}
    >
      <SimulationActionButton
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        variant="outline"
        className="h-auto w-full items-start justify-between gap-4 whitespace-normal border-transparent bg-transparent px-3 py-2.5 text-left font-normal shadow-none hover:bg-transparent"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-content-dark/55">{eyebrow}</p>
          <h3 className="mt-1.5 text-[1.1rem] font-semibold tracking-[-0.02em] text-[#16231c] dark:text-content-dark">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/60">
            {description}
          </p>
        </div>
        <span
          className={cn(
            'mt-0.5 inline-flex shrink-0 items-center gap-2 self-start rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors',
            tone === 'detail'
              ? 'border border-[#dce3de] bg-[#f7faf8] text-slate-600 shadow-[0_10px_22px_-20px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/62'
              : 'border border-[#d2d8e2] bg-white text-slate-700 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark',
          )}
        >
          {icon ? icon : null}
          {isOpen ? closeLabel : openLabel}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </SimulationActionButton>

      {isOpen ? (
        <div className={cn('mt-4 space-y-5 pt-4 dark:border-white/8', tone === 'detail' ? 'border-t border-[#e3e9e4]' : 'border-t border-[#e1e6ee]')}>
          {children}
        </div>
      ) : null}
    </div>
  )
}
