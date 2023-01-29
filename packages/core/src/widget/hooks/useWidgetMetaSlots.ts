import { WidgetFile } from '@modou/meta-vfs'

import { WidgetMetadata } from '../WidgetMetadata'

// TODO 直接从 file 取文件，已有代码，待替换
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
