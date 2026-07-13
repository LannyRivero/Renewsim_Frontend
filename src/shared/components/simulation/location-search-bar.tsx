import type { ReactNode } from 'react'
import { Loader2, LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SimulationLocationSearchBar({
  input,
  isResolvingBrowserLocation,
  onUseBrowserLocation,
}: {
  input: ReactNode
  isResolvingBrowserLocation: boolean
  onUseBrowserLocation: () => void
}) {
  return (
    <div className="flex h-9 w-full items-center rounded border border-[#cfd8ce] bg-[#fafcf9] pl-3.5 pr-1 text-sm shadow-[0_8px_20px_-20px_rgba(89,103,92,0.14)] transition-colors focus-within:border-[#9fb49f] focus-within:ring-4 focus-within:ring-[#dfe8de] dark:border-white/10 dark:bg-[#111d18] dark:focus-within:border-white/20 dark:focus-within:ring-white/10">
      <div className="min-w-0 flex-1">{input}</div>
      <span className="group relative">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onUseBrowserLocation}
          disabled={isResolvingBrowserLocation}
          aria-label="Usar mi ubicación"
          className="flex size-7 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-content-dark/60 dark:hover:bg-white/10 dark:hover:text-content-dark"
        >
          {isResolvingBrowserLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
        </Button>
        <span className="pointer-events-none absolute -top-8 right-0 z-10 whitespace-nowrap rounded bg-[#0d5a37] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-emerald-400 dark:text-slate-950">
          Usar mi ubicación
        </span>
      </span>
    </div>
  )
}
