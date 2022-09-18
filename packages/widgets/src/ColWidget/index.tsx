import { mr } from '@modou/refine'
import { mrNumberSetter } from '@modou/setters'
import { Widget } from '@modou/core'
import { FC, ReactNode } from 'react'
import { Col } from 'antd'

const MRSchemeColWidgetProps = Widget.createMRSchemeWidgetProps<'children'>({
  widgetType: 'ColWidget',
  widgetName: '栅格列',
  props: {
    span: mrNumberSetter(mr.number().describe('栅格占位格数，为 0 时相当于 display: none').default(12))
  },
  slots: {
    children: mr.array(mr.string()).default([])
  }
})

const MRSchemeColWidgetState = MRSchemeColWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRSchemeColWidgetProps.shape.widgetId
  }),
  widgetName: MRSchemeColWidgetProps.shape.widgetName
})

type ColWidgetState = mr.infer<typeof MRSchemeColWidgetState> & {
  renderSlots: Record<keyof mr.infer<typeof MRSchemeColWidgetProps.shape.slots>, ReactNode>
}

export const colWidgetMetadata = Widget.createMetadata({
  version: '0.0.1',
  widgetType: 'ColWidget',
  widgetName: '栅格行',
  mrPropsScheme: MRSchemeColWidgetProps
})

export const ColWidget: FC<ColWidgetState> = ({
  span,
  instance,
  renderSlots
}) => {
  return <Col
    data-widget-id={instance.widgetId}
    span={span}
  >{renderSlots.children}</Col>
}
