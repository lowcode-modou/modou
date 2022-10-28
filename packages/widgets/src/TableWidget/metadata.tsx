import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'

import { WidgetIcon } from '../_'

enum SlotEnum {
  Children = 'children',
}

export const MRSchemeTableWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'TableWidget',
  widgetName: '表格',
  props: {},
  slots: {
    [SlotEnum.Children]: mr.array(mr.string()).default([]),
  },
})

export const MRSchemeTableWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeTableWidgetProps,
  {},
)

export const tableWidgetMetadata = WidgetMetadata.createMetadata<
  typeof MRSchemeTableWidgetProps,
  typeof MRSchemeTableWidgetState,
  SlotEnum
>({
  version: '0.0.1',
  widgetType: 'TableWidget',
  widgetName: '表格',
  icon: <WidgetIcon type="col" />,
  slots: {
    children: {},
  },
  mrPropsScheme: MRSchemeTableWidgetProps,
  mrStateScheme: MRSchemeTableWidgetState,
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
