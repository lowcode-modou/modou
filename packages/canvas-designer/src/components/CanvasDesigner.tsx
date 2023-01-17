import { Tabs } from 'antd'
import { FC, ReactElement } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RecoilRoot } from 'recoil'

import { mcss } from '@modou/css-in-js'
import { PageFile } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'

import { CanvasDesignerFileProvider } from '../contexts/CanvasDesignerFileContext'
import { CanvasDesignerStoreProvider } from '../contexts/CanvasDesignerStoreContext'
import { CanvasDesignerImpl } from './CanvasDesignerImpl'

interface CanvasDesignerProps {
  file: PageFile
  children: ReactElement
}

export const CanvasDesigner: FC<CanvasDesignerProps> = ({ file, children }) => {
  return (
    <CanvasDesignerFileProvider value={file}>
      <CanvasDesignerStoreProvider>
        <DndProvider backend={HTML5Backend}>
          <CanvasDesignerImpl>{children}</CanvasDesignerImpl>
        </DndProvider>
      </CanvasDesignerStoreProvider>
    </CanvasDesignerFileProvider>
  )
}
