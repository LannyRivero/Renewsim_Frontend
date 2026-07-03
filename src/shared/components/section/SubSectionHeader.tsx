import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SubSectionHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h4 className={cn('text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60', className)}>
      {children}
    </h4>
  )
}
