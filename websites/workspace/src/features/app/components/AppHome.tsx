import { ROUTER_PATH } from '@/constants'
import { BaseRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { Spin } from 'antd'
import { head, isEmpty } from 'lodash'
import { FC, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppManager } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { observer } from '@modou/reactivity-react'

const _AppHome: FC = () => {
  const params = useParams<BaseRouterParamsKey>()
  const navigate = useNavigate()
  const { app } = useAppManager()
  const isEmptyPage = isEmpty(app.pages)

  useEffect(() => {
    if (!isEmptyPage) {
      navigate(
        generateRouterPath(ROUTER_PATH.PAGE, {
          ...params,
          pageId: head(app.pages)?.meta?.id,
        }),
        {
          replace: true,
        },
      )
    } else if (!isEmpty(app.entities)) {
      navigate(
        generateRouterPath(ROUTER_PATH.Entity, {
          ...params,
          entityId: head(app.entities)?.meta?.id,
        }),
        {
          replace: true,
        },
      )
    }
  }, [app.entities, app.pages, isEmptyPage, navigate, params])

  return (
    <div className={classes.wrapper}>
      <Spin size="large" />
      {/* <div> */}
      {/*   <Typography.Title>应用首页</Typography.Title> */}
      {/* </div> */}
    </div>
  )
}
export const AppHome = observer(_AppHome)

const classes = {
  wrapper: mcss`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}
