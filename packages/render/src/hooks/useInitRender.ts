import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

import { AppManager, PageFile } from '@modou/meta-vfs'

import { APP_MANAGER_SYMBOL, FILE_SYMBOL } from '../constants'
import { ReactRenderHost } from '../utils'
import { UpdateAppManager, UpdateFile } from '../utils/ReactRenderHost'

export const useInitRender = () => {
  // TODO 判断 host type 浏览器 or 模拟器
  const [appManager, updateAppManager] = useState<AppManager>()
  const [file, updateFile] = useState<PageFile>()
  const _updateAppManager: UpdateAppManager = useMemoizedFn((appManager) => {
    if (!Reflect.get(window, APP_MANAGER_SYMBOL)) {
      Reflect.set(window, APP_MANAGER_SYMBOL, appManager)
    }
    updateAppManager(appManager)
  })
  const _updateFile: UpdateFile = useMemoizedFn((file) => {
    if (!Reflect.get(window, FILE_SYMBOL)) {
      Reflect.set(window, FILE_SYMBOL, file)
    }
    updateFile(file)
  })
  useEffect(() => {
    if (!window.reactRenderHost) {
      window.reactRenderHost = new ReactRenderHost({
        updateAppManager: _updateAppManager,
        updateFile: _updateFile,
      })
    }
  }, [_updateAppManager, _updateFile])

  useEffect(() => {
    if (Reflect.get(window, APP_MANAGER_SYMBOL)) {
      updateAppManager(Reflect.get(window, APP_MANAGER_SYMBOL))
    }
    if (Reflect.get(window, FILE_SYMBOL)) {
      updateFile(Reflect.get(window, FILE_SYMBOL))
    }
  })

  return {
    file,
    appManager,
  }
}
