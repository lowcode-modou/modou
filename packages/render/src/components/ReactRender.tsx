import {
  RowWidget,
  ColWidget,
  ButtonWidget
} from '@modou/widgets'
import { FC, FunctionComponent, memo, useEffect, useMemo, useState } from 'react'
import { match } from 'ts-pattern'
import { WidgetBaseProps } from '@modou/core'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { widgetsAtom, widgetSelector } from '../store'
import { Spin } from 'antd'

const ErrorWidget: FC = () => {
  return <div>Error</div>
}

const WidgetWrapper: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const widget = useRecoilValue(widgetSelector(widgetId))
  // TODO any 替换 state 定义
  const Widget = useMemo(() => {
    return match<string, FunctionComponent<any>>(widget.widgetType)
      .with('RowWidget', () => RowWidget)
      .with('ColWidget', () => ColWidget)
      .with('ButtonWidget', () => ButtonWidget)
      .otherwise(() => ErrorWidget)
  }, [widget.widgetType])

  const renderSlots = useMemo(() => {
    return Object.entries((widget.slots || {})).map(([key, widgetIds]) => {
      return {
        key,
        elements: widgetIds.map(widgetId => <WidgetWrapper key={key} widgetId={widgetId} />)
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
  const setWidgets = useSetRecoilState(widgetsAtom)
  useEffect(() => {
    setWidgets(widgets)
  }, [setWidgets, widgets])
  const rootWidget = useRecoilValue(widgetSelector(rootWidgetId))
  return rootWidget ? <MemoWidgetWrapper widgetId={rootWidgetId} /> : <Spin size={'large'} />
}
