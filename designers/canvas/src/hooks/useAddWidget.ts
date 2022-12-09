import produce from 'immer'
import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { WidgetBaseProps } from '@modou/core'

import { widgetsSelector } from '../store'

export const useAddWidget = () => {
  const setWidgets = useSetRecoilState(widgetsSelector)
  const addWidget = useCallback(
    ({
      sourceWidget,
      targetWidgetId,
      targetPosition,
      targetSlotPath,
    }: {
      sourceWidget: WidgetBaseProps
      targetWidgetId: string
      targetPosition: number
      targetSlotPath: string
    }) => {
      setWidgets(
        produce((draft) => {
          const targetWidget = draft.find(
            (widget) => widget.id === targetWidgetId,
          )
          if (!targetWidget) {
            return
          }
          draft.push(sourceWidget)
          targetWidget.slots[targetSlotPath].splice(
            targetPosition,
            0,
            sourceWidget.id,
          )
          // targetWidget.slots[targetSlotPath].splice(0, 1)
        }),
      )
    },
    [setWidgets],
  )

  return {
    addWidget,
  }
}
