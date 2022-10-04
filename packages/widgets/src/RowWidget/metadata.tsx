import { WidgetMetadata } from '@modou/core'
import { WidgetIcon } from '../_'
import { MRSchemeRowWidgetProps } from './types'

enum SlotEnum {
  Children = 'children'
}
export const rowWidgetMetadata = WidgetMetadata.createMetadata<SlotEnum>({
  version: '0.0.1',
  widgetType: 'RowWidget',
  widgetName: '栅格行',
  icon: <WidgetIcon type='row'/>,
  mrPropsScheme: MRSchemeRowWidgetProps,
  slots: {
    children: {}
  }
})
