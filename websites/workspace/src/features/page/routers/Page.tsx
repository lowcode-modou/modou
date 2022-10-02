import { FC, useEffect } from 'react'
import { Col, Row } from 'antd'
import { CanvasDesigner } from '@modou/canvas-designer'
import { useRecoilState } from 'recoil'
import { Metadata, WidgetFactoryContext } from '@modou/core'
import produce from 'immer'
import { MOCK_PAGE_ID, MOCK_ROOT_WIDGET_ID, MOCK_WIDGETS } from '../mock'
import { widgetFactory } from '../utils'

export const Page: FC = () => {
  const [pageById, setPageById] = useRecoilState(Metadata.pageByIdSelector)
  const page = pageById[MOCK_PAGE_ID]

  useEffect(() => {
    if (page) {
      return
    }
    setPageById(produce(draft => {
      draft[MOCK_PAGE_ID] = {
        name: 'demo page',
        id: MOCK_PAGE_ID,
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      }
    }))
  }, [page, setPageById])

  return <Row justify='center' align='middle' className='h-full'>
    <Col span={24} className='h-full'>
      {
        page && <WidgetFactoryContext.Provider value={widgetFactory}>
              <CanvasDesigner
                  rootWidgetId={page.rootWidgetId}
                  widgets={page?.widgets || []}
                  onWidgetsChange={(val) => {
                    // console.log(val)
                    setPageById(produce(draft => {
                      draft[MOCK_PAGE_ID].widgets = val
                    }))
                  }} />
          </WidgetFactoryContext.Provider>
      }
    </Col>
  </Row>
}
