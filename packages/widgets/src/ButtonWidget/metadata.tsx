import { WidgetMetadata } from '@modou/core'
import { WidgetIcon } from '../_'
import { MRSchemeButtonWidgetProps } from './types'

export const buttonWidgetMetadata = WidgetMetadata.createMetadata({
  version: '0.0.1',
  widgetType: 'ButtonWidget',
  widgetName: '按钮',
  icon: <WidgetIcon type="button" />,
  mrPropsScheme: MRSchemeButtonWidgetProps,
  slots: {},
})
