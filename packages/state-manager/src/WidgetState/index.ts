import { flatten } from 'flat'
import {
  get,
  head,
  isArray,
  isFunction,
  isNumber,
  mapValues,
  omit,
  set,
  take,
  takeRight,
  unset,
} from 'lodash'

import { AppFactory } from '@modou/core'
import { WidgetFile } from '@modou/meta-vfs'
import {
  IReactionDisposer,
  autorun,
  makeAutoObservable,
  reaction,
  remove,
  runInAction,
  toJS,
} from '@modou/reactivity'
import { evalExpression } from '@modou/render/src/utils/evaluate'

import { PageState } from '../PageState'
import { WidgetVariables } from '../contexts'

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
  constructor(
    file: WidgetFile,
    {
      appFactory,
      widgetVariables,
      canvasState,
    }: {
      appFactory: AppFactory
      widgetVariables: WidgetVariables
      canvasState: PageState
    },
  ) {
    const widgetDef = appFactory.widgetByType[file.meta.type]
    this.file = file
    this.widgetVariables = widgetVariables
    this.canvasState = canvasState
    const rawMeta = toJS(file.meta)
    // TODO 这个地方就要 eval
    this.state = {
      ...rawMeta.props,
      // TODO initState 传递的参数应该是初始化的state 或者 计算后的 props
      ...widgetDef.metadata.initState(rawMeta),
    } as unknown as BaseWidgetState
    makeAutoObservable(this)

    let stopReaction: IReactionDisposer
    let stopExps: IReactionDisposer[] = []
    // 监听vi变化
    const stopReactionVI = reaction(
      () => this.widgetVariables.i,
      (vi, oldValue) => {
        stopReaction?.()
        runInAction(() => {
          // TODO 支持 v_ri
          // ri [1,2,3,4,5]
          // i 5
          if (isNumber(vi)) {
            if (!isArray(canvasState.subState.widget[this.file.meta.id])) {
              set(canvasState.subState.widget, [this.file.meta.id], [])
            }
          }

          if (isNumber(vi)) {
            // @ts-expect-error
            canvasState.subState.widget[this.file.meta.id][vi] = this
          } else {
            canvasState.subState.widget[this.file.meta.id] = this
          }
        })
        // 监听props变化
        stopReaction = reaction(
          () => this.file.flattenedMetaValMap,
          (value, prev) => {
            // TODO 单个监听flattenedMetaValMap并判断是否已经监听和暂停被删除的监听
            // TODO 重新执行initState 并 diff
            stopExps.forEach((stop) => stop())
            stopExps = []
            // TODO 需要更加准确的判断需要删除的数组路径
            // 处理 数组 类型的 state 在props删除后不会更新的问题
            // 比如 {columns:[{a:1},{a:2}]} => {columns:[{a:1}]} state 的第一项并不会删除
            const newValPaths = Object.keys(value)
            const newValHeadPath = newValPaths.map((path) =>
              head(path.split('.')),
            )
            const omitPaths = Object.keys(omit(prev, newValPaths)).filter(
              (path) => !newValHeadPath.includes(path),
            )
            runInAction(() => {
              if (omitPaths.length > 0) {
                // 处理 数组 类型的 state 在props删除后不会更新的问题
                // 比如 {columns:[{a:1},{a:2}]} => {columns:[{a:1}]} state 的第一项并不会删除
                omitPaths.forEach((path) => {
                  unset(this.state, path)
                  const pathArr = path.split('.')
                  // TODO 需要更加准确的判断需要删除的数组路径
                  if (isNumber(+pathArr[pathArr.length - 2])) {
                    remove(
                      get(this.state, take(pathArr, pathArr.length - 2)),
                      head(takeRight(pathArr, 2)),
                    )
                  }
                })
              }
            })
            // TODO 如果state是数组的时候如何删除多余的数组
            Object.entries(value).forEach(([path, val]) => {
              if (val.type === 'Normal') {
                if (prev?.[path]?.raw !== val.raw) {
                  runInAction(() => {
                    set(this.state, path, val.raw)
                  })
                }
              } else {
                stopExps.push(
                  // TODO Autorun 不靠谱
                  autorun(() => {
                    const newVal = evalExpression(val.evalString, {
                      ...mapValues(canvasState.subWidgetNameState, (widget) => {
                        if (isArray(widget)) {
                          // TODO 支持v_ri
                          return widget.map(
                            (w) => (w as unknown as WidgetState).state,
                          )
                        } else {
                          return widget.state
                        }
                      }),
                      ...widgetVariables,
                    })
                    runInAction(() => {
                      set(this.state, path, newVal)
                    })
                  }),
                )
              }
              // TODO 如果是异步的 expression 如何处理
              runInAction(() => {
                this.state.instance.initialized = true
              })
            })
          },
          {
            fireImmediately: true,
          },
        )
      },
      { fireImmediately: true },
    )
    this.disposer = () => {
      stopReactionVI()
      stopReaction()
      stopExps.forEach((stop) => stop())
      // stopExps = []
      runInAction(() => {
        // TODO 处理 v_i 和 v_ri
        remove(canvasState.subState.widget, this.file.meta.id)
      })
    }
  }

  file: WidgetFile

  canvasState: PageState

  // TODO 完善 Widget State 定义
  state: BaseWidgetState

  widgetVariables: WidgetVariables

  updateState = (
    state: BaseWidgetState | ((oldState: BaseWidgetState) => BaseWidgetState),
  ) => {
    let _state: BaseWidgetState
    if (isFunction(state)) {
      _state = state(this.state)
    } else {
      _state = state
    }

    const fNewState: Record<string, any> = flatten(_state, { safe: true })
    const fState: BaseWidgetState = flatten(this.state, { safe: true })
    // TODO 优化性能
    // 删除不存在的 props
    Object.entries(fState).forEach(([path, value]) => {
      if (!Reflect.has(fNewState, path)) {
        Reflect.deleteProperty(fState, path)
      }
    })
    Object.entries(fNewState).forEach(([path, value]) => {
      const oldValue = get(fState, path)
      if (value !== oldValue) {
        set(this.state, path, value)
      }
    })
  }

  updateWidgetVariables = (widgetVariables: WidgetVariables) => {
    this.widgetVariables = widgetVariables
  }

  disposer: () => void
}
