import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SimulationPageShellProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  bodyClassName?: string
}

interface SimulationPageContentProps extends ComponentPropsWithoutRef<'div'> {
  spacing?: 'compact' | 'comfortable'
}

export function SimulationPageShell({ children, className, contentClassName, bodyClassName }: SimulationPageShellProps) {
  return (
    <div className={cn('w-full py-2 sm:py-3 lg:h-[calc(100vh-4.5rem)] lg:py-0', className)}>
      <section
        className={cn(
          'rounded-md border border-white/15 bg-white/20 backdrop-blur-xl p-5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.18)] dark:border-white/8 dark:bg-[#111917]/30 sm:p-6 lg:h-full lg:p-7',
          contentClassName,
        )}
      >
        <div className={cn('relative h-full', bodyClassName)}>{children}</div>
      </section>
    </div>
  )
}

export function SimulationPageContent({
  className,
  spacing = 'comfortable',
  ...props
}: SimulationPageContentProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-col lg:h-full',
        spacing === 'compact' ? 'gap-3' : 'gap-6',
        className,
      )}
      {...props}
    />
  )
}

interface SimulationCardProps extends ComponentPropsWithoutRef<'div'> {
  tone?: 'base' | 'soft'
  density?: 'comfortable' | 'compact'
}

export function SimulationCard({
  className,
  tone = 'base',
  density = 'comfortable',
  ...props
}: SimulationCardProps) {
  return (
    <div
      className={cn(
        'rounded-sm border shadow-[0_10px_24px_-22px_rgba(15,23,42,0.18)]',
        tone === 'base'
          ? 'border-[#d5ddd4] bg-white dark:border-white/10 dark:bg-[#16201d]'
          : 'border-[#d8dfd7] bg-[#f6f8f5] dark:border-white/10 dark:bg-white/[0.03]',
        density === 'comfortable' ? 'p-5' : 'p-4',
        className,
      )}
      {...props}
    />
  )
}

interface SimulationSectionHeaderProps {
  eyebrow?: string
  title?: string
  meta?: ReactNode
  description?: string
  actions?: ReactNode
  className?: string
  eyebrowIcon?: ReactNode
}

export function SimulationSectionHeader({
  eyebrow,
  title,
  meta,
  description,
  actions,
  className,
  eyebrowIcon,
}: SimulationSectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 border-b border-[#dde4dc] pb-3 md:flex-row md:items-end md:justify-between dark:border-white/8', className)}>
      <div>
        {eyebrow ? (
          <p className="inline-flex min-h-7 items-center gap-2 rounded-sm border border-[#bccabf] bg-[#f7f9f6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#405448] dark:border-white/12 dark:bg-white/[0.04] dark:text-content-dark/82">
            {eyebrowIcon}
            {eyebrow}
          </p>
        ) : null}
        {title ? <h1 className="mt-3 text-[1.75rem] font-bold tracking-[-0.025em] text-[#1c2a22] dark:text-content-dark lg:text-[1.95rem]">{title}</h1> : null}
        {meta ? <div className="mt-2">{meta}</div> : null}
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">{description}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  )
}

interface SimulationToolbarProps extends ComponentPropsWithoutRef<'div'> {
  columns?: 1 | 2
}

export function SimulationToolbar({ className, columns = 2, ...props }: SimulationToolbarProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 ? 'lg:grid-cols-[minmax(0,1fr)_260px]' : 'grid-cols-1',
        className,
      )}
      {...props}
    />
  )
}

export function SubSectionHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h4 className={cn('text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60', className)}>
      {children}
    </h4>
  )
}
