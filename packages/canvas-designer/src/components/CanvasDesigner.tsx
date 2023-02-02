import { FC, ReactElement, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { PageFile } from '@modou/meta-vfs'
import { CanvasStateProvider, PageState } from '@modou/state-manager'

import { CanvasDesignerFileProvider } from '../contexts/CanvasDesignerFileContext'
import { CanvasDesignerStoreProvider } from '../contexts/CanvasDesignerStoreContext'
import { CanvasDesignerImpl } from './CanvasDesignerImpl'

interface CanvasDesignerProps {
  file: PageFile
  children: ReactElement
}

export const CanvasDesigner: FC<CanvasDesignerProps> = ({ file, children }) => {
  const [canvasState, setCanvasState] = useState<PageState>()

  useEffect(() => {
    // TODO 添加到 AppState
    if (canvasState?.file === file) {
      return
    }
    setCanvasState(new PageState(file))
  }, [canvasState?.file, file])

  return canvasState ? (
    <CanvasDesignerFileProvider value={file}>
      <CanvasStateProvider value={canvasState}>
        <CanvasDesignerStoreProvider>
          <DndProvider backend={HTML5Backend}>
            <CanvasDesignerImpl>{children}</CanvasDesignerImpl>
          </DndProvider>
        </CanvasDesignerStoreProvider>
      </CanvasStateProvider>
    </CanvasDesignerFileProvider>
  ) : null
}
