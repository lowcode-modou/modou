import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

import { WidgetIcon } from '../_'

export const MRSchemeTableWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'TableWidget',
  widgetName: '表格',
  props: {
    dataSource: {
      def: mr.array(mr.object({})).default([]),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '数据源',
        description: '数据源',
      },
    },
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
  slots: {},
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
