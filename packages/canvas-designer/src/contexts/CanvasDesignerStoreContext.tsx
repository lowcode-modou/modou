import { FC, ReactNode, createContext, useContext, useRef } from 'react'

import { CanvasDesignerStore } from '../store'

const CanvasDesignerStoreContext = createContext<CanvasDesignerStore | null>(
  null,
)

export const CanvasDesignerStoreProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const store = useRef(new CanvasDesignerStore())
  return (
    <CanvasDesignerStoreContext.Provider value={store.current}>
      {children}
    </CanvasDesignerStoreContext.Provider>
  )
}
export const useCanvasDesignerStore = () => {
  const canvasDesignerStore = useContext(
    CanvasDesignerStoreContext,
  ) as unknown as CanvasDesignerStore
  return { canvasDesignerStore }
}
