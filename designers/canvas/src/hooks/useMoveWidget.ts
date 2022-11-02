import produce from 'immer'
import { isObject } from 'lodash'
import { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { widgetRelationByWidgetIdSelector, widgetsSelector } from '../store'

export const useMoveWidget = () => {
  const setWidgets = useSetRecoilState(widgetsSelector)
  const widgetRelationByWidgetId = useRecoilValue(
    widgetRelationByWidgetIdSelector,
  )
  const moveWidget = useCallback(
    ({
      sourceWidgetId,
      targetPosition,
      targetSlotName,
      targetWidgetId,
    }: {
      sourceWidgetId: string
      targetWidgetId: string
      targetSlotName: string
      targetPosition: number
    }) => {
      setWidgets(
        produce((draft) => {
          let sourceIndex = -1
          draft.forEach((widget) => {
            // 删除
            if (isObject(widget.slots)) {
              Object.keys(widget.slots).forEach((slotName) => {
                if (sourceIndex !== -1) {
                  return
                }
                sourceIndex = widget.slots[slotName].findIndex(
                  (slotWidgetId) => slotWidgetId === sourceWidgetId,
                )
                if (sourceIndex !== -1) {
                  widget.slots[slotName].splice(sourceIndex, 1)
                }
              })
            }
            // 添加
            if (widget.id === targetWidgetId) {
              // 如果是同一个parent的同一个slot内移动
              const isSameParentSlot =
                widgetRelationByWidgetId[sourceWidgetId]?.parent?.props.id ===
                  targetWidgetId &&
                widgetRelationByWidgetId[sourceWidgetId].slotName ===
                  targetSlotName
              if (isSameParentSlot) {
                widget.slots[targetSlotName].splice(
                  sourceIndex < targetPosition
                    ? targetPosition - 1
                    : targetPosition,
                  0,
                  sourceWidgetId,
                )
              } else {
                widget.slots[targetSlotName].splice(
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
    [setWidgets, widgetRelationByWidgetId],
  )
  return {
    moveWidget,
  }
}
