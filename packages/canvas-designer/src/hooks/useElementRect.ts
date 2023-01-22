import { CSSProperties, useEffect, useState } from 'react'

const DEFAULT_DEPS: any[] = []
export const useElementRect = (
  element: HTMLElement,
  options: {
    deps?: any[]
  } = { deps: DEFAULT_DEPS },
) => {
  const [elementRect, setElementRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const rect = element.getClientRects()[0]
    setElementRect({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    })
  }, [element, ...(options.deps as any[])])
  // })
  const style: CSSProperties = {
    width: `${elementRect.width ?? 0}px`,
    height: `${elementRect.height ?? 0}px`,
    left: `${elementRect.x ?? 0}px`,
    top: `${elementRect.y ?? 0}px`,
  }
  return { style, rect: elementRect }
}
