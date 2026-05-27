import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Loader2, RefreshCcw, Shield, Trash2, UserCheck, Users } from 'lucide-react'
import { deleteUser, getAllUsers, updateUserRoles } from './services/userService'
import { useToastStore } from '@/stores/toastStore'
import { ConfirmDialog } from '@/shared/components'

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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-xl border border-black/10 bg-white p-8 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[#0f1a16]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-slate-200/50 blur-3xl dark:bg-white/5" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10" />

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/15 dark:bg-white/10 dark:text-content-dark/75">
                <Shield className="h-3.5 w-3.5" />
                Admin Workspace
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-content-dark">Admin Panel</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-content-dark/65">Manage users and roles.</p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60 dark:border-white/15 dark:bg-white/10 dark:text-content-dark dark:hover:bg-white/20"
            >
              <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh users'}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Total users</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">
                <Users className="h-5 w-5 text-primary" />
                {users.length}
              </p>
            </article>
            <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Admin users</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">
                <UserCheck className="h-5 w-5 text-teal-500" />
                {adminUsersCount}
              </p>
            </article>
            <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Active roles</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">{activeRoleCount}</p>
            </article>
            <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Records shown</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">{filteredUsers.length}</p>
            </article>
          </div>

          {isLoading ? (
            <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Loading users...</p>
          ) : null}

          {isError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : 'Could not load users.'}
            </p>
          ) : null}

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-md border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#15241e]">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by username"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:placeholder:text-content-dark/45"
              />
            </div>
            <div className="rounded-md border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#15241e]">
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
            </div>
          </div>

          <div className="rounded-md border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#15241e]">
            <div className="overflow-x-auto rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111d18]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/10">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Username</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Current Roles</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Edit Roles</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => {
                    const editableRoles = Array.from(new Set(['USER', 'ADMIN', ...allRoles, ...user.roles]))
                    const draftRoles = getDraftRoles(user.id, user.roles)

                    return (
                      <tr key={user.id} className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/10">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-content-dark">{user.username}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {(user.roles.length ? user.roles : ['NONE']).map((role) => (
                              <span
                                key={`${user.id}-current-${role}`}
                                className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-white/15 dark:bg-white/15 dark:text-content-dark"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-3">
                            {editableRoles.map((role) => {
                              const checkboxId = `user-${user.id}-role-${role}`
                              const isChecked = draftRoles.includes(role)

                              return (
                                <label key={role} htmlFor={checkboxId} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-content-dark">
                                  <input
                                    id={checkboxId}
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(event) => toggleRole(user.id, user.roles, role, event.target.checked)}
                                    className="h-4 w-4 rounded border-outline-variant"
                                  />
                                  <span>{role}</span>
                                </label>
                              )
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1 divide-x divide-slate-200 dark:divide-white/10">
                            <button
                              type="button"
                              onClick={() =>
                                updateRolesMutation.mutate({ userId: user.id, roles: draftRoles })
                              }
                              disabled={savingUserId === user.id}
                              className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                            >
                              {savingUserId === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                              {savingUserId === user.id ? 'Saving...' : 'Save Roles'}
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDeleteUser(user.id, user.username)}
                              disabled={deleteUserMutation.isPending && userToDelete?.id === user.id}
                              className="ml-1 inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-500/10"
                            >
                              {deleteUserMutation.isPending && userToDelete?.id === user.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              {deleteUserMutation.isPending && userToDelete?.id === user.id ? 'Deleting...' : 'Delete User'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-md border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#15241e] dark:text-content-dark/75 md:flex-row md:items-center md:justify-between">
            <span>
              Showing {showingFrom}-{showingTo} of {filteredUsers.length} users
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-sm border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-sm border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  )
}
