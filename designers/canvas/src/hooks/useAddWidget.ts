import { useSetRecoilState } from 'recoil'
import { widgetsSelector } from '../store'
import { WidgetBaseProps } from '@modou/core'
import produce from 'immer'
import { useCallback } from 'react'

export const useAddWidget = () => {
  const setWidgets = useSetRecoilState(widgetsSelector)
  const addWidget = useCallback(
    ({
      sourceWidget,
      targetWidgetId,
      targetPosition,
      targetSlotName,
    }: {
      sourceWidget: WidgetBaseProps
      targetWidgetId: string
      targetPosition: number
      targetSlotName: string
    }) => {
      setWidgets(
        produce((draft) => {
          const targetWidget = draft.find(
            (widget) => widget.widgetId === targetWidgetId,
          )
          if (!targetWidget) {
            return
          }
          draft.push(sourceWidget)
          targetWidget.slots[targetSlotName].splice(
            targetPosition,
            0,
            sourceWidget.widgetId,
          )
          // targetWidget.slots[targetSlotName].splice(0, 1)
        }),
      )
    },
    [setWidgets],
  )

  return {
    addWidget,
  }
}
