import { createContext } from 'react'

export const WidgetElementsContext = createContext<{
  update: (elements: HTMLElement[]) => void
}>({
  update() {
    throw new Error(`update in WidgetElementsContext must be initialized`)
  },
})
