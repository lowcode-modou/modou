import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

import { WidgetIcon } from '../_'

export const MRSchemeFormWidgetProps = WidgetMetadata.createMRWidgetProps({
  type: 'FormWidget',
  name: '表单',
  props: {
    initialData: {
      def: mr.object({}).default({}),
      setter: {
        type: SetterTypeEnum.String,
        label: '初始值',
        description: '表单初始值',
        textArea: true,
      },
    },
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
    children: mr.array(mr.string()).default([]),
    header: mr.array(mr.string()).default([]),
  },
})

export const MRSchemeFormWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeFormWidgetProps,
  {},
)

export const formWidgetMetadata = WidgetMetadata.createMetadata<
  typeof MRSchemeFormWidgetProps,
  typeof MRSchemeFormWidgetState
>({
  version: '0.0.1',
  type: 'FormWidget',
  name: '表单',
  icon: <WidgetIcon type="col" />,
  slots: {
    children: {
      name: '默认插槽',
    },
    header: {
      name: '表头',
    },
  },
  setters: {},
  mrPropsScheme: MRSchemeFormWidgetProps,
  mrStateScheme: MRSchemeFormWidgetState,
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
