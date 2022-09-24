import { CSSProperties, RefObject, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { selectedWidgetIdAtom } from '../store'
import { useEventListener } from 'ahooks'
import { getRawElement, getWidgetIdFromElement } from '../utils'

export const useWidgetSelected = (canvasRef: RefObject<HTMLElement>) => {
  const setSelectedWidgetId = useSetRecoilState(selectedWidgetIdAtom)

  const [selectedElementRect, setSelectedElementRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })
  const [display, setDisplay] = useState(false)

  useEventListener('click', (event) => {
    const rawElement = getRawElement(event.target as unknown as HTMLElement, canvasRef.current)
    if (rawElement) {
      // TODO 可能有多个累加计算位置的情况
      const rect = rawElement.getClientRects()[0]
      setSelectedElementRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      })
      setDisplay(true)
    } else {
      setSelectedElementRect({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      })
      setDisplay(false)
    }
    const selectedWidgetId = getWidgetIdFromElement(rawElement as HTMLElement)
    setSelectedWidgetId(selectedWidgetId)
  }, {
    target: canvasRef
  })
  const style: CSSProperties = {
    width: `${selectedElementRect.width ?? 0}px`,
    height: `${selectedElementRect.height ?? 0}px`,
    left: `${selectedElementRect.x ?? 0}px`,
    top: `${selectedElementRect.y ?? 0}px`,
    display: display ? 'block' : 'none'
  }
  return {
    style
  }
}
