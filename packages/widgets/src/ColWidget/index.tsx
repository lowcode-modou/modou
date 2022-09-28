import { mr } from '@modou/refine'
import { mrNumberSetter } from '@modou/setters'
import { Widget } from '@modou/core'
import { FC, ReactNode, useEffect } from 'react'
import { Col } from 'antd'

const MRSchemeColWidgetProps = Widget.createMRSchemeWidgetProps({
  widgetType: 'ColWidget',
  widgetName: '栅格列'
}).extend({
  props: mr.object({
    span: mr.number().default(12)._extra(mrNumberSetter({
      label: '占位数',
      description: '栅格占位格数，为 0 时相当于 display: none'
    }))
  }),
  slots: mr.object({
    children: mr.array(mr.string()).default([])
  })
})

const MRSchemeColWidgetState = MRSchemeColWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRSchemeColWidgetProps.shape.widgetId
  }),
  widgetName: MRSchemeColWidgetProps.shape.widgetName
})

// TODO 自动提取 renderSlots
type ColWidgetState = mr.infer<typeof MRSchemeColWidgetState> & {
  renderSlots: Record<keyof mr.infer<typeof MRSchemeColWidgetProps.shape.slots>, ReactNode>
}

enum SlotEnum {
  Children = 'children'
}

export const colWidgetMetadata = Widget.createMetadata<SlotEnum>({
  version: '0.0.1',
  widgetType: 'ColWidget',
  widgetName: '栅格列',
  slots: {
    children: {}
  },
  mrPropsScheme: MRSchemeColWidgetProps
})

export const ColWidget: FC<ColWidgetState> = ({
  span,
  instance,
  renderSlots
}) => {
  useEffect(() => {
    console.log('我是Col 我重新渲染了')
  })
  return <Col
    data-widget-id={instance.widgetId}
    span={span}
  >ColWidget{renderSlots.children}</Col>
}
