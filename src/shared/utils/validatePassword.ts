const RULES = [
  {
    test: (p: string) => p.length >= 8,
    message: 'Minimum 8 characters',
  },
  {
    test: (p: string) => /[A-Z]/.test(p),
    message: 'At least one uppercase letter',
  },
  {
    test: (p: string) => /[0-9]/.test(p),
    message: 'At least one number',
  },
  {
    test: (p: string) => /[!@#$%^&*]/.test(p),
    message: 'At least one special character (!@#$%^&*)',
  },
]

export function validatePassword(password: string): string[] {
  return RULES.filter((rule) => !rule.test(password)).map((rule) => rule.message)
}
