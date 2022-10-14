import { ROUTER_PATH } from '@/constants'
import { PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { Col, Row } from 'antd'
import { FC, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { CanvasDesigner } from '@modou/canvas-designer'
import { AppFactoryContext, Metadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { widgetFactory } from '../utils'

export const Page: FC = () => {
  const { pageId, appId } = useParams<PageRouterParamsKey>()
  const [page, setPage] = useRecoilState(Metadata.pageSelector(pageId!))
  const navigate = useNavigate()
  useLayoutEffect(() => {
    if (!page) {
      navigate(
        generateRouterPath(ROUTER_PATH.APP, {
          appId,
        }),
        {
          replace: true,
        },
      )
    }
  }, [appId, navigate, page])

  return (
    <Row justify="center" align="middle" className={classes.page}>
      <Col span={24} className={classes.container}>
        {page && (
          <AppFactoryContext.Provider value={widgetFactory}>
            <CanvasDesigner page={page} onPageChange={setPage} />
          </AppFactoryContext.Provider>
        )}
      </Col>
    </Row>
  )
}

const classes = {
  page: mcss`
    height: 100%;
  `,
  container: mcss`
    height: 100%;
  `,
}
