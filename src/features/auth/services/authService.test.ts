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
    mockPost.mockResolvedValueOnce({
      data: {
        status: 200,
        success: true,
        message: 'Login successful',
        data: { accessToken: 'abc123' },
        timestamp: '2026-05-22T00:00:00Z',
        traceId: 'trace-1',
        actorUsername: 'admin@renewsim.com',
      },
    })

    const result = await login({ email: 'user@test.com', password: 'Pass1!' })

    expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/login', {
      email: 'user@test.com',
      password: 'Pass1!',
    }, { withCredentials: true })
    expect(result).toEqual({ token: 'abc123' })
  })

  it('throws when login fails', async () => {
    mockPost.mockRejectedValueOnce(new Error('Unauthorized'))

    await expect(login({ email: 'bad@test.com', password: 'bad' })).rejects.toThrow()
  })
})

describe('authService.register', () => {
  it('calls POST /api/v1/auth/register with credentials', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        status: 201,
        success: true,
        message: 'User registered successfully',
        data: {
          id: 2,
          email: 'new@test.com',
          fullName: 'New User',
          status: 'PENDING_VERIFICATION',
          message: 'Verification email sent',
        },
        timestamp: '2026-05-22T00:00:00Z',
        traceId: 'trace-2',
        actorUsername: 'anonymousUser',
      },
    })

    const result = await register({
      email: 'new@test.com',
      password: 'Pass1!',
      fullName: 'New User',
    })

    expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/register', {
      email: 'new@test.com',
      password: 'Pass1!',
      fullName: 'New User',
    })
    expect(result).toEqual({
      id: 2,
      email: 'new@test.com',
      fullName: 'New User',
      status: 'PENDING_VERIFICATION',
      message: 'Verification email sent',
    })
  })

  it('throws when register fails', async () => {
    mockPost.mockRejectedValueOnce(new Error('Conflict'))

    await expect(register({ email: 'dup@test.com', password: 'Pass1!', fullName: 'Dup User' })).rejects.toThrow()
  })
})
