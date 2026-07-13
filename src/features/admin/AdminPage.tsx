import { useAdminUsersData } from './hooks/useAdminUsersData'
import { useAdminUsersTableState } from './hooks/useAdminUsersTableState'
import { AdminDeleteDialog } from './components/AdminDeleteDialog'
import { AdminHeader } from './components/AdminHeader'
import { AdminPagination } from './components/AdminPagination'
import { AdminStatsCards } from './components/AdminStatsCards'
import { AdminUsersTable } from './components/AdminUsersTable'
import {
  SimulationCard,
  SimulationFiltersToolbar,
  SimulationPageContent,
  SimulationPageShell,
  SimulationStateMessage,
} from '@/shared/components'

export function AdminPage() {
  const {
    users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    savingUserId,
    deletingUserId,
    userToDelete,
    setUserToDelete,
    confirmDeleteUser,
    requestDeleteUser,
    saveRoles,
    isDeletePending,
  } = useAdminUsersData()

  const {
    search,
    roleFilter,
    allRoles,
    filteredUsers,
    adminUsersCount,
    activeRoleCount,
    paginatedUsers,
    showingFrom,
    showingTo,
    totalPages,
    currentPage,
    getDraftRoles,
    toggleRole,
    handleSaveRoles,
    handlePrevPage,
    handleNextPage,
    handleSearchChange,
    handleRoleFilterChange,
  } = useAdminUsersTableState({ users, onSaveRoles: saveRoles })

  return (
    <SimulationPageShell>
        <SimulationPageContent>
        <AdminHeader isFetching={isFetching} onRefresh={() => refetch()} />

        <AdminStatsCards
          usersCount={users.length}
          adminUsersCount={adminUsersCount}
          activeRoleCount={activeRoleCount}
          filteredUsersCount={filteredUsers.length}
        />

        {isLoading ? <SimulationStateMessage>Loading users...</SimulationStateMessage> : null}

        {isError ? <SimulationStateMessage tone="error">{error instanceof Error ? error.message : 'Could not load users.'}</SimulationStateMessage> : null}

        <SimulationFiltersToolbar
          searchId="admin-search"
          searchLabel="Search user"
          searchValue={search}
          searchPlaceholder="Search by username"
          onSearchChange={handleSearchChange}
          filterId="admin-role-filter"
          filterLabel="Filter by role"
          filterValue={roleFilter}
          onFilterChange={handleRoleFilterChange}
          filterOptions={[
            { value: 'ALL', label: 'ALL' },
            ...allRoles.map((role) => ({ value: role, label: role })),
          ]}
        />

        <SimulationCard density="compact">
          <AdminUsersTable
            users={paginatedUsers}
            allRoles={allRoles}
            getDraftRoles={getDraftRoles}
            onToggleRole={toggleRole}
            onSaveRoles={handleSaveRoles}
            onRequestDelete={requestDeleteUser}
            savingUserId={savingUserId}
            deletingUserId={deletingUserId}
          />
        </SimulationCard>

        <AdminPagination
          showingFrom={showingFrom}
          showingTo={showingTo}
          total={filteredUsers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      </SimulationPageContent>

      <AdminDeleteDialog
        userToDelete={userToDelete}
        isDeletePending={isDeletePending}
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </SimulationPageShell>
  )
}
