import { WidgetMetadata } from '@modou/core'
import { WidgetIcon } from '../_'
import { MRSchemeInputWidgetProps } from './types'

export const inputWidgetMetadata = WidgetMetadata.createMetadata({
  version: '0.0.1',
  widgetType: 'InputWidget',
  widgetName: '输入框',
  icon: <WidgetIcon type="input" />,
  mrPropsScheme: MRSchemeInputWidgetProps,
  slots: {},
})
