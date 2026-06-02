import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

interface SimulationActionButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'outline' | 'soft'
}

export function SimulationActionButton({ className, variant = 'outline', ...props }: SimulationActionButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-60',
        variant === 'outline'
          ? 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-white/15 dark:bg-white/10 dark:text-content-dark dark:hover:bg-white/20'
          : 'border border-black/10 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:bg-white/10 dark:text-content-dark dark:hover:bg-white/20',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationTextInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:placeholder:text-content-dark/45',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationSelect({ className, ...props }: ComponentPropsWithoutRef<'select'>) {
  return (
    <select
      className={cn(
        'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationReadonlyInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      readOnly
      className={cn(
        'w-full h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-content-dark/70 cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}
