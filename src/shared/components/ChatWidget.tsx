import { useUiStore } from '@/stores/uiStore'

export function ChatWidget() {
  const isChatOpen = useUiStore((state) => state.isChatOpen)
  const toggleChat = useUiStore((state) => state.toggleChat)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isChatOpen ? (
        <section
          role="dialog"
          aria-label="Chat panel"
          className="w-80 rounded-2xl border border-outline-variant dark:border-white/10 bg-surface dark:bg-surface-dark shadow-lg"
        >
          <header className="flex items-center justify-between border-b border-outline-variant dark:border-white/10 px-4 py-3">
            <h2 className="text-sm font-semibold">RenewSim Assistant</h2>
            <button
              type="button"
              aria-label="Close chat"
              onClick={toggleChat}
              className="rounded-md px-2 py-1 text-xs font-medium hover:bg-surface-container-low dark:hover:bg-white/5"
            >
              Close
            </button>
          </header>
          <div className="px-4 py-3 text-sm text-on-surface-variant dark:text-content-dark/70">
            Coming soon: energy recommendation chat.
          </div>
        </section>
      ) : null}

      <button
        type="button"
        aria-label="Open chat"
        onClick={toggleChat}
        className="h-12 rounded-full bg-primary-container px-5 text-sm font-semibold text-on-primary shadow-md hover:brightness-95"
      >
        Chat
      </button>
    </div>
  )
}
