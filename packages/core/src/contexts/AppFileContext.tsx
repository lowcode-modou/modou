import { FC, ReactNode, createContext, useContext } from 'react'

import { AppManager } from '@modou/meta-vfs/src/AppManager'

const AppManagerContext = createContext<AppManager | null>(null)

export const AppManagerProvider: FC<{
  value: AppManager
  children: ReactNode
}> = ({ value, children }) => {
  return (
    <AppManagerContext.Provider value={value}>
      {children}
    </AppManagerContext.Provider>
  )
}

export const useAppManager = () => {
  const appManager = useContext(AppManagerContext) as unknown as AppManager
  return { appManager, app: appManager.app }
}
