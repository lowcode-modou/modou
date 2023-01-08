import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

import { WidgetIcon } from '../_'

export const MRSchemeInputWidgetProps = WidgetMetadata.createMRWidgetProps({
  type: 'InputWidget',
  name: '输入框',
  props: {
    label: {
      def: mr.string().default('标签'),
      setter: {
        type: SetterTypeEnum.String,
        label: '标签',
        description: '标签的文本',
      },
    },
    defaultValue: {
      def: mr.string().default(''),
      setter: {
        type: SetterTypeEnum.String,
        label: '默认值',
        description: '输入框默认内容',
      },
    },
  },
})

export const MRSchemeInputWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeInputWidgetProps,
  {
    value: mr.string().describe('输入框的值'),
  },
)

export const inputWidgetMetadata = WidgetMetadata.createMetadata({
  version: '0.0.1',
  widgetType: 'InputWidget',
  widgetName: '输入框',
  icon: <WidgetIcon type="input" />,
  mrPropsScheme: MRSchemeInputWidgetProps,
  mrStateScheme: MRSchemeInputWidgetState,
  slots: {},
  setters: {},
  initState: ({ id, props }) => {
    return {
      value: props.defaultValue,
      instance: {
        id,
        widgetId: id,
        initialized: true,
      },
    }
  },
})
