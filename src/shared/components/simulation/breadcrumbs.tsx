import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function SimulationBreadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={cn('flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-content-dark/55', className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? (
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 dark:text-content-dark/40" aria-hidden="true" />
            ) : null}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="rounded-sm px-1.5 py-0.5 transition-colors hover:bg-[#eef3f7] hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-content-dark/85"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'rounded-sm px-1.5 py-0.5',
                  isLast
                    ? 'bg-[#eef3f7] text-slate-700 dark:bg-white/[0.06] dark:text-content-dark/85'
                    : 'text-slate-500 dark:text-content-dark/55',
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
