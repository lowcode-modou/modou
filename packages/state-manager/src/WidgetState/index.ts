import { isFunction } from 'lodash'

import { makeAutoObservable } from '@modou/reactivity'

type BaseWidgetState = Record<string, any>
export class WidgetState {
  // TODO 定义 State 类型
  constructor(state: BaseWidgetState) {
    this.state = state
    makeAutoObservable(this)
  }

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
