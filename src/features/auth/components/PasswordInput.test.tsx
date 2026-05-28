import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from './PasswordInput'

describe('PasswordInput', () => {
  it('renders with label "Password" by default', () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders with a custom label', () => {
    render(<PasswordInput id="pwd" label="New password" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('New password')).toBeInTheDocument()
  })

  it('input type is password by default', () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('toggles to text when show/hide button is clicked', { timeout: 10000 }, () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    const toggle = screen.getByRole('button', { name: /show|hide/i })
    fireEvent.click(toggle)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
  })

  it('toggles back to password on second click', { timeout: 10000 }, () => {
    render(<PasswordInput id="pwd" value="" onChange={() => {}} />)
    const toggle = screen.getByRole('button', { name: /show|hide/i })
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('displays validation errors when provided', () => {
    render(
      <PasswordInput
        id="pwd"
        value="weak"
        onChange={() => {}}
        errors={['Minimum 8 characters', 'At least one number']}
      />
    )
    expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument()
    expect(screen.getByText('At least one number')).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const handleChange = vi.fn()
    render(<PasswordInput id="pwd" value="" onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Test1!' } })
    expect(handleChange).toHaveBeenCalled()
  })
})
