import { FC, ReactNode, createContext, useContext } from 'react'

import { PageFile } from '@modou/meta-vfs'

const CanvasDesignerFileContext = createContext<PageFile | null>(null)

export const CanvasDesignerFileProvider: FC<{
  children: ReactNode
  value: PageFile
}> = ({ children, value }) => {
  return (
    <CanvasDesignerFileContext.Provider value={value}>
      {children}
    </CanvasDesignerFileContext.Provider>
  )
}

export const useCanvasDesignerFile = () => {
  const canvasDesignerFile = useContext(
    CanvasDesignerFileContext,
  ) as unknown as PageFile
  return { canvasDesignerFile }
}
