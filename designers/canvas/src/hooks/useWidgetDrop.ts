import { useDrop } from 'react-dnd'
import { WidgetBaseProps, WidgetFactoryContext } from '@modou/core'
import { isArray, isEmpty } from 'lodash'
import { useContext, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { widgetSelector } from '@modou/render/src/store'
import { useAddWidget } from './useAddWidget'
import { useElementRect } from './useElementRect'

const EMPTY_WIDGET_MIN_HEIGHT = '36px'

const useWidgetBgColor = ({
  isActive,
  element
}: {
  isActive: boolean
  element: HTMLElement
}) => {
  const elementBgColor = useRef<{
    initialized: boolean
    value: string
  }>({
    initialized: false,
    value: ''
  })
  useEffect(() => {
    if (!elementBgColor.current.initialized) {
      elementBgColor.current = {
        value: getComputedStyle(element).backgroundColor,
        initialized: true
      }
    }
    if (isActive) {
      element.style.backgroundColor = 'rgba(0,0,0,.3)'
    } else {
      element.style.backgroundColor = elementBgColor.current.value
    }
  }, [element, element.style, isActive])
}

const useWidgetMinHeight = ({
  canSetMinHeight,
  element
}: {
  canSetMinHeight: boolean
  element: HTMLElement
}) => {
  const elementMinHeight = useRef<{
    initialized: boolean
    value?: string
  }>({
    initialized: false
  })

  useEffect(() => {
    if (!elementMinHeight.current.initialized) {
      elementMinHeight.current = {
        value: getComputedStyle(element).minHeight,
        initialized: true
      }
    }
    // TODO add slot name
    if (canSetMinHeight) {
      element.style.minHeight = EMPTY_WIDGET_MIN_HEIGHT
    } else {
      element.style.minHeight = elementMinHeight.current.value ?? 'auto'
    }
  }, [element, element.innerHTML, canSetMinHeight])
}

const DEFAULT_DEPS: any[] = []
const useWidgetPosition = (
  element: HTMLElement,
  options: {
    deps?: any[]
  } = { deps: DEFAULT_DEPS }
) => {
  const { style } = useElementRect(element, options)
  return { style }
}

export const useWidgetDrop = ({ widgetId, slotName }: { widgetId: string, slotName: string }) => {
  const widgetFactory = useContext(WidgetFactoryContext)
  const widget = useRecoilValue(widgetSelector(widgetId))
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

      if (Reflect.has(widgetMetadata.metadata.slots, slotName) && isArray(widget.slots?.[slotName])) {
        addWidget({
          sourceWidget: item.widget,
          targetWidgetId: widget.widgetId,
          targetSlotName: slotName,
          targetPosition: widget.slots[slotName].length
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
  // FIXME element 有可能会重复
  const elementSelector = `[data-widget-id=${widgetId}]${slotName ? `[data-widget-slot-name=${slotName}]` : ''}`
  const element = document.querySelector(elementSelector) as HTMLElement
  drop(element)
  const isActive = canDrop && isOverCurrent

  const isEmptyChildren = !!slotName && isEmpty(widget.slots[slotName])

  useWidgetBgColor({
    isActive,
    element
  })
  useWidgetMinHeight({
    canSetMinHeight: isEmptyChildren,
    element
  })

  const { style } = useWidgetPosition(element, {
    deps: [widget]
  })
  return {
    style,
    showIndicator: isEmptyChildren,
    widget,
    element,
    isActive
  }
}
