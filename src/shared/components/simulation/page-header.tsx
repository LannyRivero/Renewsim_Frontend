import type { ReactNode } from 'react'
import { SimulationBreadcrumbs, type BreadcrumbItem } from './breadcrumbs'
import { SimulationSectionHeader } from './layout'

interface SimulationPageHeaderProps {
  items: BreadcrumbItem[]
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
  eyebrowIcon?: ReactNode
  className?: string
}

export function SimulationPageHeader({
  items,
  eyebrow,
  title,
  description,
  actions,
  eyebrowIcon,
  className,
}: SimulationPageHeaderProps) {
  return (
    <>
      <SimulationBreadcrumbs className="mb-1" items={items} />
      <SimulationSectionHeader
        eyebrow={eyebrow}
        eyebrowIcon={eyebrowIcon}
        title={title}
        description={description}
        actions={actions}
        className={className ?? 'md:items-end'}
      />
    </>
  )
}
