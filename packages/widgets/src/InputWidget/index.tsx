import { Widget } from '@modou/core'
import { mr } from '@modou/refine'
import { mrStringSetter } from '@modou/setters'
import { FC, useEffect } from 'react'
import { Form, Input } from 'antd'

const MRSchemeInputWidgetProps = Widget.createMRSchemeWidgetProps({
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

export const inputWidgetMetadata = Widget.createMetadata({
  version: '0.0.1',
  widgetType: 'InputWidget',
  widgetName: '输入框',
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
  return <Form.Item label={label}>
    <Input
      data-widget-id={instance.widgetId}
      defaultValue={defaultValue}
    />
  </Form.Item>
}
