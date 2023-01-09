import { useEventListener } from 'ahooks'
import { RefObject } from 'react'
import { useSetRecoilState } from 'recoil'

import { selectedWidgetIdAtom } from '../store'
import { getSlotRawElement, getWidgetIdFromElement } from '../utils'

export const useWidgetSelected = (canvasRef: RefObject<HTMLElement>) => {
  // TODO 由 select id 驱动 style
  useEventListener(
    'click',
    (event) => {
      const rawElement = getSlotRawElement(
        event.target as unknown as HTMLElement,
        canvasRef.current,
      )
      const selectedWidgetId = getWidgetIdFromElement(rawElement as HTMLElement)
      setSelectedWidgetId(selectedWidgetId)
    },
    {
      target: canvasRef,
    },
  )
}
