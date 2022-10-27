import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

import { WidgetIcon } from '../_'

enum SlotEnum {
  Children = 'children',
}
export const MRSchemeFormWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'FormWidget',
  widgetName: '表单',
  props: {
    readonly: {
      def: mr.boolean().default(false),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '只读',
        description: '只读',
      },
    },
  },
  slots: {
    [SlotEnum.Children]: mr.array(mr.string()).default([]),
  },
})

export const MRSchemeFormWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeFormWidgetProps,
  {},
)

export const formWidgetMetadata = WidgetMetadata.createMetadata<
  typeof MRSchemeFormWidgetProps,
  typeof MRSchemeFormWidgetState,
  SlotEnum
>({
  version: '0.0.1',
  widgetType: 'FormWidget',
  widgetName: '表单',
  icon: <WidgetIcon type="col" />,
  slots: {
    children: {},
  },
  mrPropsScheme: MRSchemeFormWidgetProps,
  mrStateScheme: MRSchemeFormWidgetState,
  initState: ({ widgetId }) => {
    return {
      instance: {
        id: widgetId,
        widgetId,
        initialized: true,
      },
    }
  },
})
