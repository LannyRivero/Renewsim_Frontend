import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean
}

type QueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }

    if (token) {
      resolve(token)
      return
    }

    reject(new Error('Refresh failed: missing access token'))
  })

  failedQueue = []
}

function attachAuthorization(config: RetryableRequest, token: string) {
  const headers = AxiosHeaders.from(config.headers)
  headers.set('Authorization', `Bearer ${token}`)
  config.headers = headers
}

const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

export const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken ?? localStorage.getItem('renewsim-token')
  if (token) {
    attachAuthorization(config as RetryableRequest, token)
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined
    const status = error.response?.status

    if (!originalRequest || status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest.url?.includes('/auth/refresh')) {
      useAuthStore.getState().clearAuth()
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest._retry = true
        attachAuthorization(originalRequest, token)
        return httpClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await refreshClient.post<{ accessToken?: string; token?: string }>(
        '/auth/refresh',
      )

      const newAccessToken = data.accessToken ?? data.token

      if (!newAccessToken) {
        throw new Error('Refresh response did not include accessToken')
      }

      useAuthStore.setState((state) => ({
        ...state,
        accessToken: newAccessToken,
        isAuthenticated: true,
      }))

      processQueue(null, newAccessToken)
      attachAuthorization(originalRequest, newAccessToken)

      return httpClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      useAuthStore.getState().clearAuth()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
