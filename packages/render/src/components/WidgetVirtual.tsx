import { set } from 'lodash'
import { FC, useContext, useEffect } from 'react'
import * as React from 'react'

import { AppFactoryContext, useAppManager } from '@modou/core'
import {
  IReactionDisposer,
  autorun,
  reaction,
  runInAction,
  toJS,
} from '@modou/reactivity'
import { observer, useComputed } from '@modou/reactivity-react'
import { WidgetState } from '@modou/state-manager'
import { useStateManager } from '@modou/state-manager/src/contexts'

import { evalExpression } from '../utils/evaluate'

const _WidgetVirtual: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  // trace(true)
  // 按钮-{{colDSL.span}}
  const { appManager } = useAppManager()
  const { canvasState } = useStateManager()
  const widget = appManager.widgetMap[widgetId]
  const appFactory = useContext(AppFactoryContext)
  let widgetState = canvasState.subState.widget[widget.meta.id]
  if (!widgetState) {
    widgetState = new WidgetState(widget, appFactory)
    canvasState.subState.widget[widget.meta.id] = widgetState
  }
  const widgetDef = appFactory.widgetByType[widget.meta.type]
  // TODO any 替换 state 定义
  const WidgetComponent = widgetDef.component

  const renderSlots = useComputed(() => {
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
  })
  const renderSlotPaths = useComputed(() => {
    return Object.keys(renderSlots).reduce<Record<string, string>>(
      (pre, cur) => {
        pre[cur] = cur
        return pre
      },
      {},
    )
  })

  useEffect(() => {
    const stopExps: IReactionDisposer[] = []
    const stop = reaction(
      () => widgetState.file.flattenedMetaValMap,
      (value, prev) => {
        stopExps.forEach((stop) => stop())
        Object.entries(value).forEach(([path, val]) => {
          if (val.type === 'Normal') {
            if (prev?.[path]?.raw !== val.raw) {
              runInAction(() => {
                set(widgetState.state, path, val.raw)
              })
            }
          } else {
            stopExps.push(
              autorun(() => {
                const newVal = evalExpression(val.evalString, canvasState)
                runInAction(() => {
                  set(widgetState.state, path, newVal)
                })
              }),
            )
          }
          // TODO 如果是异步的 expression 如何处理
          widgetState.state.instance.initialized = true
        })
      },
      {
        fireImmediately: true,
      },
    )
    return () => {
      stop()
    }
  }, [])

  // FIXME 会导致重新渲染
  // FIXME 完善组件类型
  return widgetState.state.instance.initialized ? (
    <WidgetComponent
      {...toJS(widgetState.state)}
      updateState={widgetState.updateState}
      renderSlots={toJS(renderSlots)}
      renderSlotPaths={toJS(renderSlotPaths)}
    />
  ) : null
}
export const WidgetVirtual = observer(_WidgetVirtual)
