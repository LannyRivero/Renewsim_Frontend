import { httpClient } from '@/services/httpClient'
import type { AdminUser } from '@/shared/types'
import { adminUserSchema, rolesUpdateSchema } from '../schemas/adminSchema'

type ApiResponse<T> = {
  data?: T
  content?: T
}

function extractUsersPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>

    if (Array.isArray(record.data)) return record.data
    if (record.data && typeof record.data === 'object') {
      const nestedData = record.data as Record<string, unknown>
      if (Array.isArray(nestedData.content)) return nestedData.content
      if (Array.isArray(nestedData.items)) return nestedData.items
    }

    if (Array.isArray(record.content)) return record.content
    if (Array.isArray(record.items)) return record.items
  }

  return []
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const response = await httpClient.get<ApiResponse<unknown[]> | unknown[]>('/users')

  const raw = extractUsersPayload(response.data)

  return raw.map((item) => adminUserSchema.parse(item))
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<void> {
  const payload = rolesUpdateSchema.parse({ roles })
  await httpClient.put(`/users/${userId}/roles`, payload)
}

export async function deleteUser(userId: string): Promise<void> {
  await httpClient.delete(`/users/${userId}`)
}
