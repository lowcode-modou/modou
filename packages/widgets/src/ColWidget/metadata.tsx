import { WidgetIcon } from '../_'
import { MRSchemeColWidgetProps } from './types'
import { WidgetMetadata } from '@modou/core'

enum SlotEnum {
  Children = 'children'
}
export const colWidgetMetadata = WidgetMetadata.createMetadata<SlotEnum>({
  version: '0.0.1',
  widgetType: 'ColWidget',
  widgetName: '栅格列',
  icon: <WidgetIcon type='col'/>,
  slots: {
    children: {}
  },
  mrPropsScheme: MRSchemeColWidgetProps
})
