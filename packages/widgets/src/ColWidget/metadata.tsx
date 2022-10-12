import { WidgetIcon } from '../_'
import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

enum SlotEnum {
  Children = 'children',
}

export const MRSchemeColWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'ColWidget',
  widgetName: '栅格列',
  props: {
    span: {
      def: mr.number().default(12),
      setter: {
        type: SetterTypeEnum.Number,
        label: '占位数',
        description: '栅格占位格数，为 0 时相当于 display: none',
      },
    },
  },
  slots: {
    [SlotEnum.Children]: mr.array(mr.string()).default([]),
  },
})

export const MRSchemeColWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeColWidgetProps,
)

export const colWidgetMetadata = WidgetMetadata.createMetadata<SlotEnum>({
  version: '0.0.1',
  widgetType: 'ColWidget',
  widgetName: '栅格列',
  icon: <WidgetIcon type="col" />,
  slots: {
    children: {},
  },
  mrPropsScheme: MRSchemeColWidgetProps,
})
