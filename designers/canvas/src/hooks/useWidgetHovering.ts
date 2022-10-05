import { CSSProperties, RefObject, useState } from 'react'
import { useEventListener } from 'ahooks'
import { getRawElement } from '../utils'

export const useWidgetHovering = (canvasRef: RefObject<HTMLElement>) => {
  const [hoveringElementRect, setHoveringElementRect] = useState<{
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

  useEventListener('mousemove', () => {
    setDisplay(false)
  }, {
    target: document.body,
    capture: true,
    passive: true
  })
  useEventListener('mousemove', (event) => {
    // TODO 看是否需要防抖
    const rawElement = getRawElement(event.target as unknown as HTMLElement, canvasRef.current)
    if (rawElement) {
      // TODO 可能有多个累加计算位置的情况
      const rect = rawElement.getClientRects()[0]
      setHoveringElementRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      })
      setDisplay(true)
    } else {
      setHoveringElementRect({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      })
      setDisplay(false)
    }
  }, {
    target: canvasRef,
    passive: true
  })

  const style: CSSProperties = {
    width: `${hoveringElementRect.width ?? 0}px`,
    height: `${hoveringElementRect.height ?? 0}px`,
    left: `${hoveringElementRect.x ?? 0}px`,
    top: `${hoveringElementRect.y ?? 0}px`,
    display: display ? 'block' : 'none'
  }
  return {
    style
  }
}
