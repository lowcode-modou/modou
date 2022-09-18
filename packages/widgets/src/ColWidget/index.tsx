import { createMRSchemeWidgetProps } from '../_'
import { mr } from '@modou/refine'
import { mrNumberSetter } from '@modou/setters'
import { WidgetMetadata } from '@modou/core'
import { FC, ReactNode } from 'react'
import { Col } from 'antd'

const MRSchemeColWidgetProps = createMRSchemeWidgetProps('ColWidget').extend({
  props: mr.object({
    span: mrNumberSetter(mr.number().describe('栅格占位格数，为 0 时相当于 display: none').default(12))
  }),
  slots: mr.object({
    children: mr.array(mr.string())
  })
})

const MRSchemeColWidgetState = MRSchemeColWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRSchemeColWidgetProps.shape.widgetId
  })
})

type ColWidgetState = mr.infer<typeof MRSchemeColWidgetState> & {
  renderSlots: Record<keyof mr.infer<typeof MRSchemeColWidgetProps.shape.slots>, ReactNode>
}

export const colWidgetMetadata = WidgetMetadata.create({
  version: '0.0.1',
  widgetType: 'ColWidget',
  widgetName: '栅格行',
  mrPropsScheme: MRSchemeColWidgetProps
})

export const ColWidget: FC<ColWidgetState> = ({
  span,
  renderSlots
}) => {
  return <Col
    span={span}
  >{renderSlots.children}</Col>
}
