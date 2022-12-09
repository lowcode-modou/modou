import { isEmpty } from 'lodash'
import { useContext, useEffect, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'
import { match } from 'ts-pattern'

import { AppFactoryContext, WidgetBaseProps } from '@modou/core'

import {
  DropIndicator,
  DropIndicatorInsertPositionEnum,
  DropIndicatorPositionEnum,
  WidgetRelationByWidgetId,
  dropIndicatorAtom,
  widgetRelationByWidgetIdSelector,
  widgetSelector,
} from '../store'
import { WidgetDragType } from '../types'
import { useAddWidget } from './useAddWidget'
import { useMoveWidget } from './useMoveWidget'

const EMPTY_WIDGET_MIN_HEIGHT = '36px'
const DROP_CONTAINER_LIMIT = 6
const DROP_ELEMENT_ACTIVE_BG_COLOR = 'rgba(0,0,0,.1)'

const useWidgetBgColor = ({
  isActive,
  element,
  isContainer,
}: {
  isActive: boolean
  isContainer: boolean
  element: HTMLElement
}) => {
  const dropIndicator = useRecoilValue(dropIndicatorAtom)

  const elementBgColor = useRef<{
    initialized: boolean
    value: string
  }>({
    initialized: false,
    value: '',
  })
  useEffect(() => {
    if (!isContainer) {
      return
    }
    if (!elementBgColor.current.initialized) {
      elementBgColor.current = {
        value: getComputedStyle(element).backgroundColor,
        initialized: true,
      }
    }
    if (isActive && !dropIndicator.show) {
      element.style.backgroundColor = DROP_ELEMENT_ACTIVE_BG_COLOR
    } else {
      element.style.backgroundColor = elementBgColor.current.value
    }
  }, [dropIndicator.show, element, element.style, isActive, isContainer])
}

const useWidgetMinHeight = ({
  canSetMinHeight,
  element,
}: {
  canSetMinHeight: boolean
  element: HTMLElement
}) => {
  const elementMinHeight = useRef<{
    initialized: boolean
    value?: string
  }>({
    initialized: false,
  })

  useEffect(() => {
    if (!elementMinHeight.current.initialized) {
      elementMinHeight.current = {
        value: getComputedStyle(element).minHeight,
        initialized: true,
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

// const DEFAULT_DEPS: any[] = []
// const useWidgetPosition = (
//   element: HTMLElement,
//   options: {
//     deps?: any[]
//   } = { deps: DEFAULT_DEPS }
// ) => {
//   const { style } = useElementRect(element, options)
//   return { style }
// }

export const useWidgetDrop = ({
  widgetId,
  slotPath,
  element,
}: {
  widgetId: string
  slotPath: string
  element: HTMLElement
}) => {
  const widgetFactory = useContext(AppFactoryContext)
  const widget = useRecoilValue(widgetSelector(widgetId))

  const { addWidget } = useAddWidget()
  const { moveWidget } = useMoveWidget()

  const isEmptySlot = !!slotPath && isEmpty(widget.slots[slotPath])
  const setDropIndicator = useSetRecoilState(dropIndicatorAtom)

  const getDropIndicator = useRecoilCallback<readonly unknown[], DropIndicator>(
    ({ snapshot }) =>
      () => {
        return snapshot.getLoadable(dropIndicatorAtom).contents
      },
    [],
  )
  const getWidgetRelationByWidgetId = useRecoilCallback<
    readonly unknown[],
    WidgetRelationByWidgetId
  >(
    ({ snapshot }) =>
      () => {
        return snapshot.getLoadable(widgetRelationByWidgetIdSelector).contents
      },
    [],
  )

  // // // TODO 查看 react-dnd 为什么能自动推断参数类型
  const [{ canDrop, isOverCurrent }, drop] = useDrop<
    {
      widget: WidgetBaseProps
      type: WidgetDragType
    },
    {
      widget: WidgetBaseProps
    },
    {
      isOver: boolean
      canDrop: boolean
      isOverCurrent: boolean
    }
  >(
    () => ({
      accept: Object.keys(widgetFactory.widgetByType),
      // canDrop: (item) => {
      //   return item.widget.widgetId !== widgetId
      // },
      drop: (item, monitor) => {
        const didDrop = monitor.didDrop()
        if (didDrop) {
          return
        }
        // const widgetMetadata = widgetFactory.widgetByType[widget.widgetType]

        const dropIndicator = getDropIndicator()
        const widgetRelationByWidgetId = getWidgetRelationByWidgetId()
        const { parent, slotPath: parentSlotPath } =
          widgetRelationByWidgetId[widget.id]
        if (item.type === WidgetDragType.Move) {
          switch (dropIndicator.insertPosition) {
            case DropIndicatorInsertPositionEnum.Before:
              if (parent && parentSlotPath) {
                moveWidget({
                  sourceWidgetId: item.widget.id,
                  targetWidgetId: parent.props.id,
                  targetSlotName: parentSlotPath,
                  targetPosition: parent.props.slots[parentSlotPath].findIndex(
                    (widgetId) => widget.id === widgetId,
                  ),
                })
              }
              break
            case DropIndicatorInsertPositionEnum.After:
              if (parent && parentSlotPath) {
                moveWidget({
                  sourceWidgetId: item.widget.id,
                  targetWidgetId: parent.props.id,
                  targetSlotName: parentSlotPath,
                  targetPosition:
                    parent.props.slots[parentSlotPath].findIndex(
                      (widgetId) => widget.id === widgetId,
                    ) + 1,
                })
              }
              break
            case DropIndicatorInsertPositionEnum.Inner:
              moveWidget({
                sourceWidgetId: item.widget.id,
                targetWidgetId: widget.id,
                targetSlotName: slotPath,
                targetPosition: widget.slots[slotPath].length,
              })
              break
            default:
          }
        } else {
          switch (dropIndicator.insertPosition) {
            case DropIndicatorInsertPositionEnum.Before:
              if (parent && parentSlotPath) {
                addWidget({
                  sourceWidget: item.widget,
                  targetWidgetId: parent.props.id,
                  targetSlotName: parentSlotPath,
                  targetPosition: parent.props.slots[parentSlotPath].findIndex(
                    (widgetId) => widget.id === widgetId,
                  ),
                })
              }
              break
            case DropIndicatorInsertPositionEnum.After:
              if (parent && parentSlotPath) {
                addWidget({
                  sourceWidget: item.widget,
                  targetWidgetId: parent.props.id,
                  targetSlotName: parentSlotPath,
                  targetPosition:
                    parent.props.slots[parentSlotPath].findIndex(
                      (widgetId) => widget.id === widgetId,
                    ) + 1,
                })
              }
              break
            case DropIndicatorInsertPositionEnum.Inner:
              addWidget({
                sourceWidget: item.widget,
                targetWidgetId: widget.id,
                targetSlotName: slotPath,
                targetPosition: widget.slots[slotPath].length,
              })
              break
            default:
          }
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
        if (!clientOffset) {
          return
        }
        const relativeOffset = {
          x: clientOffset.x - dropElementRect.x,
          y: clientOffset.y - dropElementRect.y,
        }
        const isBlockWidget =
          element.offsetWidth === element.parentElement?.clientWidth

        const inVerticalLimit =
          relativeOffset.y <= DROP_CONTAINER_LIMIT ||
          dropElementRect.height - relativeOffset.y < DROP_CONTAINER_LIMIT

        const inHorizontalLimit =
          relativeOffset.x <= DROP_CONTAINER_LIMIT ||
          dropElementRect.width - relativeOffset.x < DROP_CONTAINER_LIMIT

        const afterVertical = relativeOffset.y * 2 > dropElementRect.height
        const afterHorizontal = relativeOffset.x * 2 > dropElementRect.width
        const dropPosition: DropIndicatorInsertPositionEnum =
          afterVertical || afterHorizontal
            ? DropIndicatorInsertPositionEnum.After
            : DropIndicatorInsertPositionEnum.Before

        const insertPosition: DropIndicatorInsertPositionEnum = match<
          boolean,
          DropIndicatorInsertPositionEnum
        >(!!slotPath)
          .with(true, () => {
            if (inHorizontalLimit || inVerticalLimit) {
              return dropPosition
            }
            return DropIndicatorInsertPositionEnum.Inner
          })
          .with(false, () => dropPosition)
          .exhaustive()

        const dropIndicator = match<boolean, DropIndicator>(isBlockWidget)
          .with(true, () => {
            return {
              position: afterVertical
                ? DropIndicatorPositionEnum.Bottom
                : DropIndicatorPositionEnum.Top,
              show: slotPath ? inVerticalLimit : true,
              insertPosition,
            }
          })
          .with(false, () => {
            return {
              position: afterHorizontal
                ? DropIndicatorPositionEnum.Right
                : DropIndicatorPositionEnum.Left,
              show: slotPath ? inHorizontalLimit : true,
              insertPosition,
            }
          })
          .exhaustive()
        setDropIndicator(dropIndicator)
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [
      addWidget,
      element,
      getDropIndicator,
      getWidgetRelationByWidgetId,
      moveWidget,
      setDropIndicator,
      slotPath,
      widget,
      widgetFactory.widgetByType,
    ],
  )

  drop(element)

  const isActive = canDrop && isOverCurrent

  useWidgetBgColor({
    isActive,
    element,
    isContainer: !!slotPath,
  })
  useWidgetMinHeight({
    canSetMinHeight: isEmptySlot,
    element,
  })

  // const { style } = useWidgetPosition(element, {
  //   deps: [widget]
  // })
  return {
    // style,
    isEmptySlot,
    widget,
    isActive,
  }
}
