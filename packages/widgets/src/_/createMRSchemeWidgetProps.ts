import { mr } from '@modou/refine'

export const createMRSchemeWidgetProps = (widgetType: `${string}Widget`) => {
  return mr.object({
    widgetId: mr.string(),
    widgetType: mr.literal(widgetType)
  })
}
