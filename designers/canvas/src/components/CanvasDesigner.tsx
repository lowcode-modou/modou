import { FC, useEffect, useRef } from 'react'
import { WidgetBaseProps } from '@modou/core'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { MoDouRender } from '@modou/render'
import { useEventListener } from 'ahooks'
import ReactJson from 'react-json-view'
import { DesignerContext } from '../contexts'

import { selectedWidgetIdAtom, widgetByIdSelector, widgetsAtom } from '../store'
import { Col, Row } from 'antd'
import { CanvasDesignerPropsPanel } from './CanvasDesignerPropsPanel'

interface CanvasDesignerProps {
  widgets: WidgetBaseProps[]
  onWidgetsChange: (value: WidgetBaseProps[]) => void
  rootWidgetId: string
}

// TODO 增加指示器 hover select drop drag

const getRawWidgetTarget = (target: HTMLElement | null, top: HTMLElement | null): string => {
  if (!target || target === top) {
    return ''
  }
  const widgetId = target.dataset.widgetId
  if (widgetId) {
    return widgetId
  }
  return getRawWidgetTarget(target.parentElement, top)
}

export const CanvasDesigner: FC<CanvasDesignerProps> = ({
  widgets,
  onWidgetsChange,
  rootWidgetId
}) => {
  const useSetWidgets = useSetRecoilState(widgetsAtom)
  useEffect(() => {
    useSetWidgets(widgets)
  }, [widgets])

  const widgetById = useRecoilValue(widgetByIdSelector)

  const [selectedWidgetId, setSelectedWidgetId] = useRecoilState(selectedWidgetIdAtom)
  const canvasRef = useRef<HTMLDivElement>(null)
  useEventListener('click', (event) => {
    const widgetId = getRawWidgetTarget(event.target as unknown as HTMLElement, canvasRef.current)
    setSelectedWidgetId(widgetId)
  }, {
    target: canvasRef
  })

  const onWidgetsChangeRef = useRef(onWidgetsChange)

  return <Row>
    <Col span={16} style={{ border: '1px solid green' }}>
      <Row>
        <Col ref={canvasRef} span={16} style={{ border: '1px solid green' }}>
          <MoDouRender rootWidgetId={rootWidgetId} widgets={widgets} />
        </Col>
        <Col span={8} style={{ border: '1px solid green' }}>
          <DesignerContext.Provider value={{
            onWidgetsChange: onWidgetsChangeRef
          }}>
            <CanvasDesignerPropsPanel />
          </DesignerContext.Provider>
        </Col>
      </Row>
    </Col>
    <Col span={8} style={{ height: '98vh', overflow: 'scroll' }}>
      <div style={{ border: '1px solid green' }}>
        selectedWidgetId: 【{selectedWidgetId}】
      </div>
      <ReactJson src={widgetById} />
    </Col>
  </Row>
}
