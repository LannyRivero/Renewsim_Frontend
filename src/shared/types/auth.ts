// ── Request types ──────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

// ── Response types ─────────────────────────────────────────
export interface AuthResponse {
  token: string
}

export interface RegisterResponse {
  id: number
  email: string
  fullName: string
  status: string
  message: string
}

export interface AuthUser {
  id: number
  username: string
  roles: string[]
}

// ── Profile ────────────────────────────────────────────────
export interface UserProfile {
  id: number
  username: string
  roles: string[]
}
