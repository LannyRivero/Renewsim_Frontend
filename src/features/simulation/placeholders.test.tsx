import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AdminPage } from './placeholders'

vi.mock('./admin/services/userService', () => ({
  getAllUsers: vi.fn(),
  updateUserRoles: vi.fn(),
  deleteUser: vi.fn(),
}))

import { getAllUsers, updateUserRoles, deleteUser } from './admin/services/userService'

const mockedGetAllUsers = vi.mocked(getAllUsers)
const mockedUpdateUserRoles = vi.mocked(updateUserRoles)
const mockedDeleteUser = vi.mocked(deleteUser)

function renderAdmin() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminPage />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockedGetAllUsers.mockResolvedValue([])
})

describe('AdminPage', () => {
  it('filters users by role and supports pagination', async () => {
    mockedGetAllUsers.mockResolvedValueOnce(
      Array.from({ length: 12 }, (_, index) => ({
        id: String(index + 1),
        username: `user${index + 1}`,
        roles: index % 2 === 0 ? ['USER'] : ['ADMIN'],
      })),
    )

    renderAdmin()

    await screen.findByText('user1')
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Filter by role'), { target: { value: 'ADMIN' } })

    await waitFor(() => {
      expect(screen.getByText('user2')).toBeInTheDocument()
      expect(screen.queryByText('user1')).not.toBeInTheDocument()
    })
  })

  it('saves roles and deletes user', async () => {
    mockedGetAllUsers.mockResolvedValue([
      { id: '1', username: 'admin', roles: ['ADMIN'] },
    ])
    mockedUpdateUserRoles.mockResolvedValueOnce()
    mockedDeleteUser.mockResolvedValueOnce()

    renderAdmin()

    await screen.findByText('admin')

    fireEvent.change(screen.getByDisplayValue('ADMIN'), { target: { value: 'ADMIN,USER' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Roles' }))

    await waitFor(() => {
      expect(mockedUpdateUserRoles).toHaveBeenCalledWith('1', ['ADMIN', 'USER'])
    })

    fireEvent.click(screen.getByRole('button', { name: 'Delete User' }))

    await waitFor(() => {
      expect(mockedDeleteUser).toHaveBeenCalled()
      expect(mockedDeleteUser.mock.calls[0]?.[0]).toBe('1')
    })
  })
})
