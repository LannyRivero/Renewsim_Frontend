import { useCallback, useMemo, useState } from 'react'
import type { AdminUser } from '@/shared/types'

interface UseAdminUsersTableStateParams {
  users: AdminUser[]
  onSaveRoles: (userId: string, roles: string[]) => void
}

export function useAdminUsersTableState({ users, onSaveRoles }: UseAdminUsersTableStateParams) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [roleDrafts, setRoleDrafts] = useState<Record<string, string[]>>({})
  const usersPerPage = 10

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.toLowerCase()
    return users
      .filter((user) => user.username.toLowerCase().includes(normalizedSearch))
      .filter((user) => roleFilter === 'ALL' || user.roles.includes(roleFilter))
  }, [users, search, roleFilter])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredUsers.length / usersPerPage)), [filteredUsers.length, usersPerPage])
  const start = useMemo(() => (currentPage - 1) * usersPerPage, [currentPage, usersPerPage])
  const paginatedUsers = useMemo(() => filteredUsers.slice(start, start + usersPerPage), [filteredUsers, start, usersPerPage])

  const allRoles = useMemo(() => Array.from(new Set(users.flatMap((user) => user.roles))).sort(), [users])
  const adminUsersCount = useMemo(
    () => users.filter((user) => user.roles.includes('ADMIN') || user.roles.includes('ROLE_ADMIN')).length,
    [users],
  )
  const activeRoleCount = allRoles.length
  const showingFrom = filteredUsers.length === 0 ? 0 : start + 1
  const showingTo = Math.min(start + usersPerPage, filteredUsers.length)

  const getDraftRoles = useCallback((userId: string, currentRoles: string[]): string[] => {
    return roleDrafts[userId] ?? currentRoles
  }, [roleDrafts])

  const toggleRole = useCallback((userId: string, currentRoles: string[], role: string, checked: boolean) => {
    const draftRoles = getDraftRoles(userId, currentRoles)
    const nextRoles = checked
      ? Array.from(new Set([...draftRoles, role]))
      : draftRoles.filter((draftRole) => draftRole !== role)

    setRoleDrafts((prev) => ({ ...prev, [userId]: nextRoles }))
  }, [getDraftRoles])

  const handleSaveRoles = useCallback((userId: string, currentRoles: string[]) => {
    onSaveRoles(userId, getDraftRoles(userId, currentRoles))
  }, [getDraftRoles, onSaveRoles])

  const handlePrevPage = useCallback(() => {
    setCurrentPage((page) => Math.max(1, page - 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setCurrentPage((page) => Math.min(totalPages, page + 1))
  }, [totalPages])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }, [])

  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value)
    setCurrentPage(1)
  }, [])

  return {
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
  }
}
