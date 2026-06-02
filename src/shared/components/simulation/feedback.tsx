import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SimulationStatusBadgeProps {
  children: ReactNode
  icon?: ReactNode
  tone?: 'success' | 'neutral'
  className?: string
}

export function SimulationStatusBadge({
  children,
  icon,
  tone = 'success',
  className,
}: SimulationStatusBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold',
        tone === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'border-slate-300 bg-slate-50 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-content-dark/80',
        className,
      )}
    >
      {icon}
      {children}
    </div>
  )
}

interface SimulationStateMessageProps {
  tone?: 'muted' | 'error'
  children: ReactNode
  className?: string
}

export function SimulationStateMessage({ tone = 'muted', children, className }: SimulationStateMessageProps) {
  return (
    <p
      className={cn(
        'text-sm',
        tone === 'error' ? 'text-red-600 dark:text-red-400' : 'text-on-surface-variant dark:text-content-dark/70',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function SimulationModalActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex items-center justify-end gap-2', className)} {...props} />
}
