import { FC, useRef } from 'react'
import { WidgetBaseProps } from '@modou/core'
import { RecoilRoot } from 'recoil'
import { Col, Row } from 'antd'
import { CanvasDesignerPropsPanel } from './CanvasDesignerPropsPanel'
import { RecoilWidgetsSync } from './RecoilWidgetsSync'
import { CanvasDesignerWidgets } from './CanvasDesignerWidgets'
import { CanvasDesignerCanvas } from './CanvasDesignerCanvas'
import { DesignerIndicator } from './DesignerIndicator'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
  const canvasRef = useRef<HTMLDivElement>(null)

  return <RecoilRoot>
    <RecoilWidgetsSync widgets={widgets} onWidgetsChange={onWidgetsChange}>
      <DndProvider backend={HTML5Backend}>
        <Row className='h-full'>
          <Col span={24} className='border-green-500 border-solid h-full'>
            <Row className='h-full'>
              <Col span={4} className='border-green-500 border-solid h-full'>
                <CanvasDesignerWidgets />
              </Col>
              <Col ref={canvasRef} span={16}
                   className='border-green-500 border-solid h-full relative p-6'>
                <CanvasDesignerCanvas rootWidgetId={rootWidgetId}/>
                <DesignerIndicator canvasRef={canvasRef} />
              </Col>
              <Col span={4} className='border-green-500 border-solid h-full'>
                {/* <DesignerContext.Provider value={{ */}
                {/*  onWidgetsChange: onWidgetsChangeRef */}
                {/* }}> */}
                <CanvasDesignerPropsPanel />
                {/* </DesignerContext.Provider> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </DndProvider>
    </RecoilWidgetsSync>
  </RecoilRoot>
}
