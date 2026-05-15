import { describe, it, expect } from 'vitest'
import { validatePassword } from './validatePassword'

describe('validatePassword', () => {
  it('returns no errors for a valid password', () => {
    expect(validatePassword('Secure1!')).toEqual([])
  })

  it('returns error when password is too short', () => {
    const errors = validatePassword('Ab1!')
    expect(errors).toContain('Mínimo 8 caracteres')
  })

  it('returns error when no uppercase letter', () => {
    const errors = validatePassword('secure1!')
    expect(errors).toContain('Al menos una letra mayúscula')
  })

  it('returns error when no number', () => {
    const errors = validatePassword('Securee!')
    expect(errors).toContain('Al menos un número')
  })

  it('returns error when no special character', () => {
    const errors = validatePassword('Secure12')
    expect(errors).toContain('Al menos un carácter especial (!@#$%^&*)')
  })

  it('returns multiple errors for weak password', () => {
    const errors = validatePassword('weak')
    expect(errors).toContain('Mínimo 8 caracteres')
    expect(errors).toContain('Al menos una letra mayúscula')
    expect(errors).toContain('Al menos un número')
    expect(errors).toContain('Al menos un carácter especial (!@#$%^&*)')
  })

  it('returns error for empty string', () => {
    const errors = validatePassword('')
    expect(errors.length).toBeGreaterThan(0)
  })
})
