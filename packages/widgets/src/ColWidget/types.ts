import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { mrNumberSetter } from '@modou/setters'
import { ReactNode } from 'react'

export const MRSchemeColWidgetProps = WidgetMetadata.createMRSchemeWidgetProps({
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
export type ColWidgetState = mr.infer<typeof MRSchemeColWidgetState> & {
  renderSlots: Record<keyof mr.infer<typeof MRSchemeColWidgetProps.shape.slots>, ReactNode>
  renderSlotNames: Record<keyof mr.infer<typeof MRSchemeColWidgetProps.shape.slots>, string>
}
