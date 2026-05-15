import type { LoginRequest, RegisterRequest, AuthResponse } from '../../../shared/types/auth'
import { axiosInstance } from '../../../shared/utils/axiosInstance'

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/api/v1/auth/login', credentials)
  return data
}

export async function register(credentials: RegisterRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/api/v1/auth/register', credentials)
  return data
}
