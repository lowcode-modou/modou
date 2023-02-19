import { useMemoizedFn } from 'ahooks'
import { isEmpty } from 'lodash'
import { useContext, useEffect, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { match } from 'ts-pattern'

import { AppFactoryContext } from '@modou/asset-vfs'
import { WidgetFileMeta } from '@modou/meta-vfs'

import { useCanvasDesignerFile } from '../contexts/CanvasDesignerFileContext'
import { useCanvasDesignerStore } from '../contexts/CanvasDesignerStoreContext'
import { emitter } from '../event-bus'
import {
  DropIndicator,
  DropIndicatorInsertPositionEnum,
  DropIndicatorPositionEnum,
} from '../store'
import { WidgetDragType } from '../types'

const EMPTY_WIDGET_MIN_HEIGHT = '36px'
// const DROP_CONTAINER_LIMIT = 6
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
  const { canvasDesignerStore } = useCanvasDesignerStore()

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
    if (isActive && !canvasDesignerStore.dropIndicator.show) {
      element.style.backgroundColor = DROP_ELEMENT_ACTIVE_BG_COLOR
    } else {
      element.style.backgroundColor = elementBgColor.current.value
    }
  }, [
    canvasDesignerStore.dropIndicator.show,
    element,
    element.style,
    isActive,
    isContainer,
  ])
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

enum DropType {
  Slot,
  Widget,
}

export const useWidgetDrop = ({
  widgetId,
  slotPath,
  element,
}: {
  widgetId: string
  slotPath: string
  element: HTMLElement
}) => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  const { canvasDesignerFile } = useCanvasDesignerFile()
  // 如果有slotPath 则是插槽，没有是普通组件
  // 插槽只能放置内部
  // 普通组件只能放置兄弟节点
  const dropType: DropType = slotPath ? DropType.Slot : DropType.Widget
  const widgetFactory = useContext(AppFactoryContext)
  const widget = canvasDesignerFile.widgetMap[widgetId]!

  const isEmptySlot = !!slotPath && isEmpty(widget.slots[slotPath])

  const getDropIndicator = useMemoizedFn(() => {
    return canvasDesignerStore.dropIndicator
  })
  const getWidgetRelationByWidgetId = useMemoizedFn(() => {
    return canvasDesignerFile.widgetRelationById
  })

  // // // TODO 查看 react-dnd 为什么能自动推断参数类型
  const [{ canDrop, isOverCurrent }, drop] = useDrop<
    {
      widget: WidgetFileMeta
      type: WidgetDragType
    },
    {
      widget: WidgetFileMeta
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
          widgetRelationByWidgetId[widget.meta.id]
        if (item.type === WidgetDragType.Move) {
          switch (dropIndicator.insertPosition) {
            case DropIndicatorInsertPositionEnum.Before:
              if (dropType === DropType.Widget && parent && parentSlotPath) {
                canvasDesignerFile.moveWidget({
                  sourceWidgetId: item.widget.id,
                  targetWidgetId: parent.props.id,
                  targetSlotPath: parentSlotPath,
                  targetPosition: parent.file.slots[parentSlotPath].findIndex(
                    (widgetId) => widget.meta.id === widgetId,
                  ),
                })
              }
              break
            case DropIndicatorInsertPositionEnum.After:
              if (dropType === DropType.Widget && parent && parentSlotPath) {
                canvasDesignerFile.moveWidget({
                  sourceWidgetId: item.widget.id,
                  targetWidgetId: parent.props.id,
                  targetSlotPath: parentSlotPath,
                  targetPosition: parent.file.slots[parentSlotPath].findIndex(
                    (widgetId) => widget.meta.id === widgetId,
                  ),
                })
              }
              break
            case DropIndicatorInsertPositionEnum.Inner:
              canvasDesignerFile.moveWidget({
                sourceWidgetId: item.widget.id,
                targetWidgetId: widget.meta.id,
                targetSlotPath: slotPath,
                targetPosition: widget.slots[slotPath].length,
              })
              break
            default:
          }
        } else {
          switch (dropIndicator.insertPosition) {
            case DropIndicatorInsertPositionEnum.Before:
              if (dropType === DropType.Widget && parent && parentSlotPath) {
                canvasDesignerFile.addWidget({
                  sourceWidgetMeta: item.widget,
                  targetWidgetId: parent.props.id,
                  targetSlotPath: parentSlotPath,
                  targetPosition: parent.file.slots[parentSlotPath].findIndex(
                    (widgetId) => widget.meta.id === widgetId,
                  ),
                })
              }
              break
            case DropIndicatorInsertPositionEnum.After:
              if (dropType === DropType.Widget && parent && parentSlotPath) {
                canvasDesignerFile.addWidget({
                  sourceWidgetMeta: item.widget,
                  targetWidgetId: parent.props.id,
                  targetSlotPath: parentSlotPath,
                  targetPosition:
                    parent.file.slots[parentSlotPath].findIndex(
                      (widgetId) => widget.meta.id === widgetId,
                    ) + 1,
                })
              }
              break
            case DropIndicatorInsertPositionEnum.Inner:
              canvasDesignerFile.addWidget({
                sourceWidgetMeta: item.widget,
                targetWidgetId: widget.meta.id,
                targetSlotPath: slotPath,
                targetPosition: widget.slots[slotPath].length,
              })
              break
            default:
          }
        }
        setTimeout(() => {
          emitter.emit('onWidgetElementChange')
        })

        return { widget: widget.meta }
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

        // const inVerticalLimit =
        //   relativeOffset.y <= DROP_CONTAINER_LIMIT ||
        //   dropElementRect.height - relativeOffset.y < DROP_CONTAINER_LIMIT
        //
        // const inHorizontalLimit =
        //   relativeOffset.x <= DROP_CONTAINER_LIMIT ||
        //   dropElementRect.width - relativeOffset.x < DROP_CONTAINER_LIMIT

        const afterVertical = relativeOffset.y * 2 > dropElementRect.height
        const afterHorizontal = relativeOffset.x * 2 > dropElementRect.width
        const dropPosition: DropIndicatorInsertPositionEnum =
          afterVertical || afterHorizontal
            ? DropIndicatorInsertPositionEnum.After
            : DropIndicatorInsertPositionEnum.Before

        const insertPosition: DropIndicatorInsertPositionEnum = match<
          DropType,
          DropIndicatorInsertPositionEnum
        >(dropType)
          .with(DropType.Slot, () => {
            // if (inHorizontalLimit || inVerticalLimit) {
            //   return dropPosition
            // }
            return DropIndicatorInsertPositionEnum.Inner
          })
          .with(DropType.Widget, () => dropPosition)
          .run()

        const dropIndicator = match<boolean, DropIndicator>(isBlockWidget)
          .with(true, () => {
            return {
              position: afterVertical
                ? DropIndicatorPositionEnum.Bottom
                : DropIndicatorPositionEnum.Top,
              // show: slotPath ? inVerticalLimit : true,
              show: dropType === DropType.Widget,
              insertPosition,
            }
          })
          .with(false, () => {
            return {
              position: afterHorizontal
                ? DropIndicatorPositionEnum.Right
                : DropIndicatorPositionEnum.Left,
              // show: slotPath ? inHorizontalLimit : true,
              show: dropType === DropType.Widget,
              insertPosition,
            }
          })
          .exhaustive()
        canvasDesignerStore.setDropIndicator(dropIndicator)
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [
      canvasDesignerFile,
      canvasDesignerStore,
      dropType,
      element,
      getDropIndicator,
      getWidgetRelationByWidgetId,
      slotPath,
      widget.meta,
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
