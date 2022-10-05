import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { mrBooleanSetter, mrSelectSetter } from '@modou/setters'
import { ReactNode } from 'react'
import { RowWidgetAlignEnum, RowWidgetAlignOptions, RowWidgetJustifyEnum, RowWidgetJustifyOptions } from './constants'

export const MRSchemeRowWidgetProps = WidgetMetadata.createMRSchemeWidgetProps({
  widgetType: 'RowWidget',
  widgetName: '栅格行'
}).extend({
  props: mr.object({
    align: mr.nativeEnum(RowWidgetAlignEnum).default(RowWidgetAlignEnum.Top)._extra(mrSelectSetter(
      {
        label: '垂直对齐',
        description: '垂直对齐方式',
        options: RowWidgetAlignOptions
      }
    )),
    // gutter: mr.tuple([mr.number(), mr.number()]).or(mr.number()),
    justify: mr.nativeEnum(RowWidgetJustifyEnum).default(RowWidgetJustifyEnum.Start)._extra(mrSelectSetter(
      {
        label: '水平排列',
        description: '水平排列方式',
        options: RowWidgetJustifyOptions
      }
    )),
    wrap: mr.boolean().default(true)._extra(mrBooleanSetter({
      label: '自动换行',
      description: '是否自动换行'
    }))
  }),
  slots: mr.object({
    children: mr.array(mr.string()).default([])
  })
})

const MRSchemeRowWidgetState = MRSchemeRowWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRSchemeRowWidgetProps.shape.widgetId
  }),
  widgetName: MRSchemeRowWidgetProps.shape.widgetName
})

export type RowWidgetState = mr.infer<typeof MRSchemeRowWidgetState> & {
  renderSlots: Record<keyof mr.infer<typeof MRSchemeRowWidgetProps.shape.slots>, ReactNode>
  renderSlotNames: Record<keyof mr.infer<typeof MRSchemeRowWidgetProps.shape.slots>, string>
}
