const RULES = [
  {
    test: (p: string) => p.length >= 8,
    message: 'Minimo 8 caracteres',
  },
  {
    test: (p: string) => /[A-Z]/.test(p),
    message: 'Al menos una letra mayuscula',
  },
  {
    test: (p: string) => /[0-9]/.test(p),
    message: 'Al menos un numero',
  },
  {
    test: (p: string) => /[!@#$%^&*]/.test(p),
    message: 'Al menos un caracter especial (!@#$%^&*)',
  },
]

export function validatePassword(password: string): string[] {
  return RULES.filter((rule) => !rule.test(password)).map((rule) => rule.message)
}
