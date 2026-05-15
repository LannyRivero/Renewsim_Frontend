import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from './PasswordInput'

describe('PasswordInput', () => {
  it('renders with label "Contraseña" by default', () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('renders with a custom label', () => {
    render(<PasswordInput id="pwd" label="Nueva contraseña" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
  })

  it('input type is password by default', () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
  })

  it('toggles to text when show/hide button is clicked', () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    const toggle = screen.getByRole('button', { name: /mostrar|ocultar/i })
    fireEvent.click(toggle)
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'text')
  })

  it('toggles back to password on second click', () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    const toggle = screen.getByRole('button', { name: /mostrar|ocultar/i })
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
  })

  it('displays validation errors when provided', () => {
    render(
      <PasswordInput
        id="pwd"
        value="weak"
        onChange={() => {}}
        errors={['Mínimo 8 caracteres', 'Al menos un número']}
      />
    )
    expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Al menos un número')).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const handleChange = vi.fn()
    render(<PasswordInput id="pwd" value="" onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Test1!' } })
    expect(handleChange).toHaveBeenCalled()
  })
})
