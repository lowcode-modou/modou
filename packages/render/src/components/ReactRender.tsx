import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { FC, useContext, useEffect, useState } from 'react'
import * as React from 'react'

import { AppFactoryContext, AppManagerProvider } from '@modou/core'
import { AppManager, PageFile } from '@modou/meta-vfs'

import { CanvasFileContextProvider } from '../contexts/CanvasFileContext'
import { useInitRender } from '../hooks'
import { MoDouRenderProps } from '../types'
import { ReactRenderTolerant } from './ReactRenderTolerant'

export const ReactRender: FC<MoDouRenderProps> = (props) => {
  const appFactory = useContext(AppFactoryContext)
  const [appManager, updateAppManager] = useState<AppManager>()
  const [file, updateFile] = useState<PageFile>()
  useInitRender({ ...props, updateAppManager, updateFile })
  useEffect(() => {
    console.log('123')
  })
  if (!file || !appManager) {
    return null
  }
  return (
    <ConfigProvider locale={zhCN}>
      <AppFactoryContext.Provider value={appFactory}>
        <AppManagerProvider value={appManager}>
          <CanvasFileContextProvider value={file}>
            <ReactRenderTolerant {...props} />
          </CanvasFileContextProvider>
        </AppManagerProvider>
      </AppFactoryContext.Provider>
    </ConfigProvider>
  )
}
