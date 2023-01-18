import { useMemoizedFn } from 'ahooks'
import { useEffect } from 'react'

import { APP_MANAGER_SYMBOL, FILE_SYMBOL } from '../constants'
import { MoDouRenderProps } from '../types'
import { ReactRenderHost } from '../utils'
import { UpdateAppManager, UpdateFile } from '../utils/ReactRenderHost'

export const useInitRender = ({
  updateFile,
  updateAppManager,
}: {
  updateAppManager: UpdateAppManager
  updateFile: UpdateFile
} & MoDouRenderProps) => {
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
}
