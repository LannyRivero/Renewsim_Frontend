type JwtClaims = {
  username?: string
  preferred_username?: string
  email?: string
  sub?: string
  name?: string
  given_name?: string
  roles?: string[]
  authorities?: string[]
  realm_access?: {
    roles?: string[]
  }
}

function normalizeRole(role: string): string {
  const upper = role.trim().toUpperCase()
  return upper.startsWith('ROLE_') ? upper.slice(5) : upper
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return atob(padded)
}

export function readTokenClaims(token: string | null | undefined): JwtClaims | null {
  if (!token) return null

  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const payloadJson = decodeBase64Url(parts[1])
    const payload = JSON.parse(payloadJson) as JwtClaims
    return payload
  } catch {
    return null
  }
}

export function readDisplayName(token: string | null | undefined): string | null {
  const claims = readTokenClaims(token)
  if (!claims) return null

  const raw =
    claims.preferred_username ??
    claims.username ??
    claims.given_name ??
    claims.name ??
    claims.email ??
    claims.sub ??
    null

  if (!raw) return null
  if (raw.includes('@')) return raw.split('@')[0]
  return raw
}

export function readRoles(token: string | null | undefined): string[] {
  const claims = readTokenClaims(token)
  if (!claims) return []

  if (Array.isArray(claims.roles)) return claims.roles.map(normalizeRole)
  if (Array.isArray(claims.authorities)) return claims.authorities.map(normalizeRole)
  if (Array.isArray(claims.realm_access?.roles)) return claims.realm_access.roles.map(normalizeRole)
  return []
}

export function readUserFromToken(token: string | null | undefined): { username: string; roles: string[] } | null {
  const username = readDisplayName(token)
  if (!username) return null

  return {
    username,
    roles: readRoles(token),
  }
}

export function hasRole(roles: string[] | null | undefined, role: string): boolean {
  if (!roles || roles.length === 0) return false
  const target = normalizeRole(role)
  return roles.some((item) => normalizeRole(item) === target)
}
