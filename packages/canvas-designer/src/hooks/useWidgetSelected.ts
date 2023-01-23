import { useEventListener } from 'ahooks'
import { RefObject } from 'react'

import { useCanvasDesignerStore } from '../contexts/CanvasDesignerStoreContext'
import { getSlotRawElement, getWidgetIdFromElement } from '../utils'

export const useWidgetSelected = (canvasRef: RefObject<HTMLElement>) => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  // TODO 由 select id 驱动 style
  useEventListener(
    'click',
    (event: MouseEvent) => {
      const rawElement = getSlotRawElement(
        event.target as unknown as HTMLElement,
        canvasRef.current,
      )
      // FIXME 下面代码解决 ProFormText 相同name点击事件会触发多次的问题
      if (event.offsetY < 0 || event.offsetX < 0) {
        return
      }
      const selectedWidgetId = getWidgetIdFromElement(rawElement as HTMLElement)
      canvasDesignerStore.setSelectedWidgetId(selectedWidgetId)
    },
    {
      target: canvasRef,
    },
  )
}
