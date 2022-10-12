import { WidgetMetadata } from '@modou/core'
import { WidgetIcon } from '../_'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

export const MRSchemeInputWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'InputWidget',
  widgetName: '输入框',
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
)

export const inputWidgetMetadata = WidgetMetadata.createMetadata({
  version: '0.0.1',
  widgetType: 'InputWidget',
  widgetName: '输入框',
  icon: <WidgetIcon type="input" />,
  mrPropsScheme: MRSchemeInputWidgetProps,
  slots: {},
})
