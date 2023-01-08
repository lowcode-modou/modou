import { FC, ReactNode, createContext, useContext } from 'react'

import { PageFile } from '@modou/meta-vfs'

const CanvasFileContext = createContext<PageFile | null>(null)

export const CanvasFileContextProvider: FC<{
  children: ReactNode
  value: PageFile
}> = ({ children, value }) => {
  return (
    <CanvasFileContext.Provider value={value}>
      {children}
    </CanvasFileContext.Provider>
  )
}

export const useCanvasFile = () => {
  const canvasFile = useContext(CanvasFileContext) as unknown as PageFile
  return { canvasFile }
}
