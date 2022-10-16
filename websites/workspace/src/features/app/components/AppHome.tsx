import { ROUTER_PATH } from '@/constants'
import { BaseRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { Spin } from 'antd'
import { head, isEmpty } from 'lodash'
import { FC, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { Metadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

export const AppHome: FC = () => {
  const params = useParams<BaseRouterParamsKey>()
  const navigate = useNavigate()
  const app = useRecoilValue(Metadata.appAtom)
  const isEmptyApp = isEmpty(app)
  const isEmptyPage = isEmpty(app.pages)

  useLayoutEffect(() => {
    if (!isEmptyApp) {
      if (!isEmptyPage) {
        navigate(
          generateRouterPath(ROUTER_PATH.PAGE, {
            ...params,
            pageId: head(app.pages)?.id,
          }),
          {
            replace: true,
          },
        )
      } else if (!isEmpty(app.entities)) {
        navigate(
          generateRouterPath(ROUTER_PATH.Entity, {
            ...params,
            entityId: head(app.entities)?.id,
          }),
          {
            replace: true,
          },
        )
      }
    }
  }, [app.entities, app.pages, isEmptyApp, isEmptyPage, navigate, params])

  return (
    <div className={classes.wrapper}>
      <Spin size="large" />
      {/* <div> */}
      {/*   <Typography.Title>应用首页</Typography.Title> */}
      {/* </div> */}
    </div>
  )
}

const classes = {
  wrapper: mcss`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}
