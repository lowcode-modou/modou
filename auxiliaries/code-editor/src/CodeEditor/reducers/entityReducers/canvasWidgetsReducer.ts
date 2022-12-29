import { WidgetProps } from '@modou/code-editor/CodeEditor/widgets/BaseWidget'

export type FlattenedWidgetProps<orType = never> =
  | (WidgetProps & {
      children?: string[]
    })
  | orType
export interface CanvasWidgetsReduxState {
  [widgetId: string]: FlattenedWidgetProps
}
