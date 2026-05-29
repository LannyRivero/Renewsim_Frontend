import {
  SimulationCard,
  SimulationSelect,
  SimulationTextInput,
  SimulationToolbar,
} from '@/shared/components'

interface AdminFiltersToolbarProps {
  search: string
  roleFilter: string
  allRoles: string[]
  onSearchChange: (value: string) => void
  onRoleFilterChange: (value: string) => void
}

export function AdminFiltersToolbar({
  search,
  roleFilter,
  allRoles,
  onSearchChange,
  onRoleFilterChange,
}: AdminFiltersToolbarProps) {
  return (
    <SimulationToolbar>
      <SimulationCard density="compact">
        <SimulationTextInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by username"
        />
      </SimulationCard>
      <SimulationCard density="compact">
        <label htmlFor="admin-role-filter" className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant dark:text-content-dark/70">
          Filter by role
        </label>
        <SimulationSelect
          id="admin-role-filter"
          value={roleFilter}
          onChange={(event) => onRoleFilterChange(event.target.value)}
          className="mt-2"
        >
          <option value="ALL">ALL</option>
          {allRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </SimulationSelect>
      </SimulationCard>
    </SimulationToolbar>
  )
}
