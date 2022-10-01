import { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { widgetRelationByWidgetIdSelector, widgetsAtom } from '../store'
import produce from 'immer'
import { isObject } from 'lodash'

export const useMoveWidget = () => {
  const setWidgets = useSetRecoilState(widgetsAtom)
  const widgetRelationByWidgetId = useRecoilValue(widgetRelationByWidgetIdSelector)
  const moveWidget = useCallback(({
    sourceWidgetId,
    targetPosition,
    targetSlotName,
    targetWidgetId
  }: {
    sourceWidgetId: string
    targetWidgetId: string
    targetSlotName: string
    targetPosition: number
  }) => {
    setWidgets(produce(draft => {
      draft.forEach(widget => {
        if (isObject(widget.slots)) {
          Object.keys(widget.slots).forEach(slotName => {
            const index = widget.slots[slotName]
              .findIndex(slotWidgetId => slotWidgetId === sourceWidgetId)
            if (index !== -1) {
              widget.slots[slotName].splice(index, 1)
            }
          })
        }
        if (widget.widgetId === targetWidgetId) {
          if (widgetRelationByWidgetId[sourceWidgetId]?.parent?.props.widgetId === targetWidgetId &&
            widgetRelationByWidgetId[sourceWidgetId].slotName === targetSlotName) {
            const sourceIndex = widget.slots[targetSlotName]
              .findIndex(slotWidgetId => slotWidgetId === sourceWidgetId)
            widget.slots[targetSlotName]
              .splice(sourceIndex < targetPosition ? targetPosition - 1 : targetPosition, 0, sourceWidgetId)
          } else {
            widget.slots[targetSlotName].splice(targetPosition, 0, sourceWidgetId)
          }
        }
      })
    }))
  }, [setWidgets])
  return {
    moveWidget
  }
}
