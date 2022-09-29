import { FC, useMemo, useState } from 'react'
import { ReactRender } from '@modou/render'
import { useRecoilValue } from 'recoil'
import { widgetByIdSelector, widgetsAtom } from '../store'
import { useMutationObserver } from 'ahooks'
import { WidgetDropHack } from './WidgetDropHack'
import { getWidgetIdFromElement, getWidgetSlotNameFromElement } from '../utils'

interface CanvasDesignerCanvasProps {
  rootWidgetId: string
}

export const CanvasDesignerCanvas: FC<CanvasDesignerCanvasProps> = ({ rootWidgetId }) => {
  const widgets = useRecoilValue(widgetsAtom)
  const widgetById = useRecoilValue(widgetByIdSelector)

  const [dropElements, setDropElements] = useState<Array<{
    widgetId: string
    slotName: string
  }>>([])

  // TODO target 切换为 canvas root element
  useMutationObserver(() => {
    const elements = [...document.querySelectorAll('[data-widget-id]')] as HTMLElement[]
    setDropElements(elements.map(element => ({
      widgetId: getWidgetIdFromElement(element),
      slotName: getWidgetSlotNameFromElement(element)
    })).filter((widget) => !!widget))
  }, document.body, {
    childList: true,
    subtree: true
  })

  const dropElementsRendered = useMemo(() => {
    return dropElements.filter(({ widgetId }) => Reflect.has(widgetById, widgetId))
  }, [dropElements, widgetById])

  return <div
    className='border-1 border-red-500 border-solid h-full relative'>
    <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
    <WidgetDropHack dropElements={dropElementsRendered} />
  </div>
}
