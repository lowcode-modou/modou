import { useSetRecoilState } from 'recoil'
import { widgetsAtom } from '../store'
import { WidgetBaseProps } from '@modou/core'
import produce from 'immer'
import { useCallback } from 'react'

export const useAddWidget = () => {
  const setWidgets = useSetRecoilState(widgetsAtom)
  const addWidget = useCallback(({
    sourceWidget,
    targetWidgetId,
    targetPosition,
    targetSlotName = 'children'
  }: {
    sourceWidget: WidgetBaseProps
    targetWidgetId: string
    targetPosition: number
    targetSlotName?: string
  }) => {
    setWidgets(produce(draft => {
      const targetWidget = draft.find(widget => widget.widgetId === targetWidgetId)
      if (!targetWidget) {
        return
      }
      draft.push(sourceWidget)
      targetWidget.slots[targetSlotName].splice(targetPosition, 0, sourceWidget.widgetId)
      // targetWidget.slots[targetSlotName].splice(0, 1)
    }))
  }, [setWidgets])

  return {
    addWidget
  }
}
