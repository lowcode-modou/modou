import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { mrStringSetter } from '@modou/setters'
import { FC, useEffect } from 'react'
import { Form, Input } from 'antd'
import { WidgetIcon } from '../_'

const MRSchemeInputWidgetProps = WidgetMetadata.createMRSchemeWidgetProps({
  widgetType: 'InputWidget',
  widgetName: '输入框'
}).extend({
  props: mr.object({
    label: mr.string().default('标签')._extra(mrStringSetter({
      label: '标签',
      description: '标签的文本'
    })),
    defaultValue: mr.string().default('')._extra(mrStringSetter({
      label: '默认值',
      description: '输入框默认内容'
    }))
  })
})

const MRSchemeInputWidgetState = MRSchemeInputWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRSchemeInputWidgetProps.shape.widgetId
  }),
  widgetName: MRSchemeInputWidgetProps.shape.widgetName
})

export const inputWidgetMetadata = WidgetMetadata.createMetadata({
  version: '0.0.1',
  widgetType: 'InputWidget',
  widgetName: '输入框',
  icon: <WidgetIcon type='input'/>,
  mrPropsScheme: MRSchemeInputWidgetProps,
  slots: {}
})

type InputWidgetState = mr.infer<typeof MRSchemeInputWidgetState>

export const InputWidget: FC<InputWidgetState> = ({
  defaultValue,
  label,
  instance
}) => {
  useEffect(() => {
    console.log('我是Input 我重新渲染了')
  })
  useEffect(() => {
    const hackElement = document.querySelector(`[data-hack-widget-id=${instance.widgetId}]`)
    hackElement?.parentElement?.setAttribute('data-widget-id', instance.widgetId)
  }, [instance.widgetId])
  return <Form.Item
    data-hack-widget-id={instance.widgetId}
    label={label}>
    <Input
      defaultValue={defaultValue}
    />
  </Form.Item>
}
