import { createContext } from 'react'

export const SimulatorInstanceContext = createContext<{
  document?: Document
}>({})
