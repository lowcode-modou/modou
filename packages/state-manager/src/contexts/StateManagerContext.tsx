import { FC, ReactNode, createContext, useContext } from 'react'

import { StateManager } from '../StateManager'

const StateManagerContext = createContext<StateManager | null>(null)
export const StateManagerProvider: FC<{
  value: StateManager
  children: ReactNode
}> = ({ value, children }) => {
  return (
    <StateManagerContext.Provider value={value}>
      {children}
    </StateManagerContext.Provider>
  )
}

export const useStateManager = () => {
  const stateManager = useContext(
    StateManagerContext,
  ) as unknown as StateManager
  return {
    stateManager,
    appState: stateManager.app,
    canvasState: stateManager.canvas,
  }
}
