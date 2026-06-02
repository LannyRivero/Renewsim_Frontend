import { useAdminUsersData } from './hooks/useAdminUsersData'
import { useAdminUsersTableState } from './hooks/useAdminUsersTableState'
import { AdminDeleteDialog } from './components/AdminDeleteDialog'
import { AdminFiltersToolbar } from './components/AdminFiltersToolbar'
import { AdminHeader } from './components/AdminHeader'
import { AdminPagination } from './components/AdminPagination'
import { AdminStatsCards } from './components/AdminStatsCards'
import { AdminUsersTable } from './components/AdminUsersTable'
import {
  SimulationCard,
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
        <div className="flex flex-col gap-6">
        <AdminHeader isFetching={isFetching} onRefresh={() => refetch()} />

        <AdminStatsCards
          usersCount={users.length}
          adminUsersCount={adminUsersCount}
          activeRoleCount={activeRoleCount}
          filteredUsersCount={filteredUsers.length}
        />

        {isLoading ? <SimulationStateMessage>Loading users...</SimulationStateMessage> : null}

        {isError ? <SimulationStateMessage tone="error">{error instanceof Error ? error.message : 'Could not load users.'}</SimulationStateMessage> : null}

        <AdminFiltersToolbar
          search={search}
          roleFilter={roleFilter}
          allRoles={allRoles}
          onSearchChange={handleSearchChange}
          onRoleFilterChange={handleRoleFilterChange}
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
      </div>

      <AdminDeleteDialog
        userToDelete={userToDelete}
        isDeletePending={isDeletePending}
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </SimulationPageShell>
  )
}
