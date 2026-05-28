import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ProfileSettingsPage } from './ProfileSettingsPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <ProfileSettingsPage />
    </MemoryRouter>,
  )
}

describe('ProfileSettingsPage', () => {
  it('renders account settings title', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Account Settings' })).toBeInTheDocument()
  })

  it('renders personal information section fields', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Personal Information' })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Location')).toBeInTheDocument()
  })

  it('renders change password and preferences sections', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Change Password' })).toBeInTheDocument()
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument()
    expect(screen.getByLabelText('Language')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })
})
