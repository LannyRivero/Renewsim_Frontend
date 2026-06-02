import { RefreshCcw, Shield } from 'lucide-react'
import { SimulationActionButton, SimulationSectionHeader } from '@/shared/components'

interface AdminHeaderProps {
  isFetching: boolean
  onRefresh: () => void
}

export function AdminHeader({ isFetching, onRefresh }: AdminHeaderProps) {
  return (
    <SimulationSectionHeader
      eyebrow="Admin Workspace"
      eyebrowIcon={<Shield className="h-3.5 w-3.5" />}
      title="Admin Panel"
      description="Manage users and roles."
      className="md:items-center"
      actions={
        <SimulationActionButton type="button" variant="outline" onClick={onRefresh} disabled={isFetching}>
          <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Refreshing...' : 'Refresh users'}
        </SimulationActionButton>
      }
    />
  )
}
