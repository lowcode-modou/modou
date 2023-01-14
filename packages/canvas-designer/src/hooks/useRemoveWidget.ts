import produce from 'immer'
import { isEmpty, isObject } from 'lodash'
import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { WidgetBaseProps } from '@modou/core'

export const useRemoveWidget = () => {
  const removeWidget = useCallback(
    (widgetId: string, deleteRaw: boolean = true) => {
      setWidgets(
        produce((draft) => {
          draft.forEach((widget) => {
            if (isObject(widget.slots)) {
              Object.keys(widget.slots).forEach((slotPath) => {
                const deletedIndex = widget.slots[slotPath].findIndex(
                  (slotWidgetId) => slotWidgetId === widgetId,
                )
                if (deletedIndex !== -1) {
                  widget.slots[slotPath].splice(deletedIndex, 1)
                }
              })
            }
          })
          const deletedWidgetIds: string[] = [widgetId]
          const deletedWidgets: WidgetBaseProps[] = [
            draft.find((widget) => widget.id === widgetId) as WidgetBaseProps,
          ]
          while (!isEmpty(deletedWidgets)) {
            const currentDeletedWidget =
              deletedWidgets.shift() as WidgetBaseProps
            if (isObject(currentDeletedWidget.slots)) {
              Object.values(currentDeletedWidget.slots).forEach((widgetIds) => {
                widgetIds.forEach((slotWidgetId) => {
                  deletedWidgetIds.push(slotWidgetId)
                  deletedWidgets.push(
                    draft.find(
                      (widget) => widget.id === slotWidgetId,
                    ) as WidgetBaseProps,
                  )
                })
              })
            }
          }
          deletedWidgetIds.forEach((deletedWidgetId) => {
            const deletedIndex = draft.findIndex(
              (widget) => widget.id === deletedWidgetId,
            )
            if (deletedIndex !== -1) {
              draft.splice(deletedIndex, 1)
            }
          })
        }),
      )
    },
    [setWidgets],
  )
  return {
    removeWidget,
  }
}
