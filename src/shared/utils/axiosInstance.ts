import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Attach JWT token on every request if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('renewsim-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
