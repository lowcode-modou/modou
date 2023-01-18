import React, { FC } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { ReactRender } from '@modou/render'

export const CanvasDesignerReactRender: FC = () => {
  return (
    <DndProvider backend={HTML5Backend} context={window.parent}>
      <ReactRender host="simulator" />
    </DndProvider>
  )
}
