import { WidgetFile } from '@modou/meta-vfs'

import { WidgetMetadata } from '../WidgetMetadata'

export const useWidgetMetaSlots = ({
  widgetMeta,
  widget,
}: {
  widgetMeta: WidgetMetadata<any, any>
  widget: WidgetFile
}) => {
  return {
    ...(widgetMeta.slots || {}),
    ...widget.meta.dynamicSlots,
  }
}
