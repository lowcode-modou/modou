import { FC, ReactNode, createContext, useContext } from 'react'

import { AppState } from '../AppState'

const AppStateContext = createContext<AppState | null>(null)
export const AppStateProvider: FC<{
  value: AppState
  children: ReactNode
}> = ({ value, children }) => {
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export const useAppState = () => {
  const appState = useContext(AppStateContext) as unknown as AppState
  return { appState }
}
