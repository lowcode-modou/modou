import { FC, useRef } from 'react'
import { Page, WidgetBaseProps } from '@modou/core'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { Col, Row } from 'antd'
import { CanvasDesignerPropsPanel } from './CanvasDesignerPropsPanel'
import { RecoilWidgetsSync } from './RecoilWidgetsSync'
import { CanvasDesignerWidgets } from './CanvasDesignerWidgets'
import { CanvasDesignerCanvas } from './CanvasDesignerCanvas'
import { DesignerIndicator } from './DesignerIndicator'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import produce from 'immer'
import { selectedWidgetIdAtom } from '../store'

interface CanvasDesignerProps {
  page: Page
  onPageChange: (page: Page) => void
}

export const CanvasDesigner: FC<CanvasDesignerProps> = ({
  page,
  onPageChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const setSelectedWidgetId = useSetRecoilState(selectedWidgetIdAtom)

  return <RecoilRoot>
    <RecoilWidgetsSync page={page} onPageChange={onPageChange}>
      <DndProvider backend={HTML5Backend}>
        <Row className='h-full'>
          <Col span={24} className='h-full'>
            <Row className='h-full'>
              <Col span={4} className='h-full'>
                <CanvasDesignerWidgets />
              </Col>
              <Col span={16}
                   className='h-full relative p-6'>
                <div className='h-full'
                     ref={canvasRef}
                     onClick={() => setSelectedWidgetId('')}>
                  <CanvasDesignerCanvas/>
                </div>
                <DesignerIndicator canvasRef={canvasRef} />
              </Col>
              <Col span={4} className='h-full'>
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
