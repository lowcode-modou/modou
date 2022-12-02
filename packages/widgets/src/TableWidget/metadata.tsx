import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'

import { WidgetIcon } from '../_'

export const MRSchemeTableWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'TableWidget',
  widgetName: '表格',
  props: {},
  slots: {
    children: mr.array(mr.string()).default([]),
  },
})

export const MRSchemeTableWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeTableWidgetProps,
  {},
)

export const tableWidgetMetadata = WidgetMetadata.createMetadata<
  typeof MRSchemeTableWidgetProps,
  typeof MRSchemeTableWidgetState
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
  initState: ({ id }) => {
    return {
      instance: {
        id,
        widgetId: id,
        initialized: true,
      },
    }
  },
})
