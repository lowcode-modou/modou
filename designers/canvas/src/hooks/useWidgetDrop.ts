import { useDrop } from 'react-dnd'
import { WidgetBaseProps, WidgetFactoryContext } from '@modou/core'
import { isArray, isEmpty } from 'lodash'
import { useContext, useEffect, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { widgetSelector } from '@modou/render/src/store'
import { useAddWidget } from './useAddWidget'
import { useElementRect } from './useElementRect'
import { dropIndicatorAtom, DropIndicatorPositionEnum } from '../store'
import { match } from 'ts-pattern'

const EMPTY_WIDGET_MIN_HEIGHT = '36px'
const DROP_CONTAINER_LIMIT = 6

const useWidgetBgColor = ({
  isActive,
  element,
  isContainer
}: {
  isActive: boolean
  isContainer: boolean
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
    if (!isContainer) {
      return
    }
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
  }, [element, element.style, isActive, isContainer])
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
  // FIXME element 有可能会重复
  const elementSelector = `[data-widget-id=${widgetId}]${slotName ? `[data-widget-slot-name=${slotName}]` : ''}`
  const element = document.querySelector(elementSelector) as HTMLElement
  const isEmptySlot = !!slotName && isEmpty(widget.slots[slotName])
  const setDropIndicator = useSetRecoilState(dropIndicatorAtom)

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
    hover: (item, monitor) => {
      const didHover = monitor.isOver({ shallow: true })
      if (!didHover) {
        return
      }
      const dropElementRect = element.getClientRects()[0]
      const clientOffset = monitor.getClientOffset() ?? { x: 0, y: 0 }
      const relativeOffset = {
        x: clientOffset.x - dropElementRect.x,
        y: clientOffset.y - dropElementRect.y
      }
      const isBlockWidget = element.offsetWidth === element.parentElement?.clientWidth

      const dropIndicator = match<boolean, {
        position: DropIndicatorPositionEnum
        show: boolean
      }>(isBlockWidget)
        .with(true, () => {
          const show = slotName
            ? (relativeOffset.y <= DROP_CONTAINER_LIMIT) ||
            ((dropElementRect.height - relativeOffset.y) < DROP_CONTAINER_LIMIT)
            : true
          if (relativeOffset.y * 2 > dropElementRect.height) {
            return {
              position: DropIndicatorPositionEnum.Bottom,
              show
            }
          }
          return {
            position: DropIndicatorPositionEnum.Top,
            show
          }
        })
        .with(false, () => {
          const show = slotName
            ? (relativeOffset.x <= DROP_CONTAINER_LIMIT) ||
            ((dropElementRect.width - relativeOffset.x) < DROP_CONTAINER_LIMIT)
            : true
          if (relativeOffset.x * 2 > dropElementRect.width) {
            return {
              position: DropIndicatorPositionEnum.Right,
              show
            }
          }
          return {
            position: DropIndicatorPositionEnum.Left,
            show
          }
        }).exhaustive()
      setDropIndicator(dropIndicator)
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  }))
  drop(element)

  const isActive = canDrop && isOverCurrent

  useWidgetBgColor({
    isActive,
    element,
    isContainer: !!slotName
  })
  useWidgetMinHeight({
    canSetMinHeight: isEmptySlot,
    element
  })

  const { style } = useWidgetPosition(element, {
    deps: [widget]
  })
  return {
    style,
    isEmptySlot,
    widget,
    element,
    isActive
  }
}
