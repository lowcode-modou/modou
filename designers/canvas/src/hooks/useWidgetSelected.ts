import { RefObject } from 'react'
import { useSetRecoilState } from 'recoil'
import { selectedWidgetIdAtom } from '../store'
import { useEventListener } from 'ahooks'
import { getRawElement, getWidgetIdFromElement } from '../utils'

export const useWidgetSelected = (canvasRef: RefObject<HTMLElement>) => {
  const setSelectedWidgetId = useSetRecoilState(selectedWidgetIdAtom)

  // TODO 由 select id 驱动 style
  useEventListener('click', (event) => {
    const rawElement = getRawElement(event.target as unknown as HTMLElement, canvasRef.current)
    const selectedWidgetId = getWidgetIdFromElement(rawElement as HTMLElement)
    setSelectedWidgetId(selectedWidgetId)
  }, {
    target: canvasRef
  })
}
