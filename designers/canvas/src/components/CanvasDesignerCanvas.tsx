import { FC } from 'react'
import { ReactRender } from '@modou/render'
import { useRecoilValue } from 'recoil'
import { pageSelector } from '../store'

// interface CanvasDesignerCanvasProps {
//   // rootWidgetId: string
// }

export const CanvasDesignerCanvas: FC = () => {
  const { widgets, rootWidgetId } = useRecoilValue(pageSelector)
  return <div
    style={{
      padding: '16px'
    }}
    className='h-full relative'>
    <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
  </div>
}
