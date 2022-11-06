import { WidgetBaseProps } from '../widget'
import { EntityField } from './entity-field'

export { FieldEnum } from './entity-field'

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

export interface Entity {
  id: string
  name: string
  description: string
  fields: EntityField[]
}

export enum WidgetGroupEnum {
  Button = 'Button',
  Input = 'Input',
  Container = 'Container',
}
