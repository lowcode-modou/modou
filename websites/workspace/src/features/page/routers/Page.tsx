import { FC, useEffect } from 'react'
import { Col, Row } from 'antd'
import { CanvasDesigner } from '@modou/canvas-designer'
import { useRecoilState } from 'recoil'
import { Metadata, WidgetFactoryContext } from '@modou/core'
import produce from 'immer'
import { MOCK_PAGE_ID, MOCK_ROOT_WIDGET_ID, MOCK_WIDGETS } from '../mock'
import { widgetFactory } from '../utils'
import { isEmpty } from 'lodash'

export const Page: FC = () => {
  const [pages, setPages] = useRecoilState(Metadata.pagesSelector)
  const [page, setPage] = useRecoilState(Metadata.pageSelector(MOCK_PAGE_ID))

  useEffect(() => {
    if (!isEmpty(pages)) {
      return
    }
    setPages([
      {
        name: '大漠孤烟直',
        id: MOCK_PAGE_ID,
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      },
      {
        name: '测试',
        id: MOCK_PAGE_ID + '___',
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      },
      {
        name: '长河落日圆',
        id: MOCK_PAGE_ID + '________',
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      }
    ])
  }, [pages, setPages])

  return <Row justify='center' align='middle' className='h-full'>
    <Col span={24} className='h-full'>
      {
        page && <WidgetFactoryContext.Provider value={widgetFactory}>
              <CanvasDesigner
                  rootWidgetId={page.rootWidgetId}
                  widgets={page?.widgets || []}
                  onWidgetsChange={(val) => {
                    // console.log(val)
                    setPage(produce(draft => {
                      draft.widgets = val
                    }))
                  }} />
          </WidgetFactoryContext.Provider>
      }
    </Col>
  </Row>
}
