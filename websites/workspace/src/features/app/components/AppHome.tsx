import { FC } from 'react'
import { Typography } from 'antd'
import { useRecoilValue } from 'recoil'
import { Metadata } from '@modou/core'
import { head, isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { ROUTER_PATH } from '@/constants'

export const AppHome: FC = () => {
  const params = useParams<BaseRouterParamsKey>()
  const navigate = useNavigate()
  const app = useRecoilValue(Metadata.appAtom)
  const isEmptyApp = isEmpty(app.pages) &&
    isEmpty(app.pages)
  if (!isEmptyApp) {
    if (!isEmpty(app.pages)) {
      navigate(generateRouterPath(ROUTER_PATH.PAGE, {
        ...params,
        pageId: head(app.pages)?.id
      }), {
        replace: true
      })
    } else if (!isEmpty(app.entities)) {
      navigate(generateRouterPath(ROUTER_PATH.Entity, {
        ...params,
        entityId: head(app.entities)?.id
      }), {
        replace: true
      })
    }
  }

  return <div className='h-full flex justify-center items-center'>
    <div>
      <Typography.Title>应用首页</Typography.Title>
    </div>
  </div>
}
