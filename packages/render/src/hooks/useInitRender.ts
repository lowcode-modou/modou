import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

import { AppManager, PageFile } from '@modou/meta-vfs'
import { AppState, PageState } from '@modou/state-manager'

import {
  APP_MANAGER_SYMBOL,
  APP_STATE_SYMBOL,
  FILE_SYMBOL,
  STATE_SYMBOL,
} from '../constants'
import { ReactRenderHost } from '../utils'
import {
  UpdateAppManager,
  UpdateAppState,
  UpdateFile,
  UpdateState,
} from '../utils/ReactRenderHost'

export const useInitRender = () => {
  // TODO 判断 host type 浏览器 or 模拟器
  const [appManager, updateAppManager] = useState<AppManager>()
  const [file, updateFile] = useState<PageFile>()
  const [appState, updateAppState] = useState<AppState>()
  const [state, updateState] = useState<PageState>()
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
  const _updateAppState: UpdateAppState = useMemoizedFn((appState) => {
    if (!Reflect.get(window, APP_STATE_SYMBOL)) {
      Reflect.set(window, APP_STATE_SYMBOL, appState)
    }
    updateAppState(appState)
  })
  const _updateState: UpdateState = useMemoizedFn((state) => {
    if (!Reflect.get(window, STATE_SYMBOL)) {
      Reflect.set(window, STATE_SYMBOL, state)
    }
    updateState(state)
  })
  useEffect(() => {
    if (!window.reactRenderHost) {
      window.reactRenderHost = new ReactRenderHost({
        updateAppManager: _updateAppManager,
        updateFile: _updateFile,
        updateState: _updateState,
        updateAppState: _updateAppState,
      })
    }
  }, [_updateAppManager, _updateFile, _updateState, _updateAppState])

  useEffect(() => {
    if (Reflect.get(window, APP_MANAGER_SYMBOL)) {
      updateAppManager(Reflect.get(window, APP_MANAGER_SYMBOL))
    }
    if (Reflect.get(window, FILE_SYMBOL)) {
      updateFile(Reflect.get(window, FILE_SYMBOL))
    }
    if (Reflect.get(window, APP_STATE_SYMBOL)) {
      updateAppState(Reflect.get(window, APP_STATE_SYMBOL))
    }
    if (Reflect.get(window, STATE_SYMBOL)) {
      updateState(Reflect.get(window, STATE_SYMBOL))
    }
  }, [])

  return {
    file,
    appManager,
    appState,
    state,
  }
}
