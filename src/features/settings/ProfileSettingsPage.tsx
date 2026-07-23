import { Link } from 'react-router-dom'
import { useDarkMode } from '@/shared/hooks'

export function ProfileSettingsPage() {
  const { mode, setTheme } = useDarkMode()

  return (
    <section className="min-h-screen bg-surface dark:bg-[#0f1a16]">
      <header className="border-b border-outline-variant bg-surface dark:border-white/10 dark:bg-[#0f1a16]">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/simulador" className="text-sm font-medium transition-colors hover:text-primary">
              Simulations
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              Learn
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 transition-colors hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-10 rounded-full bg-surface-container" />
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold">Account Settings</h2>

        <div className="space-y-10">
          <section>
            <h3 className="mb-6 border-b border-outline-variant pb-3 text-xl font-bold dark:border-white/10">
              Personal Information
            </h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Name
                </label>
                <input id="name" defaultValue="Jane Doe" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input id="email" type="email" defaultValue="jane.doe@example.com" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
              </div>
              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-medium">
                  Location
                </label>
                <input id="location" defaultValue="San Francisco, CA" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-6 border-b border-outline-variant pb-3 text-xl font-bold dark:border-white/10">
              Change Password
            </h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="current-password" className="mb-2 block text-sm font-medium">
                  Current Password
                </label>
                <input id="current-password" type="password" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
              </div>
              <div>
                <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
                  New Password
                </label>
                <input id="new-password" type="password" placeholder="Enter new password" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">
                  Confirm New Password
                </label>
                <input id="confirm-password" type="password" placeholder="Confirm new password" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-6 border-b border-outline-variant pb-3 text-xl font-bold dark:border-white/10">Preferences</h3>
            <div className="space-y-6">
              <div>
                <p className="mb-2 block text-sm font-medium">Theme</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-outline-variant p-3 has-[:checked]:border-primary dark:border-white/10">
                    <input
                      type="radio"
                      name="theme"
                      checked={mode === 'light'}
                      onChange={() => setTheme('light')}
                    />
                    <span>Light</span>
                  </label>
                  <label className="flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-outline-variant p-3 has-[:checked]:border-primary dark:border-white/10">
                    <input
                      type="radio"
                      name="theme"
                      checked={mode === 'dark'}
                      onChange={() => setTheme('dark')}
                    />
                    <span>Dark</span>
                  </label>
                  <label className="flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-outline-variant p-3 has-[:checked]:border-primary dark:border-white/10">
                    <input
                      type="radio"
                      name="theme"
                      checked={mode === 'system'}
                      onChange={() => setTheme('system')}
                    />
                    <span>System</span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="language" className="mb-2 block text-sm font-medium">
                  Language
                </label>
                <select id="language" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Français</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6">
            <button type="button" className="rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90">
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </section>
  )
}
