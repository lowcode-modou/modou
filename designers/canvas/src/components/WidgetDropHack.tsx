import { FC, memo, useContext, useEffect, useRef } from 'react'
import { WidgetBaseProps, WidgetFactoryContext } from '@modou/core'
import { useDrop } from 'react-dnd'
import { useAddWidget } from '../hooks'
import { head, isEmpty } from 'lodash'
import { useRecoilValue } from 'recoil'
import { widgetSelector } from '@modou/render/src/store'

const WidgetDrop: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const widget = useRecoilValue(widgetSelector(widgetId))
  const widgetFactory = useContext(WidgetFactoryContext)
  const { addWidget } = useAddWidget()
  // // // TODO 查看 react-dnd 为什么能自动推断参数类型
  const [{ canDrop, isOverCurrent }, drop] = useDrop<{
    widget: WidgetBaseProps
  }, {
    widget: WidgetBaseProps
  }, {
    isOver: boolean
    canDrop: boolean
    isOverCurrent: boolean
  }>(() => ({
    accept: Object.keys(widgetFactory.widgetByType),
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }

      const widgetMetadata = widgetFactory.widgetByType[widget.widgetType]

      if (!isEmpty(widgetMetadata.metadata.slots)) {
        addWidget({
          sourceWidget: item.widget,
          targetWidgetId: widget.widgetId,
          targetSlotName: head(Object.keys(widget.slots)),
          targetPosition: widget.slots.children.length
        })
      }
      return { widget }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  }))
  const element = document.querySelector(`[data-widget-id=${widgetId}]`) as HTMLElement
  const isActive = canDrop && isOverCurrent
  const elementBgColor = useRef<string>()
  useEffect(() => {
    if (!elementBgColor.current) {
      elementBgColor.current = getComputedStyle(element).backgroundColor
    }
    if (isActive) {
      element.style.backgroundColor = 'darkgreen'
    } else {
      element.style.backgroundColor = elementBgColor.current
    }
  }, [element, element.style, isActive])
  drop(element)
  return null
}

const MemoWidgetDrop = memo(WidgetDrop)

export const WidgetDropHack: FC<{
  dropWidgetIds: string[]
}> = ({ dropWidgetIds }) => {
  // TODO use Memo 优化性能
  return <>{
    dropWidgetIds.map((widgetId) => <MemoWidgetDrop key={widgetId} widgetId={widgetId} />)
  }</>
}
