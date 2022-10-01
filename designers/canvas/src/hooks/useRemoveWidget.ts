import { useSetRecoilState } from 'recoil'
import { widgetsAtom } from '../store'
import { useCallback } from 'react'
import { isEmpty, isObject } from 'lodash'
import produce from 'immer'
import { WidgetBaseProps } from '@modou/core'

export const useRemoveWidget = () => {
  const setWidgets = useSetRecoilState(widgetsAtom)
  const removeWidget = useCallback((widgetId: string, deleteRaw: boolean = true) => {
    setWidgets(produce(draft => {
      draft
        .forEach(widget => {
          if (isObject(widget.slots)) {
            Object.keys(widget.slots).forEach(slotName => {
              const deletedIndex = widget.slots[slotName].findIndex(slotWidgetId => slotWidgetId === widgetId)
              if (deletedIndex !== -1) {
                widget.slots[slotName].splice(deletedIndex, 1)
              }
            })
          }
        })
      const deletedWidgetIds: string[] = [widgetId]
      const deletedWidgets: WidgetBaseProps[] = [draft.find(widget => widget.widgetId === widgetId) as WidgetBaseProps]
      while (!isEmpty(deletedWidgets)) {
        const currentDeletedWidget = deletedWidgets.shift() as WidgetBaseProps
        if (isObject(currentDeletedWidget.slots)) {
          Object.values(currentDeletedWidget.slots).forEach(widgetIds => {
            widgetIds.forEach(slotWidgetId => {
              deletedWidgetIds.push(slotWidgetId)
              deletedWidgets.push(draft.find(widget => widget.widgetId === slotWidgetId) as WidgetBaseProps)
            })
          })
        }
      }
      deletedWidgetIds.forEach(deletedWidgetId => {
        const deletedIndex = draft.findIndex(widget => widget.widgetId === deletedWidgetId)
        if (deletedIndex !== -1) {
          draft.splice(deletedIndex, 1)
        }
      })
    }))
  }, [setWidgets])
  return {
    removeWidget
  }
}
