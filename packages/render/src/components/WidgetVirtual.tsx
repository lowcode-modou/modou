import { useMount, useUnmount } from 'ahooks'
import { FC, useContext, useEffect, useState } from 'react'
import * as React from 'react'

import { AppFactoryContext, useAppManager } from '@modou/core'
import { runInAction, toJS } from '@modou/reactivity'
import { observer, useLocalObservable } from '@modou/reactivity-react'
import {
  WidgetState,
  useStateManager,
  useWidgetVariables,
} from '@modou/state-manager'

import { WidgetErrorBoundary } from './WidgetErrorBoundary'

const _WidgetVirtual: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  // trace(true)
  // 按钮-{{colDSL.span}}
  const { widgetVariables } = useWidgetVariables()

  const { appManager } = useAppManager()
  const { canvasState } = useStateManager()
  const widget = appManager.widgetMap[widgetId]
  const appFactory = useContext(AppFactoryContext)
  const widgetDef = appFactory.widgetByType[widget.meta.type]
  // TODO any 替换 state 定义
  const WidgetComponent = widgetDef.component

  const localState = useLocalObservable(() => {
    return {
      get allSlots() {
        return {
          ...(widgetDef.metadata.slots || {}),
          ...widget.meta.dynamicSlots,
        }
      },
      get renderSlots() {
        return Object.entries(this.allSlots)
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
    }
  })

  const [widgetState, setWidgetState] = useState<WidgetState>()

  useEffect(() => {
    const widgetState = new WidgetState(widget, {
      appFactory,
      widgetVariables,
      canvasState,
    })
    setWidgetState(widgetState)
    return () => {
      widgetState?.disposer()
    }
    // 不要添加多余deps，保持为空
  }, [])

  useEffect(() => {
    widgetState?.updateWidgetVariables(widgetVariables)
  }, [widgetState, widgetVariables])

  // FIXME 完善组件类型
  return widgetState?.state.instance.initialized ? (
    <WidgetErrorBoundary widgetId={widgetId} widgetName={widget.meta.name}>
      <WidgetComponent
        {...toJS(widgetState.state)}
        updateState={widgetState.updateState}
        renderSlots={toJS(localState.renderSlots)}
        renderSlotPaths={toJS(localState.renderSlotPaths)}
      />
    </WidgetErrorBoundary>
  ) : null
}
export const WidgetVirtual = observer(_WidgetVirtual)
