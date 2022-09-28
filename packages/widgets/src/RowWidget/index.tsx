import { MRSelectOptions } from '../_'
import { mr } from '@modou/refine'
import { mrBooleanSetter, mrSelectSetter } from '@modou/setters'
import { Widget } from '@modou/core'
import { FC, ReactNode, useEffect } from 'react'
import { Row } from 'antd'

enum RowWidgetAlignEnum {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
}

enum RowWidgetJustifyEnum {
  Start = 'start',
  End = 'end',
  Center = 'center',
  SpaceAround = 'space-around',
  SpaceBetween = 'space-between',
  SpaceEvenly = 'space-evenly'
}

const AlignOptions: MRSelectOptions = [
  {
    label: '居上',
    value: RowWidgetAlignEnum.Top
  },
  {
    label: '居中',
    value: RowWidgetAlignEnum.Middle
  },
  {
    label: '居下',
    value: RowWidgetAlignEnum.Bottom
  }
]

const JustifyOptions: MRSelectOptions = [
  {
    label: RowWidgetJustifyEnum.Start,
    value: RowWidgetJustifyEnum.Start
  },
  {
    label: RowWidgetJustifyEnum.End,
    value: RowWidgetJustifyEnum.End
  },
  {
    label: RowWidgetJustifyEnum.Center,
    value: RowWidgetJustifyEnum.Center
  },
  {
    label: RowWidgetJustifyEnum.SpaceAround,
    value: RowWidgetJustifyEnum.SpaceAround
  },
  {
    label: RowWidgetJustifyEnum.SpaceBetween,
    value: RowWidgetJustifyEnum.SpaceBetween
  },
  {
    label: RowWidgetJustifyEnum.SpaceEvenly,
    value: RowWidgetJustifyEnum.SpaceEvenly
  }
]

const MRSchemeRowWidgetProps = Widget.createMRSchemeWidgetProps({
  widgetType: 'RowWidget',
  widgetName: '栅格行'
}).extend({
  props: mr.object({
    align: mr.nativeEnum(RowWidgetAlignEnum).default(RowWidgetAlignEnum.Top)._extra(mrSelectSetter(
      {
        label: '垂直对齐',
        description: '垂直对齐方式',
        options: AlignOptions
      }
    )),
    // gutter: mr.tuple([mr.number(), mr.number()]).or(mr.number()),
    justify: mr.nativeEnum(RowWidgetJustifyEnum).default(RowWidgetJustifyEnum.Start)._extra(mrSelectSetter(
      {
        label: '水平排列',
        description: '水平排列方式',
        options: JustifyOptions
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

type RowWidgetState = mr.infer<typeof MRSchemeRowWidgetState> & {
  renderSlots: Record<keyof mr.infer<typeof MRSchemeRowWidgetProps.shape.slots>, ReactNode>
}

enum SlotEnum {
  Children = 'children'
}

export const rowWidgetMetadata = Widget.createMetadata<SlotEnum>({
  version: '0.0.1',
  widgetType: 'RowWidget',
  widgetName: '栅格行',
  mrPropsScheme: MRSchemeRowWidgetProps,
  slots: {
    children: {}
  }
})

export const RowWidget: FC<RowWidgetState> = ({
  align,
  justify,
  wrap,
  instance,
  renderSlots
}) => {
  useEffect(() => {
    console.log('我是Row 我重新渲染了', instance.widgetId)
  })
  return <Row
    data-widget-id={instance.widgetId}
    align={align}
    justify={justify}
    wrap={wrap}
  >RowWidget{renderSlots.children}</Row>
}
