import { isFunction } from 'lodash'

import { AppFactory } from '@modou/core'
import { WidgetFile } from '@modou/meta-vfs'
import { makeAutoObservable } from '@modou/reactivity'

// TODO 完善类型定义
type BaseWidgetState = Record<string, any> & {
  instance: {
    id: string
    widgetId: string
    initialized: boolean
  }
}
export class WidgetState {
  // TODO 定义 State 类型 & 提取 appFactory 到mobx
  // TODO 尝试 把 widgetDef 放到 file 上
  constructor(file: WidgetFile, appFactory: AppFactory) {
    const widgetDef = appFactory.widgetByType[file.meta.type]
    this.file = file
    this.state = {
      ...file.meta.props,
      ...widgetDef.metadata.initState(file.meta),
    } as unknown as BaseWidgetState
    makeAutoObservable(this)
  }

  file: WidgetFile

  // TODO 完善 Widget State 定义
  state: BaseWidgetState

  updateState(
    state: BaseWidgetState | ((oldState: BaseWidgetState) => BaseWidgetState),
  ) {
    if (isFunction(state)) {
      this.state = state(this.state)
    } else {
      this.state = state
    }
  }
}
