export interface WidgetBlueprint {
  view?: Array<{
    type: string
    size?: { rows: number; cols: number }
    position: { top?: number; left?: number }
    props: Record<string, any>
  }>
  operations?: any
}
export interface WidgetConfigProps {
  rows: number
  columns: number
  blueprint?: WidgetBlueprint
  widgetName: string
  enhancements?: Record<string, unknown> // TODO(abhinav): SPECIFY TYPES
}
