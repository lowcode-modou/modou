import { useEventListener } from 'ahooks'
import { RefObject } from 'react'

import { useCanvasDesignerStore } from '../contexts/CanvasDesignerStoreContext'
import { getSlotRawElement, getWidgetIdFromElement } from '../utils'

export const useWidgetSelected = (canvasRef: RefObject<HTMLElement>) => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  // TODO 由 select id 驱动 style
  useEventListener(
    'click',
    (event) => {
      const rawElement = getSlotRawElement(
        event.target as unknown as HTMLElement,
        canvasRef.current,
      )
      const selectedWidgetId = getWidgetIdFromElement(rawElement as HTMLElement)
      canvasDesignerStore.setSelectedWidgetId(selectedWidgetId)
    },
    {
      target: canvasRef,
    },
  )
}
