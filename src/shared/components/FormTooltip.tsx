import type { ReactNode } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'
import { HelpCircle } from 'lucide-react'

interface FormTooltipProps {
  content: ReactNode
}

export function FormTooltip({ content }: FormTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        className="ml-1 inline-flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        aria-label="Mas información"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup className="z-50 max-w-xs rounded-md border border-black/10 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 shadow-lg dark:border-white/10 dark:bg-[#1a2e26] dark:text-slate-300">
            {content}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
