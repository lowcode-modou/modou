import { FC, ReactNode, createContext, useContext } from 'react'

import { AppFile } from '@modou/meta-vfs'

const AppFileContext = createContext<AppFile | null>(null)

export const AppFileProvider: FC<{ value: AppFile; children: ReactNode }> = ({
  value,
  children,
}) => {
  return (
    <AppFileContext.Provider value={value}>{children}</AppFileContext.Provider>
  )
}

export const useAppFile = () => {
  const appFile = useContext(AppFileContext) as unknown as AppFile
  return { appFile }
}
