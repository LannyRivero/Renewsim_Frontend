import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'
import * as authService from '../services/authService'

vi.mock('../services/authService')

const mockRegister = vi.mocked(authService.register)

function renderForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <RegisterForm onSuccess={onSuccess} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('RegisterForm', () => {
  it('renders all fields and submit button', () => {
    renderForm()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows link to login page', () => {
    renderForm()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows password validation errors when submitting weak password', async () => {
    renderForm()
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ana@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'weak' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(await screen.findByText('Minimum 8 characters')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('calls register service with backend register payload on valid submit', async () => {
    mockRegister.mockResolvedValueOnce({
      id: 2,
      email: 'ana@test.com',
      fullName: 'Ana Lopez',
      status: 'PENDING_VERIFICATION',
      message: 'Verification email sent',
    })
    const onSuccess = vi.fn()
    renderForm(onSuccess)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ana López' } })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ana@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Secure1!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'ana@test.com',
        password: 'Secure1!',
        fullName: 'Ana López',
      })
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('shows error message when register fails', async () => {
    mockRegister.mockRejectedValueOnce(new Error('El usuario ya existe'))
    renderForm()

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'dup@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Secure1!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('disables submit button while loading', async () => {
    mockRegister.mockImplementationOnce(() => new Promise(() => {}))
    renderForm()

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ana@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Secure1!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing up|loading/i })).toBeDisabled()
    })
  })
})
