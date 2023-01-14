import produce from 'immer'
import { isObject } from 'lodash'
import { useCallback } from 'react'

import { useCanvasDesignerFile } from '../contexts/CanvasDesignerFileContext'

export const useMoveWidget = () => {
  const { canvasDesignerFile } = useCanvasDesignerFile()
  const widgetRelationByWidgetId = canvasDesignerFile.widgetRelationById
  const moveWidget = useCallback(
    ({
      sourceWidgetId,
      targetPosition,
      targetSlotPath,
      targetWidgetId,
    }: {
      sourceWidgetId: string
      targetWidgetId: string
      targetSlotPath: string
      targetPosition: number
    }) => {
      canvasDesignerFile.updateWidgets(
        produce((draft) => {
          let sourceIndex = -1
          draft.forEach((widget) => {
            // 删除
            if (isObject(widget.meta.slots)) {
              Object.keys(widget.meta.slots).forEach((slotPath) => {
                if (sourceIndex !== -1) {
                  return
                }
                sourceIndex = widget.meta.slots[slotPath].findIndex(
                  (slotWidgetId) => slotWidgetId === sourceWidgetId,
                )
                if (sourceIndex !== -1) {
                  widget.meta.slots[slotPath].splice(sourceIndex, 1)
                }
              })
            }
            // 添加
            if (widget.meta.id === targetWidgetId) {
              // 如果是同一个parent的同一个slot内移动
              const isSameParentSlot =
                widgetRelationByWidgetId[sourceWidgetId]?.parent?.props.id ===
                  targetWidgetId &&
                widgetRelationByWidgetId[sourceWidgetId].slotPath ===
                  targetSlotPath
              if (isSameParentSlot) {
                widget.meta.slots[targetSlotPath].splice(
                  sourceIndex < targetPosition
                    ? targetPosition - 1
                    : targetPosition,
                  0,
                  sourceWidgetId,
                )
              } else {
                widget.meta.slots[targetSlotPath].splice(
                  targetPosition,
                  0,
                  sourceWidgetId,
                )
              }
            }
          })
        }),
      )
    },
    [canvasDesignerFile, widgetRelationByWidgetId],
  )
  return {
    moveWidget,
  }
}
