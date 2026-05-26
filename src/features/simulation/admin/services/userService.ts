import { httpClient } from '@/services/httpClient'
import type { AdminUser } from '@/shared/types'
import { adminUserSchema, rolesUpdateSchema } from '../schemas/adminSchema'

type ApiResponse<T> = {
  data?: T
  content?: T
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const response = await httpClient.get<ApiResponse<unknown[]> | unknown[]>('/users')

  const raw = Array.isArray(response.data)
    ? response.data
    : (response.data.data ?? response.data.content ?? [])

  return raw.map((item) => adminUserSchema.parse(item))
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<void> {
  const payload = rolesUpdateSchema.parse({ roles })
  await httpClient.put(`/users/${userId}/roles`, payload)
}

export async function deleteUser(userId: string): Promise<void> {
  await httpClient.delete(`/users/${userId}`)
}
