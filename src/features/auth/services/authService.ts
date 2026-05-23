import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
} from '../../../shared/types/auth'
import { axiosInstance } from '../../../shared/utils/axiosInstance'

type OperationResponse<T> = {
  status: number
  success: boolean
  message: string
  data: T
  timestamp: string
  traceId: string
  actorUsername: string
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const payload = {
    email: credentials.email.trim(),
    password: credentials.password,
  }
  const { data } = await axiosInstance.post<OperationResponse<{ accessToken: string }>>(
    '/api/v1/auth/login',
    payload,
    { withCredentials: true },
  )
  return { token: data.data.accessToken }
}

export async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
  const payload = {
    email: credentials.email.trim(),
    password: credentials.password,
    fullName: credentials.fullName.trim(),
  }
  const { data } = await axiosInstance.post<OperationResponse<RegisterResponse>>('/api/v1/auth/register', payload)
  return data.data
}
