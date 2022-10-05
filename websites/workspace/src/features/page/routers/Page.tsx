import { FC, useEffect, useLayoutEffect } from 'react'
import { Col, Row } from 'antd'
import { CanvasDesigner } from '@modou/canvas-designer'
import { useRecoilState } from 'recoil'
import { Metadata, AppFactoryContext } from '@modou/core'
import { widgetFactory } from '../utils'
import { useNavigate, useParams } from 'react-router-dom'
import { PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { ROUTER_PATH } from '@/constants'

export const Page: FC = () => {
  const { pageId, appId } = useParams<PageRouterParamsKey>()
  const [page, setPage] = useRecoilState(Metadata.pageSelector(pageId!))
  const navigate = useNavigate()
  useLayoutEffect(() => {
    if (!page) {
      navigate(generateRouterPath(ROUTER_PATH.APP, {
        appId
      }), {
        replace: true
      })
    }
  }, [appId, navigate, page])
  return <Row justify='center' align='middle' className='h-full'>
     <Col span={24} className='h-full'>
      {
        page && <AppFactoryContext.Provider value={widgetFactory}>
              <CanvasDesigner
                  page={page}
                  onPageChange={setPage} />
          </AppFactoryContext.Provider>
      }
     </Col>
  </Row>
}
