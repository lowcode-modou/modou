import { isFunction } from 'lodash'

import { AppFactory } from '@modou/core'
import { WidgetFile } from '@modou/meta-vfs'
import { makeAutoObservable, toJS } from '@modou/reactivity'

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
    const rawMeta = toJS(file.meta)
    console.log('rawMeta', rawMeta)
    // TODO 这个地方就要 eval
    this.state = {
      ...toJS(rawMeta.props),
      // TODO initState 传递的参数应该是初始化的state 或者 计算后的 props
      ...widgetDef.metadata.initState(rawMeta),
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