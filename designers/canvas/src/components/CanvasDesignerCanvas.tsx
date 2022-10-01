import { FC } from 'react'
import { ReactRender } from '@modou/render'
import { useRecoilValue } from 'recoil'
import { widgetsAtom } from '../store'

interface CanvasDesignerCanvasProps {
  rootWidgetId: string
}

export const CanvasDesignerCanvas: FC<CanvasDesignerCanvasProps> = ({ rootWidgetId }) => {
  const widgets = useRecoilValue(widgetsAtom)
  return <div
    className='border-1 border-red-500 border-solid h-full relative'>
    <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
  </div>
}
