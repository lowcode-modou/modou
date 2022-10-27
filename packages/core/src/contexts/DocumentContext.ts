import { createContext } from 'react'

export const DocumentContext = createContext<{
  current: {
    document: Document
    window: Window
  }
}>({
  current: {
    document,
    window,
  },
})
