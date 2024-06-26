import { ROUTER_PATH } from '@/constants'
import { PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { Col, Row } from 'antd'
import { head } from 'lodash'
import { FC, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { CanvasDesigner } from '@modou/canvas-designer'
import {
  AppFactoryContext,
  defaultAppFactory,
  useAppManager,
} from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { observer } from '@modou/reactivity-react'
import { SimulatorPC } from '@modou/simulator'

const _Page: FC = () => {
  const { pageId, appId } = useParams<PageRouterParamsKey>()
  const { appManager } = useAppManager()
  const page = appManager.pageMap.get(pageId as string)
  const navigate = useNavigate()
  useLayoutEffect(() => {
    const firstPage = head(appManager.app.pages)
    if (!page && firstPage) {
      navigate(
        generateRouterPath(ROUTER_PATH.PAGE, {
          appId,
          pageId: firstPage.meta?.id,
        }),
        {
          replace: true,
        },
      )
    }
  }, [appId, appManager.app.pages, navigate, page])

  return (
    <Row justify="center" align="middle" className={classes.page}>
      <Col span={24} className={classes.container}>
        {page && (
          <AppFactoryContext.Provider value={defaultAppFactory}>
            <CanvasDesigner file={page}>
              <SimulatorPC src="/simulator/pc/index.html" />
            </CanvasDesigner>
          </AppFactoryContext.Provider>
        )}
      </Col>
    </Row>
  )
}
export const Page = observer(_Page)

const classes = {
  page: mcss`
    height: 100%;
  `,
  container: mcss`
    height: 100%;
  `,
}
