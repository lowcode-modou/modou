import { Spin } from 'antd'
import { FC, memo, useContext, useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { AppFactoryContext, WidgetBaseProps } from '@modou/core'

import { widgetSelector, widgetsAtom } from '../store'

// const ErrorWidget: FC = () => {
//   return <div>Error</div>
// }

const WidgetWrapper: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const widget = useRecoilValue(widgetSelector(widgetId))
  const widgetFactory = useContext(AppFactoryContext)
  const widgetDef = widgetFactory.widgetByType[widget.widgetType]
  // TODO any 替换 state 定义
  const Widget = useMemo(() => {
    return widgetDef.component
  }, [widgetDef.component])

  const renderSlots = useMemo(() => {
    return Object.entries(widget.slots || {})
      .map(([key, widgetIds]) => {
        return {
          key,
          elements: widgetIds.map((widgetId) => (
            <WidgetWrapper key={widgetId} widgetId={widgetId} />
          )),
        }
      })
      .reduce<Record<string, Element[]>>((pre, { key, elements }) => {
        // FIXME 不知道为什么类型不对😂
        // pre[key] = elements
        Reflect.set(pre, key, elements)
        return pre
      }, {})
  }, [widget.slots])

  const renderSlotNames = useMemo(() => {
    return Object.keys(renderSlots).reduce<Record<string, string>>(
      (pre, cur) => {
        pre[cur] = cur
        return pre
      },
      {},
    )
  }, [renderSlots])

  // TODO 全局存储状态
  const [widgetState, updateWidgetState] = useState(() => ({
    ...widget.props,
    ...widgetDef.metadata.initState(widget),
  }))

  useEffect(() => {
    // FIXME 为什么会渲染两遍
    console.log('widget.props', widget.props)
    updateWidgetState((prev) => ({
      ...prev,
      ...widget.props,
    }))
  }, [widget.props])

  // FIXME 会导致重新渲染
  // FIXME 完善组件类型
  return (
    <Widget
      {...widgetState}
      updateState={updateWidgetState}
      renderSlots={renderSlots}
      renderSlotNames={renderSlotNames}
    />
  )
}

interface MoDouRenderProps {
  rootWidgetId: string
  widgets: WidgetBaseProps[]
}

const MemoWidgetWrapper = memo(WidgetWrapper)

export const ReactRender: FC<MoDouRenderProps> = ({
  widgets,
  rootWidgetId,
}) => {
  // TODO 使用 recoil-async
  const setWidgets = useSetRecoilState(widgetsAtom)
  useEffect(() => {
    setWidgets(widgets)
  }, [setWidgets, widgets])
  const rootWidget = useRecoilValue(widgetSelector(rootWidgetId))
  return rootWidget ? (
    <MemoWidgetWrapper widgetId={rootWidgetId} />
  ) : (
    <Spin size={'large'} />
  )
}
