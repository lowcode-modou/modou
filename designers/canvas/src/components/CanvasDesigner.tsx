import { FC, useRef } from 'react'
import { Page } from '@modou/core'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { CanvasDesignerPropsPanel } from './CanvasDesignerPropsPanel'
import { RecoilWidgetsSync } from './RecoilWidgetsSync'
import { CanvasDesignerWidgetStencil } from './CanvasDesignerWidgetStencil'
import { CanvasDesignerCanvas } from './CanvasDesignerCanvas'
import { DesignerIndicator } from './DesignerIndicator'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { selectedWidgetIdAtom } from '../store'
import { Tabs } from 'antd'
import './CanvasDesigner.scss'
import { CanvasDesignerOutlineTree } from './CanvasDesignerOutlineTree'
import { CanvasDesignerKeyPress } from './CanvasDesignerKeyPress'

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
        <div className='h-full flex justify-between'>
          <div
            className='h-full bg-white'
            style={{
              width: '220px'
            }}>
            <Tabs
              className='designer-panel-tabs'
              type="card"
              tabBarGutter={0}
              items={[
                {
                  key: 'CanvasDesignerOutlineTree',
                  label: '大纲树',
                  children: <CanvasDesignerOutlineTree/>
                }
              ]}/>
          </div>
          <div className='h-full relative flex-1 bg-white border-solid border-gray-100 border-t-0 border-b-0'
               ref={canvasRef}
               onClick={() => setSelectedWidgetId('')}>
            <CanvasDesignerCanvas/>
            <DesignerIndicator canvasRef={canvasRef} />
            <CanvasDesignerKeyPress/>
          </div>
          <div
            className='h-full bg-white'
            style={{
              width: '280px'
            }}>
            <Tabs
              className='designer-panel-tabs'
              type="card"
              tabBarGutter={0}
              items={[
                {
                  key: 'CanvasDesignerWidgetStencil',
                  label: '组件列表',
                  children: <CanvasDesignerWidgetStencil />
                },
                {
                  key: 'CanvasDesignerPropsPanel',
                  label: '属性',
                  children: <CanvasDesignerPropsPanel />
                }
              ]}/>
          </div>
        </div>
      </DndProvider>
    </RecoilWidgetsSync>
  </RecoilRoot>
}
