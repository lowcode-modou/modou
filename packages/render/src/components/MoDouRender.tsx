import { schemeToJsonDefault } from '@modou/refine'
import {
  buttonWidgetMetadata,
  rowWidgetMetadata,
  colWidgetMetadata,
  RowWidget,
  ColWidget,
  ButtonWidget
} from '@modou/widgets'
import { FC, FunctionComponent, ReactComponentElement, ReactElement } from 'react'
import { match } from 'ts-pattern'
import { WidgetBaseProps } from '@modou/core'
import { keyBy } from 'lodash'

const rowDSL = {
  ...schemeToJsonDefault(rowWidgetMetadata.jsonPropsSchema),
  widgetId: 'rowDSL',
  slots: {
    children: ['colDSL']
  }
}
const colDSL = {
  ...schemeToJsonDefault(colWidgetMetadata.jsonPropsSchema),
  widgetId: 'colDSL',
  slots: {
    children: ['buttonDSL']
  }
}
const buttonDSL = {
  ...schemeToJsonDefault(buttonWidgetMetadata.jsonPropsSchema),
  widgetId: 'buttonDSL'
}

export const testRender = () => {
  console.log(
    'rowDSL',
    rowDSL,
    colDSL,
    buttonDSL
  )
}

const ErrorWidget: FC = () => {
  return <div>Error</div>
}

const WidgetWrapper: FC<{
  widgetId: string
  widgetById: Record<string, WidgetBaseProps>
}> = ({ widgetId, widgetById }) => {
  const widget = widgetById[widgetId]
  // TODO any 替换 state 定义
  const Widget = match<string, FunctionComponent<any>>(widget.widgetType)
    .with('RowWidget', () => RowWidget)
    .with('ColWidget', () => ColWidget)
    .with('ButtonWidget', () => ButtonWidget)
    .otherwise(() => ErrorWidget)

  const renderSlots = Object.entries((widget.slots || {})).map(([key, widgetIds]) => {
    return [key, widgetIds.map(widgetId => <WidgetWrapper key={key} widgetId={widgetId} widgetById={widgetById} />)]
  }).reduce<Record<string, Element[]>>((pre, [slotName, widgetElements]) => {
    // FIXME 不知道为什么类型不对😂
    // @ts-expect-error
    pre[slotName] = widgetElements
    return pre
  }, {})

  return <Widget {...widget.props} renderSlots={renderSlots}
                 instance={{
                   id: widgetId,
                   widgetId
                 }} />
}

interface MoDouRenderProps {
  rootWidgetId: string
  widgets: WidgetBaseProps[]
}

export const MoDouRender: FC<MoDouRenderProps> = ({
  widgets,
  rootWidgetId
}) => {
  const widgetById = keyBy(widgets, 'widgetId')
  return <div>
    <WidgetWrapper widgetById={widgetById} widgetId={rootWidgetId} />
  </div>
}
