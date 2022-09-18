import { FC, useEffect } from 'react'
import { WidgetBaseProps } from '@modou/core'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { MoDouRender } from '@modou/render'
import ReactJson from 'react-json-view'

import { widgetByIdSelector, widgetsAtom } from '../store'
import { Col, Row } from 'antd'

interface CanvasDesignerProps {
  widgets: WidgetBaseProps[]
  onWidgetsChange: (value: WidgetBaseProps[]) => void
  rootWidgetId: string
}

// TODO 增加指示器 hover select drop drag

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

  return <Row>
    <Col span={12}>
      <MoDouRender rootWidgetId={rootWidgetId} widgets={widgets} />
    </Col>
    <Col span={12} style={{ height: '98vh', overflow: 'scroll' }}>
      <ReactJson src={widgetById} />
    </Col>
  </Row>
}
