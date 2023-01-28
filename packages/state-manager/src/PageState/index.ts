import { isArray } from 'lodash'

import { PageFile } from '@modou/meta-vfs'
import { computed, makeObservable, observable } from '@modou/reactivity'

import { WidgetState } from '../WidgetState'

export class PageState {
  constructor(file: PageFile) {
    this.file = file
    this.state = {
      id: file.meta.id,
      name: file.meta.name,
    }
    makeObservable(this, {
      file: observable,
      state: observable,
      subState: observable,
      subWidgetNameState: computed.struct,
    })
  }

  file: PageFile

  state: {
    id: string
    name: string
  }

  // TODO 组件销毁的时候删除subState
  subState: {
    // TODO 动态定义WidgetState[][][]类型
    widget: Record<string, WidgetState | WidgetState[][][]>
  } = {
    widget: {},
  }

  get subWidgetNameState() {
    return Object.values(this.subState.widget).reduce<
      Record<string, WidgetState | WidgetState[][][]>
    >((prev, cur) => {
      if (isArray(cur)) {
        // TODO 暂时支持一级嵌套  v_i 代支持v_ri
        prev[(cur[0] as unknown as WidgetState).file.meta.name] = cur
      } else {
        prev[cur.file.meta.name] = cur
      }
      return prev
    }, {})
  }
}
