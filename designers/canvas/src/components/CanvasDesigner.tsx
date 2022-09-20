import { CSSProperties, FC, RefObject, useEffect, useRef, useState } from 'react'
import { WidgetBaseProps } from '@modou/core'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ReactRender } from '@modou/render'
import { useEventListener } from 'ahooks'
import { DesignerContext } from '../contexts'

import { selectedWidgetIdAtom, widgetsAtom } from '../store'
import { Col, Row } from 'antd'
import { CanvasDesignerPropsPanel } from './CanvasDesignerPropsPanel'

interface CanvasDesignerProps {
  widgets: WidgetBaseProps[]
  onWidgetsChange: (value: WidgetBaseProps[]) => void
  rootWidgetId: string
}

// TODO 增加指示器 hover select drop drag

const getWidgetIdFromElement = (element: HTMLElement): string => {
  return element?.dataset?.widgetId ?? ''
}

const getRawElement = (target: HTMLElement | null, top: HTMLElement | null): HTMLElement | null => {
  if (!target || target === top) {
    return null
  }
  const widgetId = getWidgetIdFromElement(target)
  if (widgetId) {
    return target
  }
  return getRawElement(target.parentElement, top)
}

const useHovering = (canvasRef: RefObject<HTMLElement>) => {
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
    target: canvasRef
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

export const CanvasDesigner: FC<CanvasDesignerProps> = ({
  widgets,
  onWidgetsChange,
  rootWidgetId
}) => {
  const setWidgets = useSetRecoilState(widgetsAtom)
  useEffect(() => {
    setWidgets(widgets)
  }, [setWidgets, widgets])

  const [selectedWidgetId, setSelectedWidgetId] = useRecoilState(selectedWidgetIdAtom)
  const canvasRef = useRef<HTMLDivElement>(null)
  useEventListener('click', (event) => {
    const rawElement = getRawElement(event.target as unknown as HTMLElement, canvasRef.current)
    setSelectedWidgetId(getWidgetIdFromElement(rawElement as HTMLElement))
  }, {
    target: canvasRef
  })

  const onWidgetsChangeRef = useRef(onWidgetsChange)

  const { style: hoveringStyle } = useHovering(canvasRef)

  return <Row className='h-full'>
    <Col span={16} className='border-green-500 border-solid h-full'>
      <Row className='h-full'>
        <Col ref={canvasRef} span={16} className='border-green-500 border-solid h-full relative p-6'>
          <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
          <div className='fixed inset-0 pointer-events-none'>
            <div
              className='text-yellow-500 border-sky-400 border-dashed absolute'
              style={hoveringStyle}
            />
          </div>
        </Col>
        <Col span={8} className='border-green-500 border-solid h-full'>
          <DesignerContext.Provider value={{
            onWidgetsChange: onWidgetsChangeRef
          }}>
            <CanvasDesignerPropsPanel />
          </DesignerContext.Provider>
        </Col>
      </Row>
    </Col>
    <Col span={8} className='h-full overflow-scroll'>
      <div className='border-green-500 border-solid'>
        selectedWidgetId: 【{selectedWidgetId}】
      </div>
      {/* <ReactJson src={widgetById} /> */}
    </Col>
  </Row>
}
