import { ErrorBoundary } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { FC, useContext } from 'react'
import * as React from 'react'

import { AppFactoryContext } from '@modou/asset-vfs'
import { AppManagerProvider } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'
import { AppStateProvider, CanvasStateProvider } from '@modou/state-manager'

import { CanvasFileContextProvider } from '../contexts'
import { useInitRender } from '../hooks'
import { MoDouRenderProps } from '../types'
import { ReactRenderTolerant } from './ReactRenderTolerant'

// TODO 支持页面的 State 缓存 比如详情页面回退到列表页面
const _ReactRender: FC<MoDouRenderProps> = (props) => {
  const appFactory = useContext(AppFactoryContext)
  const { file, appManager, appState, state } = useInitRender()

  if (!file || !appManager || !appState || !state) {
    return null
  }
  return (
    <ConfigProvider locale={zhCN}>
      {/* TODO 去除点(.)保持跟其他Context统一 */}
      <AppFactoryContext.Provider value={appFactory}>
        <AppManagerProvider value={appManager}>
          <AppStateProvider value={appState}>
            <CanvasFileContextProvider value={file}>
              <CanvasStateProvider value={state}>
                <ErrorBoundary>
                  <ReactRenderTolerant {...props} />
                </ErrorBoundary>
              </CanvasStateProvider>
            </CanvasFileContextProvider>
          </AppStateProvider>
        </AppManagerProvider>
      </AppFactoryContext.Provider>
    </ConfigProvider>
  )
}

export const ReactRender = observer(_ReactRender)
