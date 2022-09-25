import { CSSProperties, FC } from 'react'
import { ReactRender } from '@modou/render'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import { useRecoilValue } from 'recoil'
import { widgetsAtom } from '../store'

interface CanvasDesignerCanvasProps {
  rootWidgetId: string
}

export const CanvasDesignerCanvas: FC<CanvasDesignerCanvasProps> = ({ rootWidgetId }) => {
  const widgets = useRecoilValue(widgetsAtom)

  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable'
  })
  console.log('isOver', isOver)
  const style: CSSProperties = {
    color: isOver ? 'green' : undefined
  }

  useDndMonitor({
    onDragStart (event) {
    },
    onDragMove (event) {
    },
    onDragOver (event) {
    },
    onDragEnd (event) {
      console.log(event)
    },
    onDragCancel (event) {
    }
  })

  return <div ref={setNodeRef}
              className='border-1 border-red-500 border-solid h-full'
              style={style}>
    <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
  </div>
}
