import { FC, useState } from 'react'
import { ReactRender } from '@modou/render'
import { useRecoilValue } from 'recoil'
import { widgetByIdSelector, widgetsAtom } from '../store'
import { useMutationObserver } from 'ahooks'
import { WidgetDropHack } from './WidgetDropHack'
import { WidgetBaseProps } from '@modou/core'
import { getWidgetIdFromElement } from '../utils'

interface CanvasDesignerCanvasProps {
  rootWidgetId: string
}

export const CanvasDesignerCanvas: FC<CanvasDesignerCanvasProps> = ({ rootWidgetId }) => {
  const widgets = useRecoilValue(widgetsAtom)
  const widgetById = useRecoilValue(widgetByIdSelector)

  const [drops, setDrops] = useState<Array<{
    widget: WidgetBaseProps
    element: HTMLElement
  }>>([])

  // TODO target 切换为 canvas root element
  useMutationObserver(() => {
    const elements = [...document.querySelectorAll('[data-widget-id]')] as HTMLElement[]
    setDrops(elements.map(element => ({
      element,
      widget: widgetById[getWidgetIdFromElement(element)]
    })))
  }, document.body, {
    childList: true,
    subtree: true
  })

  return <div
    id="asdasdasdasd"
    className='border-1 border-red-500 border-solid h-full'>
    <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
    <WidgetDropHack drops={drops} />
  </div>
}
