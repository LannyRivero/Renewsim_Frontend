import { describe, it, expect } from 'vitest'
import { validatePassword } from './validatePassword'

describe('validatePassword', () => {
  it('returns no errors for a valid password', () => {
    expect(validatePassword('Secure1!')).toEqual([])
  })

  it('returns error when password is too short', () => {
    const errors = validatePassword('Ab1!')
    expect(errors).toContain('Minimum 8 characters')
  })

  it('returns error when no uppercase letter', () => {
    const errors = validatePassword('secure1!')
    expect(errors).toContain('At least one uppercase letter')
  })

  it('returns error when no number', () => {
    const errors = validatePassword('Securee!')
    expect(errors).toContain('At least one number')
  })

  it('returns error when no special character', () => {
    const errors = validatePassword('Secure12')
    expect(errors).toContain('At least one special character (!@#$%^&*)')
  })

  it('returns multiple errors for weak password', () => {
    const errors = validatePassword('weak')
    expect(errors).toContain('Minimum 8 characters')
    expect(errors).toContain('At least one uppercase letter')
    expect(errors).toContain('At least one number')
    expect(errors).toContain('At least one special character (!@#$%^&*)')
  })

  it('returns error for empty string', () => {
    const errors = validatePassword('')
    expect(errors.length).toBeGreaterThan(0)
  })
})
