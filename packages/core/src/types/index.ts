import { WidgetBaseProps } from '../widget'

export interface App {
  id: string
  name: string
  pages: Page[]
  entities: Entity[]
}

export interface Page {
  id: string
  name: string
  widgets: WidgetBaseProps[]
  rootWidgetId: string
}

export interface EntityField {
  id: string
  name: string
}

export interface Entity {
  id: string
  name: string
  fields: EntityField[]
}
