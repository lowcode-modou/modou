import { MRSelectOptions } from '../_'
import { mr } from '@modou/refine'
import { mrBooleanSetter, mrSelectSetter } from '@modou/setters'
import { Widget } from '@modou/core'
import { FC, ReactNode } from 'react'
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

const MRSchemeRowWidgetProps = Widget.createMRSchemeWidgetProps<'children'>({
  widgetType: 'RowWidget',
  widgetName: '栅格行',
  props: {
    align: mrSelectSetter(
      mr.nativeEnum(RowWidgetAlignEnum).describe('垂直对齐方式').default(RowWidgetAlignEnum.Top),
      {
        options: AlignOptions
      }
    ),
    // gutter: mr.tuple([mr.number(), mr.number()]).or(mr.number()),
    justify: mrSelectSetter(
      mr.nativeEnum(RowWidgetJustifyEnum).describe('水平排列方式').default(RowWidgetJustifyEnum.Start),
      {
        options: JustifyOptions
      }
    ),
    wrap: mrBooleanSetter(mr.boolean().describe('是否自动换行').default(true))
  },
  slots: {
    children: mr.array(mr.string()).default([])
  }
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

export const rowWidgetMetadata = Widget.createMetadata({
  version: '0.0.1',
  widgetType: 'RowWidget',
  widgetName: '栅格行',
  mrPropsScheme: MRSchemeRowWidgetProps
})

export const RowWidget: FC<RowWidgetState> = ({
  align,
  justify,
  wrap,
  instance,
  renderSlots
}) => {
  return <Row
    data-widget-id={instance.widgetId}
    align={align}
    justify={justify}
    wrap={wrap}
  >{renderSlots.children}</Row>
}
