import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export function SimulationTableContainer({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111d18]',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationTable({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  return <table className={cn('w-full text-left text-sm', className)} {...props} />
}

export function SimulationTableHeaderRow({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return (
    <tr
      className={cn(
        'border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/10',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationTableHeadCell({ className, ...props }: ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationTableBodyRow({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return <tr className={cn('border-b border-slate-100 dark:border-white/10', className)} {...props} />
}

export function SimulationTableCell({ className, ...props }: ComponentPropsWithoutRef<'td'>) {
  return <td className={cn('px-4 py-3 text-slate-700 dark:text-content-dark/85', className)} {...props} />
}
