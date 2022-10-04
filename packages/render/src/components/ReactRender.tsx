import { FC, memo, useContext, useEffect, useMemo } from 'react'
import { WidgetBaseProps, WidgetFactoryContext } from '@modou/core'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { widgetsAtom, widgetSelector } from '../store'
import { Spin } from 'antd'

// const ErrorWidget: FC = () => {
//   return <div>Error</div>
// }

const WidgetWrapper: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const widget = useRecoilValue(widgetSelector(widgetId))
  const widgetFactory = useContext(WidgetFactoryContext)
  // TODO any 替换 state 定义
  const Widget = useMemo(() => {
    return widgetFactory.widgetByType[widget.widgetType].component
  }, [widget.widgetType, widgetFactory.widgetByType])

  const renderSlots = useMemo(() => {
    return Object.entries((widget.slots || {})).map(([key, widgetIds]) => {
      return {
        key,
        elements: widgetIds.map(widgetId => <WidgetWrapper key={widgetId} widgetId={widgetId} />)
      }
    }).reduce<Record<string, Element[]>>((pre, { key, elements }) => {
      // FIXME 不知道为什么类型不对😂
      // pre[key] = elements
      Reflect.set(pre, key, elements)
      return pre
    }, {})
  }, [widget.slots])

  const instance = useMemo(() => {
    return {
      id: widgetId,
      widgetId
    }
  }, [widgetId])

  // FIXME 会导致重新渲染
  return <Widget
    {...widget.props}
    renderSlots={renderSlots}
    instance={instance} />
}

interface MoDouRenderProps {
  rootWidgetId: string
  widgets: WidgetBaseProps[]
}

const MemoWidgetWrapper = memo(WidgetWrapper)

export const ReactRender: FC<MoDouRenderProps> = ({
  widgets,
  rootWidgetId
}) => {
  // TODO 使用 recoil-async
  const setWidgets = useSetRecoilState(widgetsAtom)
  useEffect(() => {
    setWidgets(widgets)
  }, [setWidgets, widgets])
  const rootWidget = useRecoilValue(widgetSelector(rootWidgetId))
  return rootWidget
    ? <MemoWidgetWrapper widgetId={rootWidgetId} />
    : <Spin size={'large'} />
}
