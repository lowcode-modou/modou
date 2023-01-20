import {
  InterpolationNode,
  SimpleExpressionNode,
  TextNode,
  baseParse,
} from '@vue/compiler-core'
import { useMount } from 'ahooks'
import { flatten } from 'flat'
import { get, keys, set } from 'lodash'
import { FC, useContext, useRef } from 'react'
import * as React from 'react'

import { AppFactoryContext, useAppManager } from '@modou/core'
import {
  IReactionDisposer,
  autorun,
  runInAction,
  toJS,
} from '@modou/reactivity'
import { observer, useLocalObservable } from '@modou/reactivity-react'
import { WidgetState } from '@modou/state-manager'
import { useStateManager } from '@modou/state-manager/src/contexts'

import { ParseNodeTypes } from '../types'
import { evalExpression, isExpression } from '../utils/evaluate'

const _WidgetVirtual: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const { appManager } = useAppManager()
  const { canvasState } = useStateManager()
  const widget = appManager.widgetMap.get(widgetId)!
  const appFactory = useContext(AppFactoryContext)
  let widgetState = canvasState.subState.widget[widget.meta.id]
  if (!widgetState) {
    widgetState = new WidgetState(widget, appFactory)
    canvasState.subState.widget[widget.meta.id] = widgetState
  }
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

  const watchStopsRef = useRef<Record<string, IReactionDisposer>>({})

  useMount(() => {
    const flattenStateKeys = keys(flatten(widgetState.state))
    flattenStateKeys.forEach((path) => {
      if (Reflect.has(watchStopsRef.current, path)) {
        return
      }
      watchStopsRef.current[path] = autorun(() => {
        const fullPath = `${path}`
        const rawPropVal = get(widget.meta.props, fullPath)
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
            set(
              widgetState.state,
              fullPath,
              evalExpression(expression, canvasState),
            )
          })
        } else {
          set(widgetState.state, `${path}`, rawPropVal)
        }
      })
    })
  })

  // FIXME 会导致重新渲染
  // FIXME 完善组件类型
  // console.log('toJS(widgetState)', toJS(widgetState.state))
  return (
    <WidgetComponent
      {...toJS(widgetState.state)}
      updateState={widgetState.updateState}
      renderSlots={toJS(state.renderSlots)}
      renderSlotPaths={toJS(state.renderSlotPaths)}
    />
  )
}
export const WidgetVirtual = observer(_WidgetVirtual)
