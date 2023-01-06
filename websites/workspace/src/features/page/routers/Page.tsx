import { ROUTER_PATH } from '@/constants'
import { PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { Col, Row } from 'antd'
import { head } from 'lodash'
import { observer } from 'mobx-react-lite'
import { FC, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilCallback, useRecoilState } from 'recoil'

import { CanvasDesigner } from '@modou/canvas-designer'
import { AppFactoryContext, Metadata, defaultAppFactory } from '@modou/core'
import type { Page as IPage } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { SimulatorPC } from '@modou/simulator'

export const Page: FC = () => {
  const { pageId, appId } = useParams<PageRouterParamsKey>()
  const [page, setPage] = useRecoilState(Metadata.pageSelector(pageId!))
  const getFirstPage = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        return head<IPage>(
          snapshot.getLoadable(Metadata.pagesSelector).contents,
        )
      },
    [],
  )
  const navigate = useNavigate()
  useLayoutEffect(() => {
    const firstPage = getFirstPage()
    if (!page && firstPage) {
      navigate(
        generateRouterPath(ROUTER_PATH.PAGE, {
          appId,
          pageId: firstPage.id,
        }),
        {
          replace: true,
        },
      )
    }
  }, [appId, getFirstPage, navigate, page])

  return (
    <Row justify="center" align="middle" className={classes.page}>
      <Col span={24} className={classes.container}>
        {page && (
          <AppFactoryContext.Provider value={defaultAppFactory}>
            <CanvasDesigner page={page} onPageChange={setPage}>
              <SimulatorPC src="/simulator/pc.html" />
            </CanvasDesigner>
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
