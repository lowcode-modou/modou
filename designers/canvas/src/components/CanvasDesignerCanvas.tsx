import { FC } from 'react'
import { ReactRender } from '@modou/render'
import { useRecoilValue } from 'recoil'
import { pageAtom } from '../store'

// interface CanvasDesignerCanvasProps {
//   // rootWidgetId: string
// }

export const CanvasDesignerCanvas: FC = () => {
  const { widgets, rootWidgetId } = useRecoilValue(pageAtom)
  return <div
    className='h-full relative'>
    <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
  </div>
}
