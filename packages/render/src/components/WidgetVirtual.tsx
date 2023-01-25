import { get, head, isNumber, omit, set, take, takeRight, unset } from 'lodash'
import { all } from 'quicktype-core/dist/language/All'
import { FC, useContext, useEffect, useMemo } from 'react'
import * as React from 'react'

import {
  AppFactoryContext,
  useAppManager,
  useWidgetMetaSlots,
} from '@modou/core'
import {
  IReactionDisposer,
  autorun,
  reaction,
  remove,
  runInAction,
  toJS,
} from '@modou/reactivity'
import { observer } from '@modou/reactivity-react'
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

  const allSlots = useWidgetMetaSlots({
    widgetMeta: widgetDef.metadata,
    widget,
  })
  const renderSlots = (() => {
    return Object.entries(allSlots)
      .map(([slotPath, slot]) => {
        return {
          key: slotPath,
          elements: widget.slots[slotPath]?.map((widgetId) => (
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
  })()
  const renderSlotPaths = (() => {
    return Object.keys(renderSlots).reduce<Record<string, string>>(
      (pre, cur) => {
        pre[cur] = cur
        return pre
      },
      {},
    )
  })()

  useEffect(() => {
    const stopExps: IReactionDisposer[] = []
    const stop = reaction(
      () => widgetState.file.flattenedMetaValMap,
      (value, prev) => {
        stopExps.forEach((stop) => stop())
        // TODO 需要更加准确的判断需要删除的数组路径
        // 处理 数组 类型的 state 在props删除后不会更新的问题
        // 比如 {columns:[{a:1},{a:2}]} => {columns:[{a:1}]} state 的第一项并不会删除
        const newValPaths = Object.keys(value)
        const newValHeadPath = newValPaths.map((path) => head(path.split('.')))
        const omitPaths = Object.keys(omit(prev, newValPaths)).filter(
          (path) => !newValHeadPath.includes(path),
        )
        runInAction(() => {
          if (omitPaths.length > 0) {
            // 处理 数组 类型的 state 在props删除后不会更新的问题
            // 比如 {columns:[{a:1},{a:2}]} => {columns:[{a:1}]} state 的第一项并不会删除
            omitPaths.forEach((path) => {
              unset(widgetState.state, path)
              const pathArr = path.split('.')
              // TODO 需要更加准确的判断需要删除的数组路径
              if (isNumber(+pathArr[pathArr.length - 2])) {
                remove(
                  get(widgetState.state, take(pathArr, pathArr.length - 2)),
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

  console.log('widgetState.state', widgetState.state)
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
