// ── Request types ──────────────────────────────────────────
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

// ── Response types ─────────────────────────────────────────
export interface AuthResponse {
  token: string
}

export interface AuthUser {
  id: number
  username: string
  roles: string[]
}
