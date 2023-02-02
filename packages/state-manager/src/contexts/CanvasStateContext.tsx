import { FC, ReactNode, createContext, useContext } from 'react'

import { PageState } from '../PageState'

const CanvasStateContext = createContext<PageState | null>(null)
export const CanvasStateProvider: FC<{
  value: PageState
  children: ReactNode
}> = ({ value, children }) => {
  return (
    <CanvasStateContext.Provider value={value}>
      {children}
    </CanvasStateContext.Provider>
  )
}

export const useCanvasState = () => {
  const canvasState = useContext(CanvasStateContext) as unknown as PageState
  return { canvasState }
}
