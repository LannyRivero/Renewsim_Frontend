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
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
        tone === 'success'
          ? 'border-[#b7dfc1] bg-[#e8f6eb] text-[#2f7850] dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'border-[#d0d8cf] bg-[#e8eee7] text-[#5a6f63] dark:border-white/15 dark:bg-white/10 dark:text-content-dark/80',
        className,
      )}
    >
      {icon}
      {children}
    </div>
  )
}

interface SimulationStateMessageProps extends ComponentPropsWithoutRef<'p'> {
  tone?: 'muted' | 'error'
  children: ReactNode
}

export function SimulationStateMessage({ tone = 'muted', children, className, ...props }: SimulationStateMessageProps) {
  return (
    <p
      className={cn(
        'text-sm',
        tone === 'error' ? 'text-[#a95147] dark:text-red-400' : 'text-[#5e7063] dark:text-content-dark/70',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function SimulationModalActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex items-center justify-end gap-2', className)} {...props} />
}
