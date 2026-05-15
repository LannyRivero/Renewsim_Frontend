import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, register } from './authService'
import { axiosInstance } from '../../../shared/utils/axiosInstance'

vi.mock('../../../shared/utils/axiosInstance', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}))

const mockPost = vi.mocked(axiosInstance.post)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authService.login', () => {
  it('calls POST /api/v1/auth/login with credentials', async () => {
    mockPost.mockResolvedValueOnce({ data: { token: 'abc123' } })

    const result = await login({ username: 'user@test.com', password: 'Pass1!' })

    expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/login', {
      username: 'user@test.com',
      password: 'Pass1!',
    })
    expect(result).toEqual({ token: 'abc123' })
  })

  it('throws when login fails', async () => {
    mockPost.mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(login({ username: 'bad', password: 'bad' })).rejects.toThrow()
  })
})

describe('authService.register', () => {
  it('calls POST /api/v1/auth/register with credentials', async () => {
    mockPost.mockResolvedValueOnce({ data: { token: 'xyz789' } })

    const result = await register({ username: 'new@test.com', password: 'Pass1!' })

    expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/register', {
      username: 'new@test.com',
      password: 'Pass1!',
    })
    expect(result).toEqual({ token: 'xyz789' })
  })

  it('throws when register fails', async () => {
    mockPost.mockRejectedValueOnce(new Error('Conflict'))

    await expect(register({ username: 'dup@test.com', password: 'Pass1!' })).rejects.toThrow()
  })
})
