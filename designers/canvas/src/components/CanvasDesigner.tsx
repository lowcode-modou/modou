import { FC, useRef } from 'react'
import { WidgetBaseProps } from '@modou/core'
import { useRecoilState } from 'recoil'
import { ReactRender } from '@modou/render'
import { useEventListener } from 'ahooks'

import { selectedWidgetIdAtom } from '../store'
import { Col, Row } from 'antd'
import { CanvasDesignerPropsPanel } from './CanvasDesignerPropsPanel'
import { RecoilWidgetsSync } from './RecoilWidgetsSync'
import { getRawElement, getWidgetIdFromElement } from '../utils'
import { DesignerIndicator } from './DesignerIndicator'

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
  const [selectedWidgetId] = useRecoilState(selectedWidgetIdAtom)
  const canvasRef = useRef<HTMLDivElement>(null)
  return <RecoilWidgetsSync widgets={widgets} onWidgetsChange={onWidgetsChange}>
    <Row className='h-full'>
      <Col span={16} className='border-green-500 border-solid h-full'>
        <Row className='h-full'>
          <Col ref={canvasRef} span={16} className='border-green-500 border-solid h-full relative p-6'>
            <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
            <DesignerIndicator canvasRef={canvasRef} />
          </Col>
          <Col span={8} className='border-green-500 border-solid h-full'>
            {/* <DesignerContext.Provider value={{ */}
            {/*  onWidgetsChange: onWidgetsChangeRef */}
            {/* }}> */}
            <CanvasDesignerPropsPanel />
            {/* </DesignerContext.Provider> */}
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
  </RecoilWidgetsSync>
}
