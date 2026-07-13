import { SimulationLocationSearchBar, SimulationStateMessage, SimulationTextInput } from '@/shared/components'

export function EditSimulationLocationField({
  defaultValue,
  isResolvingBrowserLocation,
  locationAssistMessage,
  onUseBrowserLocation,
}: {
  defaultValue: string
  isResolvingBrowserLocation: boolean
  locationAssistMessage: string | null
  onUseBrowserLocation: () => void
}) {
  return (
    <div>
      <label htmlFor="location" className="mb-1 block text-sm font-medium">
        Ubicación
      </label>
      <div className="rounded-sm border border-[#d8dee8] bg-[#f6f8fb] p-4 dark:border-white/10 dark:bg-[#15191d]">
        <SimulationLocationSearchBar
          isResolvingBrowserLocation={isResolvingBrowserLocation}
          onUseBrowserLocation={onUseBrowserLocation}
          input={
            <SimulationTextInput
              id="location"
              name="location"
              type="text"
              defaultValue={defaultValue}
              placeholder="Ingresá ciudad o región"
              className="h-auto flex-1 border-none bg-transparent px-0 py-2.5 shadow-none focus:ring-0"
            />
          }
        />
        {locationAssistMessage ? <SimulationStateMessage className="mt-2 text-xs">{locationAssistMessage}</SimulationStateMessage> : null}
      </div>
    </div>
  )
}
