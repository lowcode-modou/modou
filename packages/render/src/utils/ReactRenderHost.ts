import { WidgetBaseProps } from '@modou/core'

type UpdateWidgets = (widgets: WidgetBaseProps[]) => void
type UpdateRootWidgetId = (widgetId: string) => void

export class ReactRenderHost {
  constructor({
    updateWidgets,
    updateRootWidgetId,
  }: {
    updateWidgets: UpdateWidgets
    updateRootWidgetId: UpdateRootWidgetId
  }) {
    this.updateWidgets = updateWidgets
    this.updateRootWidgetId = updateRootWidgetId
  }

  updateWidgets
  updateRootWidgetId
}
