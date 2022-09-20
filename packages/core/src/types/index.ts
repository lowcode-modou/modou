import { WidgetBaseProps } from '../widget'

export interface App {
  id: string
  name: string
  pages: Page[]
}

export interface Page {
  id: string
  name: string
  widgets: WidgetBaseProps[]
  rootWidgetId: string
}
