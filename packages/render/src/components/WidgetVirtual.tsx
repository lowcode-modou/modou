import {
  InterpolationNode,
  SimpleExpressionNode,
  TextNode,
  baseParse,
} from '@vue/compiler-core'
import { useMemoizedFn, useMount, useUnmount } from 'ahooks'
import { flatten } from 'flat'
import { get, isFunction, keys, set } from 'lodash'
import { FC, useContext, useEffect, useRef } from 'react'
import * as React from 'react'

import { AppFactoryContext, WidgetBaseProps, useAppManager } from '@modou/core'
import {
  IReactionDisposer,
  autorun,
  makeAutoObservable,
  runInAction,
  toJS,
} from '@modou/reactivity'
import { observer, useLocalObservable } from '@modou/reactivity-react'

import { ParseNodeTypes } from '../types'

const EXPRESSION_REG = /[\s\S]*{{[\s\S]*}}[\s\S]*/m
const isExpression = (str: unknown): str is string => {
  return typeof str === 'string' && EXPRESSION_REG.test(str)
}
const evalExpression = (expression: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func,no-useless-call
    return new Function(
      'state',
      `with(state){
      return ${expression}
    }`,
    ).call(null, store.state)
  } catch (e) {
    return String((e as SyntaxError)?.message) ?? 'Error'
  }
}

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  state: Record<string, any> = {}
  props: Record<string, WidgetBaseProps> = {}
}

const store = new Store()

// const ErrorWidget: FC = () => {
//   return <div>Error</div>
// }

const _WidgetVirtual: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const { appManager } = useAppManager()
  const widget = appManager.widgetMap.get(widgetId)!
  const appFactory = useContext(AppFactoryContext)
  const widgetDef = appFactory.widgetByType[widget.meta.type]
  // TODO any 替换 state 定义
  const WidgetComponent = widgetDef.component

  const state = useLocalObservable(() => ({
    get renderSlots() {
      return Object.entries(widgetDef.metadata.slots || {})
        .map(([slotPath, slot]) => {
          return {
            key: slotPath,
            elements: widget.meta.slots[slotPath]?.map((widgetId) => (
              <WidgetVirtual key={widgetId} widgetId={widgetId} />
            )),
          }
        })
        .reduce<Record<string, Element[]>>((pre, { key, elements }) => {
          // FIXME 不知道为什么类型不对😂
          // pre[key] = elements
          Reflect.set(pre, key, elements)
          return pre
        }, {})
    },
    get renderSlotPaths() {
      return Object.keys(this.renderSlots).reduce<Record<string, string>>(
        (pre, cur) => {
          pre[cur] = cur
          return pre
        },
        {},
      )
    },
  }))

  // reactive state
  if (!get(store.state, widgetId)) {
    runInAction(() => {
      set(store.state, widgetId, {
        ...widget.meta.slots,
        ...widgetDef.metadata.initState(widget.meta),
      })
    })
  }

  // reactive props
  if (!get(store.props, widgetId)) {
    runInAction(() => {
      set(store.props, widgetId, widget.meta.props)
    })
  }

  // update reactive props
  useEffect(() => {
    runInAction(() => {
      set(store.props, widgetId, widget.meta.props)
    })
  }, [widget.meta.props, widgetId])

  // TODO 优化类型
  const updateWidgetState = useMemoizedFn(
    <S extends object = {}>(newState: S | ((prevState: S) => S)) => {
      runInAction(() => {
        if (isFunction(newState)) {
          set(store.state, widgetId, newState(get(store.state, widgetId)))
        } else {
          set(store.state, widgetId, newState)
        }
      })
    },
  )

  useEffect(() => {
    // FIXME 为什么会渲染两遍
    updateWidgetState<{}>((prev) => ({
      ...prev,
      ...widget.meta.props,
    }))
  }, [updateWidgetState, widget.meta.props])

  const watchStopsRef = useRef<Record<string, IReactionDisposer>>({})

  useMount(() => {
    const flattenStateKeys = keys(flatten(store.state[widgetId]))
    flattenStateKeys.forEach((path) => {
      if (Reflect.has(watchStopsRef.current, path)) {
        return
      }
      watchStopsRef.current[path] = autorun(() => {
        const fullPath = `${widgetId}.${path}`
        const rawPropVal = get(store.props, fullPath)
        if (isExpression(rawPropVal)) {
          const ast = baseParse(rawPropVal)
          const expression = `\`${ast.children
            .map((item) => {
              // @ts-expect-error
              if (item.type === ParseNodeTypes.TEXT) {
                return (item as unknown as TextNode).content
                // @ts-expect-error
              } else if (item.type === ParseNodeTypes.INTERPOLATION) {
                const content = (
                  (item as unknown as InterpolationNode)
                    .content as unknown as SimpleExpressionNode
                ).content
                if (content) {
                  return `\${${content}}`
                }
                return ''
              }
              // TODO 适配其他类型
              return item.loc.source
            })
            .join('')}\``
          runInAction(() => {
            set(store.state, fullPath, evalExpression(expression))
          })
        } else {
          // set(store.state, `${widgetId}.${path}`, rawPropVal)
        }
      })
    })
  })

  useUnmount(() => {
    //  FIXME
    // Object.values(watchStopsRef.current).forEach((stop) => stop())
  })

  // FIXME 会导致重新渲染
  // FIXME 完善组件类型
  return (
    <WidgetComponent
      {...toJS(store.state[widgetId])}
      updateState={updateWidgetState}
      renderSlots={toJS(state.renderSlots)}
      renderSlotPaths={toJS(state.renderSlotPaths)}
    />
  )
}
export const WidgetVirtual = observer(_WidgetVirtual)
