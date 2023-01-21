import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { FC, useContext, useEffect } from 'react'
import * as React from 'react'

import { AppFactoryContext, AppManagerProvider } from '@modou/core'
import { observer } from '@modou/reactivity-react'
import { StateManagerProvider } from '@modou/state-manager/src/contexts'

import { CanvasFileContextProvider } from '../contexts'
import { useInitRender, useInitStateManager } from '../hooks'
import { MoDouRenderProps } from '../types'
import { ReactRenderTolerant } from './ReactRenderTolerant'

// TODO 支持页面的 State 缓存 比如详情页面回退到列表页面
const _ReactRender: FC<MoDouRenderProps> = (props) => {
  const appFactory = useContext(AppFactoryContext)
  const { file, appManager } = useInitRender()
  const { stateManager } = useInitStateManager({ app: appManager?.app, file })

  if (!file || !appManager || !stateManager) {
    return null
  }
  return (
    <ConfigProvider locale={zhCN}>
      {/* TODO 去除点(.)保持跟其他Context统一 */}
      <AppFactoryContext.Provider value={appFactory}>
        <AppManagerProvider value={appManager}>
          <StateManagerProvider value={stateManager}>
            <CanvasFileContextProvider value={file}>
              <ReactRenderTolerant {...props} />
            </CanvasFileContextProvider>
          </StateManagerProvider>
        </AppManagerProvider>
      </AppFactoryContext.Provider>
    </ConfigProvider>
  )
}

export const ReactRender = observer(_ReactRender)
