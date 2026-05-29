import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RefreshCcw, Shield } from 'lucide-react'
import { deleteUser, getAllUsers, updateUserRoles } from './services/userService'
import { AdminPagination } from './components/AdminPagination'
import { AdminStatsCards } from './components/AdminStatsCards'
import { AdminUsersTable } from './components/AdminUsersTable'
import { useToastStore } from '@/stores/toastStore'
import {
  ConfirmDialog,
  SimulationActionButton,
  SimulationCard,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
  SimulationToolbar,
} from '@/shared/components'

export function AdminPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [roleDrafts, setRoleDrafts] = useState<Record<string, string[]>>({})
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null)
  const [savingUserId, setSavingUserId] = useState<string | null>(null)
  const usersPerPage = 10

  const { data: users = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const updateRolesMutation = useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: string[] }) => updateUserRoles(userId, roles),
    onMutate: ({ userId }) => {
      setSavingUserId(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      useToastStore.getState().pushToast({
        title: 'Roles Updated',
        description: 'User roles were updated successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Update Error',
        description: 'Could not update roles for this user.',
        variant: 'error',
      })
    },
    onSettled: () => {
      setSavingUserId(null)
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      useToastStore.getState().pushToast({
        title: 'User Deleted',
        description: 'The user was deleted successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Delete Error',
        description: 'Could not delete user.',
        variant: 'error',
      })
    },
  })

  const filteredUsers = users
    .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
    .filter((user) => roleFilter === 'ALL' || user.roles.includes(roleFilter))

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage))
  const start = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(start, start + usersPerPage)

  const allRoles = Array.from(new Set(users.flatMap((user) => user.roles))).sort()
  const adminUsersCount = users.filter((user) => user.roles.includes('ADMIN') || user.roles.includes('ROLE_ADMIN')).length
  const activeRoleCount = allRoles.length
  const showingFrom = filteredUsers.length === 0 ? 0 : start + 1
  const showingTo = Math.min(start + usersPerPage, filteredUsers.length)

  function requestDeleteUser(userId: string, username: string) {
    setUserToDelete({ id: userId, username })
  }

  function confirmDeleteUser() {
    if (!userToDelete) return
    deleteUserMutation.mutate(userToDelete.id, {
      onSettled: () => {
        setUserToDelete(null)
      },
    })
  }

  function getDraftRoles(userId: string, currentRoles: string[]): string[] {
    return roleDrafts[userId] ?? currentRoles
  }

  function toggleRole(userId: string, currentRoles: string[], role: string, checked: boolean) {
    const draftRoles = getDraftRoles(userId, currentRoles)
    const nextRoles = checked
      ? Array.from(new Set([...draftRoles, role]))
      : draftRoles.filter((draftRole) => draftRole !== role)

    setRoleDrafts((prev) => ({ ...prev, [userId]: nextRoles }))
  }

  return (
    <SimulationPageShell>
      <div className="flex flex-col gap-6">
        <SimulationSectionHeader
          eyebrow="Admin Workspace"
          eyebrowIcon={<Shield className="h-3.5 w-3.5" />}
          title="Admin Panel"
          description="Manage users and roles."
          className="md:items-center"
          actions={
            <SimulationActionButton
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh users'}
            </SimulationActionButton>
          }
        />

        <AdminStatsCards
          usersCount={users.length}
          adminUsersCount={adminUsersCount}
          activeRoleCount={activeRoleCount}
          filteredUsersCount={filteredUsers.length}
        />

          {isLoading ? <SimulationStateMessage>Loading users...</SimulationStateMessage> : null}

          {isError ? <SimulationStateMessage tone="error">{error instanceof Error ? error.message : 'Could not load users.'}</SimulationStateMessage> : null}

          <SimulationToolbar>
            <SimulationCard density="compact">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by username"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:placeholder:text-content-dark/45"
              />
            </SimulationCard>
            <SimulationCard density="compact">
              <label htmlFor="admin-role-filter" className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant dark:text-content-dark/70">
                Filter by role
              </label>
              <select
                id="admin-role-filter"
                value={roleFilter}
                onChange={(event) => {
                  setRoleFilter(event.target.value)
                  setCurrentPage(1)
                }}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark"
              >
                <option value="ALL">ALL</option>
                {allRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </SimulationCard>
          </SimulationToolbar>

        <SimulationCard density="compact">
          <AdminUsersTable
            users={paginatedUsers}
            allRoles={allRoles}
            getDraftRoles={getDraftRoles}
            onToggleRole={toggleRole}
            onSaveRoles={(userId, roles) => updateRolesMutation.mutate({ userId, roles })}
            onRequestDelete={requestDeleteUser}
            savingUserId={savingUserId}
            deletingUserId={deleteUserMutation.isPending ? userToDelete?.id ?? null : null}
          />
        </SimulationCard>

        <AdminPagination
          showingFrom={showingFrom}
          showingTo={showingTo}
          total={filteredUsers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        />
      </div>

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete user"
        description={
          userToDelete
            ? `Are you sure you want to delete "${userToDelete.username}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        isLoading={deleteUserMutation.isPending}
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </SimulationPageShell>
  )
}
